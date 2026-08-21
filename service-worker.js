/*
 * Hunny Collection PK — service worker
 *
 * Caching strategy is deliberately split, because the wrong strategy here
 * would show customers old prices:
 *
 *   products-data.js  -> network first. A stale price is worse than a slow
 *                        page, so the network always gets first refusal.
 *   HTML pages        -> network first, cache as fallback. Keeps the shop
 *                        usable on a dropped connection.
 *   images, css, js   -> cache first. These change rarely and are the
 *                        heaviest part of the page.
 *   Firebase / CDN    -> never cached. Live data must stay live.
 */

const VERSION = 'hunny-v2';
const SHELL = 'shell-' + VERSION;
const RUNTIME = 'runtime-' + VERSION;

// The minimum needed for the app to open at all with no connection.
const SHELL_FILES = [
  '/',
  '/index.html',
  '/shop.html',
  '/cart.html',
  '/offline.html',
  '/style.css',
  '/app.js',
  '/assets/logo-new.png',
  '/assets/icons/icon-192.png',
  '/manifest.json'
];

// Anything that must always come from the network.
const NEVER_CACHE = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'www.gstatic.com',
  'googletagmanager.com',
  'google-analytics.com',
  'cdnjs.cloudflare.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL)
      // addAll fails the whole install if one file 404s, so each is added
      // individually and a missing one is simply skipped.
      .then((cache) => Promise.all(
        SHELL_FILES.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] skipped', url, err.message))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((n) => n !== SHELL && n !== RUNTIME)
          .map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

function isNeverCache(url) {
  return NEVER_CACHE.some((host) => url.includes(host));
}

async function networkFirst(request, cacheName) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200 && fresh.type === 'basic') {
      const cache = await caches.open(cacheName);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const offline = await caches.match('/offline.html');
      if (offline) return offline;
    }
    throw err;
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.status === 200 && fresh.type === 'basic') {
    const cache = await caches.open(cacheName);
    cache.put(request, fresh.clone());
  }
  return fresh;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only GET is cacheable, and a POST to Firestore must never be touched.
  if (request.method !== 'GET') return;

  const url = request.url;
  if (isNeverCache(url)) return;

  // Admin pages are excluded: caching a panel that shows live orders would
  // be actively misleading.
  if (url.includes('/admin') || url.includes('hc-staff') ||
      url.includes('hc-export') || url.includes('hc-builder')) {
    return;
  }

  // A stale product price is the one thing that must never happen.
  if (url.includes('products-data.js')) {
    event.respondWith(networkFirst(request, RUNTIME));
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request, RUNTIME));
    return;
  }

  if (['image', 'style', 'script', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request, RUNTIME));
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME));
});

// Lets the page tell a waiting worker to take over immediately.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
