/*
 * First-party analytics.
 *
 * GA4's own numbers cannot be read back into this admin panel: the Data API
 * needs a service-account private key, and anything put in a static page is
 * readable by everyone. So this keeps its own counts in Firestore instead.
 *
 * Two things are written, and the shape is chosen to keep reads cheap:
 *
 *   stats/YYYY-MM-DD   one document per day, counters bumped with
 *                      increment(). The admin page reads 30 documents to
 *                      draw a month, not 30,000.
 *
 *   live/<sessionId>   one document per visitor, overwritten on every page.
 *                      Bounded by visitors, not by pageviews, so it cannot
 *                      grow without limit.
 */
(function () {
  'use strict';

  // Admin pages are the owner's own work. Counting them would make the
  // numbers flattering and useless.
  var p = location.pathname;
  if (/admin|hc-staff|hc-export|hc-builder|settings|investor|seo-dashboard/i.test(p)) return;

  var SESSION_KEY = 'hc-session';
  var LAST_BEAT = 'hc-beat';
  var BEAT_GAP = 60 * 1000;          // never write more than once a minute

  function sessionId() {
    try {
      var id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(SESSION_KEY, id);
        sessionStorage.setItem('hc-new', '1');
      }
      return id;
    } catch (e) {
      return 's' + Math.random().toString(36).slice(2, 10);
    }
  }

  function isNewSession() {
    try {
      if (sessionStorage.getItem('hc-new') === '1') {
        sessionStorage.removeItem('hc-new');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function today() {
    var d = new Date();
    // Pakistan time, so "today" matches the shop's day rather than UTC's.
    var pk = new Date(d.getTime() + (5 * 60 - d.getTimezoneOffset()) * 60000);
    return pk.toISOString().slice(0, 10);
  }

  // Firestore map keys cannot contain dots or slashes.
  function safeKey(s) {
    return String(s || '').replace(/[.#$/\[\]]/g, '_').slice(0, 60) || 'unknown';
  }

  function pageKey() {
    var name = location.pathname.split('/').pop() || 'index.html';
    return safeKey(name);
  }

  function source() {
    var ref = document.referrer || '';
    var q = location.search.toLowerCase();
    if (/utm_source=([^&]+)/.test(q)) return safeKey(RegExp.$1);
    if (!ref) return 'direct';
    try {
      var h = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
      if (h.indexOf(location.hostname) > -1) return 'internal';
      if (/instagram/.test(h)) return 'instagram';
      if (/facebook|fb\./.test(h)) return 'facebook';
      if (/tiktok/.test(h)) return 'tiktok';
      if (/google/.test(h)) return 'google';
      if (/whatsapp|wa\.me/.test(h)) return 'whatsapp';
      if (/youtube/.test(h)) return 'youtube';
      return safeKey(h);
    } catch (e) {
      return 'other';
    }
  }

  function device() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  }

  var mod = null;
  async function firestore() {
    if (mod) return mod;
    try {
      var app = await import('./firebase-config.js');
      var fs = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      mod = { db: app.db, fs: fs };
      return mod;
    } catch (e) {
      return null;
    }
  }

  async function record(extra) {
    var m = await firestore();
    if (!m) return;
    var inc = m.fs.increment;

    var patch = {
      pageviews: inc(1),
      updatedAt: new Date().toISOString()
    };
    patch['pages.' + pageKey()] = inc(1);
    patch['sources.' + source()] = inc(1);
    patch['devices.' + device()] = inc(1);
    if (isNewSession()) patch.sessions = inc(1);
    if (extra) for (var k in extra) patch[k] = extra[k];

    try {
      await m.fs.setDoc(m.fs.doc(m.db, 'stats', today()), patch, { merge: true });
    } catch (e) {
      console.warn('[stats] not recorded:', e.code || e.message);
    }

    // Heartbeat for the live view. Overwritten, never appended.
    try {
      var beat = Number(sessionStorage.getItem(LAST_BEAT) || 0);
      if (Date.now() - beat > BEAT_GAP) {
        sessionStorage.setItem(LAST_BEAT, String(Date.now()));
        await m.fs.setDoc(m.fs.doc(m.db, 'live', sessionId()), {
          at: Date.now(),
          page: pageKey(),
          source: source(),
          device: device()
        });
      }
    } catch (e) { /* live view is a nicety, never worth an error */ }
  }

  // ---- pageview ----
  if (document.readyState === 'complete') setTimeout(record, 800);
  else window.addEventListener('load', function () { setTimeout(record, 800); });

  // ---- ecommerce events, taken off the same dataLayer the site already uses ----
  window.dataLayer = window.dataLayer || [];
  var seen = 0;
  var busy = false;

  async function drain() {
    if (busy) return;
    busy = true;
    try {
      var m = await firestore();
      if (!m) return;
      var inc = m.fs.increment;

      while (seen < window.dataLayer.length) {
        var item = window.dataLayer[seen];
        seen++;
        if (!item || !item.event || !item.ecommerce) continue;

        var patch = null;
        if (item.event === 'add_to_cart') patch = { 'events.add_to_cart': inc(1) };
        else if (item.event === 'begin_checkout') patch = { 'events.begin_checkout': inc(1) };
        else if (item.event === 'purchase') {
          patch = {
            'events.purchase': inc(1),
            revenue: inc(Math.round(Number(item.ecommerce.value) || 0))
          };
        } else if (item.event === 'view_item') patch = { 'events.view_item': inc(1) };

        if (patch) {
          try {
            await m.fs.setDoc(m.fs.doc(m.db, 'stats', today()), patch, { merge: true });
          } catch (e) { /* counters are not worth breaking a page over */ }
        }
      }
    } finally {
      busy = false;
    }
  }

  var origPush = window.dataLayer.push;
  window.dataLayer.push = function () {
    var r = origPush.apply(window.dataLayer, arguments);
    try { drain(); } catch (e) {}
    return r;
  };
  setTimeout(drain, 1500);
})();
