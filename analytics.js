/*
 * Google Analytics 4
 *
 * Aap ko sirf neeche wali line badalni hai. Baaki sab khud chalta hai.
 *
 * GA4 ID kahan se milega:
 *   1. analytics.google.com kholein
 *   2. Admin (neeche baayen kone me gear) -> Data streams -> apni website
 *   3. Upar daayen "MEASUREMENT ID" likha hoga, aise: G-ABC1234XYZ
 */

const GA4_ID = 'G-4TRMYR09SQ';   // Hunny Collection PK

/* ============================================================
   Neeche kuch badalne ki zaroorat nahi
   ============================================================ */
(function () {
  'use strict';

  // Left as the placeholder? Then load nothing rather than firing requests
  // at an ID that does not exist.
  if (!GA4_ID || GA4_ID.indexOf('X') > -1) {
    console.log('[Analytics] GA4 ID abhi set nahi hua. analytics.js kholein aur GA4_ID badlein.');
    return;
  }

  // Admin pages are the shop owner's own work, not customer behaviour.
  // Counting them would make the numbers look better than they are.
  var p = location.pathname;
  if (/admin|hc-staff|hc-export|hc-builder|settings|investor|seo-dashboard/i.test(p)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA4_ID, {
    // Pakistan me bohat se log privacy ko lekar hassas hain, aur ye setting
    // IP ka aakhri hissa kaat deti hai. Rehnumai ke liye kaafi hai.
    anonymize_ip: true
  });

  // ---------------------------------------------------------
  // dataLayer se GA4 tak
  // Site pehle se dataLayer par ecommerce events bhejti hai. Ye unhe utha
  // kar GA4 ko de deta hai, taake GTM ke andar kuch banane ki zaroorat na ho.
  // ---------------------------------------------------------
  var KNOWN = ['view_item', 'add_to_cart', 'view_cart',
               'begin_checkout', 'purchase', 'remove_from_cart'];
  var seen = 0;
  var draining = false;

  function drain() {
    // gtag() itself pushes to dataLayer, and dataLayer.push is wrapped to
    // call drain(). Without this guard drain() re-enters itself before the
    // current item is marked as read, and one purchase is forwarded
    // thousands of times over.
    if (draining) return;
    draining = true;

    try {
      while (seen < window.dataLayer.length) {
        var item = window.dataLayer[seen];
        seen++;                       // marked read BEFORE it is acted on
        if (!item || !item.event || !item.ecommerce) continue;
        if (KNOWN.indexOf(item.event) === -1) continue;
        gtag('event', item.event, item.ecommerce);
      }
    } finally {
      draining = false;
    }
  }

  // dataLayer.push is wrapped so nothing pushed later is missed, and the
  // queue is drained once now for anything pushed before this file loaded.
  var original = window.dataLayer.push;
  window.dataLayer.push = function () {
    var r = original.apply(window.dataLayer, arguments);
    try { drain(); } catch (e) {}
    return r;
  };
  drain();
})();
