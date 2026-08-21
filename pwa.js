/*
 * Turns the site into an installable app.
 *
 * Two deliberate choices about how the install is offered:
 *
 *  1. The one-time ask appears once. If the customer says no, that is final
 *     and the ask never appears again. Nagging on every visit is the fastest
 *     way to make someone leave a shop.
 *
 *  2. A quiet "Install App" link sits in the menu at all times. So saying no
 *     never removes the option, it just stops the interruption. The customer
 *     installs when they decide to, not when we decide to ask.
 */
(function () {
  'use strict';

  var ASKED_KEY = 'pwa-asked';       // set once the one-time ask has happened
  var deferred = null;               // the browser's install event, held for later

  // ---------- service worker ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (reg) {
          reg.addEventListener('updatefound', function () {
            var sw = reg.installing;
            if (!sw) return;
            sw.addEventListener('statechange', function () {
              if (sw.state === 'installed' && navigator.serviceWorker.controller) {
                sw.postMessage('SKIP_WAITING');
              }
            });
          });
        })
        .catch(function (err) {
          console.warn('[PWA] service worker not registered:', err.message);
        });
    });
  }

  function installed() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  function alreadyAsked() {
    try { return localStorage.getItem(ASKED_KEY) === '1'; }
    catch (e) { return false; }
  }

  function markAsked() {
    try { localStorage.setItem(ASKED_KEY, '1'); } catch (e) {}
  }

  // ---------- shared styles ----------
  function addStyles() {
    if (document.getElementById('pwa-css')) return;
    var css = document.createElement('style');
    css.id = 'pwa-css';
    css.textContent =
      /* quiet link in the menu */
      '.pwa-menu-item a{display:flex;align-items:center;gap:7px}' +
      '.pwa-menu-item .pwa-dot{width:7px;height:7px;border-radius:50%;' +
        'background:#25D366;flex:0 0 auto}' +

      /* floating pill, used only when there is no menu to sit in */
      '#pwa-chip{position:fixed;left:14px;bottom:16px;z-index:1100;' +
        'display:flex;align-items:center;gap:8px;background:#fff;' +
        'border:1px solid #e6e0d8;border-radius:50px;padding:9px 15px 9px 10px;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.12);cursor:pointer;font-family:inherit;' +
        'font-size:13.5px;font-weight:600;color:#171412}' +
      '#pwa-chip img{width:24px;height:24px;border-radius:6px}' +

      /* the one-time ask */
      '#pwa-ask{position:fixed;inset:0;z-index:1300;background:rgba(15,12,10,.55);' +
        'display:flex;align-items:flex-end;justify-content:center;padding:16px;' +
        'opacity:0;transition:opacity .22s}' +
      '#pwa-ask.on{opacity:1}' +
      '#pwa-ask .sheet{background:#fff;border-radius:18px;padding:22px 20px 18px;' +
        'max-width:400px;width:100%;text-align:center;transform:translateY(20px);' +
        'transition:transform .22s}' +
      '#pwa-ask.on .sheet{transform:translateY(0)}' +
      '#pwa-ask img{width:62px;height:62px;border-radius:15px;margin-bottom:13px}' +
      '#pwa-ask h3{margin:0 0 7px;font-size:18px;color:#171412}' +
      '#pwa-ask p{margin:0 0 18px;font-size:14.5px;color:#7a7168;line-height:1.55}' +
      '#pwa-ask .yes{width:100%;background:linear-gradient(135deg,#D9AF57,#B8862F);' +
        'color:#1a1409;border:0;border-radius:10px;padding:14px;font-size:15.5px;' +
        'font-weight:700;font-family:inherit;cursor:pointer}' +
      '#pwa-ask .no{width:100%;background:none;border:0;color:#9a9289;' +
        'padding:13px;font-size:14px;font-family:inherit;cursor:pointer}';
    document.head.appendChild(css);
  }

  // ---------- the always-available option ----------
  function showPersistentOption() {
    if (installed() || !deferred) return;
    if (document.getElementById('pwa-chip') ||
        document.querySelector('.pwa-menu-item')) return;

    addStyles();

    // Preferred home is the site menu: it is always reachable and never
    // covers the page.
    var menu = document.querySelector('.nav-menu');
    if (menu) {
      var li = document.createElement('li');
      li.className = 'pwa-menu-item';
      li.innerHTML = '<a href="#" role="button"><span class="pwa-dot"></span>Install App</a>';
      li.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        runInstall();
      });
      menu.appendChild(li);
      return;
    }

    // Fallback for any page without the standard menu.
    var chip = document.createElement('button');
    chip.id = 'pwa-chip';
    chip.type = 'button';
    chip.innerHTML = '<img src="/assets/icons/icon-96.png" alt="">Install App';
    chip.addEventListener('click', runInstall);
    document.body.appendChild(chip);
  }

  function removePersistentOption() {
    var chip = document.getElementById('pwa-chip');
    if (chip) chip.remove();
    var item = document.querySelector('.pwa-menu-item');
    if (item) item.remove();
  }

  // ---------- the install itself ----------
  function runInstall() {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function (choice) {
      if (choice.outcome === 'accepted') {
        deferred = null;
        removePersistentOption();
      }
      // If they decline the browser's own dialog, the menu link stays put.
      // They asked to see it, so it is not an interruption.
    });
  }

  // ---------- the one-time ask ----------
  function askOnce() {
    if (alreadyAsked() || installed() || !deferred) return;

    addStyles();
    markAsked();   // written immediately, so a reload cannot re-trigger it

    var wrap = document.createElement('div');
    wrap.id = 'pwa-ask';
    wrap.innerHTML =
      '<div class="sheet">' +
        '<img src="/assets/icons/icon-192.png" alt="">' +
        '<h3>Hunny Collection app install karein?</h3>' +
        '<p>Phone par icon ban jayega, tez khulegi, aur internet na ho tab bhi ' +
        'aap ka cart mehfooz rahega.</p>' +
        '<button type="button" class="yes">Install Karein</button>' +
        '<button type="button" class="no">Abhi nahi</button>' +
      '</div>';

    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('on'); });

    function close() {
      wrap.classList.remove('on');
      setTimeout(function () { wrap.remove(); }, 240);
    }

    wrap.querySelector('.yes').addEventListener('click', function () {
      close();
      runInstall();
    });

    wrap.querySelector('.no').addEventListener('click', close);

    // Tapping the dark area counts as "not now" too.
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) close();
    });
  }

  // ---------- wiring ----------
  function activate(e) {
    deferred = e;
    showPersistentOption();
    if (!alreadyAsked()) setTimeout(askOnce, 4000);
  }

  // The event may already have fired and been caught by the stub in <head>,
  // or it may fire later. Both paths are handled.
  if (window.__hcInstall) {
    activate(window.__hcInstall);
  } else {
    window.addEventListener('hc-installable', function () {
      if (window.__hcInstall) activate(window.__hcInstall);
    });
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      activate(e);
    });
  }

  // If nothing appears, this says why. Chrome will not offer an install
  // unless every one of these is satisfied, and it stays silent about which
  // one failed.
  setTimeout(function () {
    if (deferred || installed()) return;
    var reasons = [];
    if (location.protocol !== 'https:' && location.hostname !== 'localhost')
      reasons.push('site HTTPS par nahi hai');
    if (!document.querySelector('link[rel="manifest"]'))
      reasons.push('manifest.json ka link page me nahi hai');
    if (!('serviceWorker' in navigator))
      reasons.push('is browser me service worker nahi chalta');
    else if (!navigator.serviceWorker.controller)
      reasons.push('service worker ne page abhi sambhala nahi — ek baar page refresh karein');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent))
      reasons.push('iPhone par Chrome install ka button nahi deta: Share > Add to Home Screen');

    console.log('[PWA] Install ka button kyun nahi dikha:',
      reasons.length ? reasons : ['sab theek lagta hai — Chrome ko thodi browsing chahiye, ya app pehle se install hai']);
  }, 9000);

  window.addEventListener('appinstalled', function () {
    deferred = null;
    markAsked();
    removePersistentOption();
    var ask = document.getElementById('pwa-ask');
    if (ask) ask.remove();
  });
})();
