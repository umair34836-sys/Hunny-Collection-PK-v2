/*
 * Meta (Facebook) Pixel
 *
 * Aap ko sirf neeche wali line badalni hai. Baaki sab khud chalta hai.
 *
 * Pixel ID kahan se milega:
 *   1. business.facebook.com kholein
 *   2. Baayen menu -> All tools -> Events Manager
 *   3. Data sources -> apna pixel chunein
 *   4. Naam ke neeche 15-16 ginti ka number likha hoga. Wahi ID hai.
 *
 * Agar pixel bana hi nahi:
 *   Events Manager -> Connect data sources -> Web -> Meta Pixel -> Connect
 */

const PIXEL_ID = '000000000000000';   // <-- yahan apna Pixel ID likhein

/* ============================================================
   Neeche kuch badalne ki zaroorat nahi
   ============================================================ */
(function () {
  'use strict';

  // Placeholder chhoda hua hai? To kuch load hi na karein, warna Meta ko
  // ek na-maujood ID par requests jati rahengi.
  if (!PIXEL_ID || /^0+$/.test(PIXEL_ID) || PIXEL_ID.length < 15) {
    console.log('[Pixel] ID abhi set nahi hui. facebook-pixel.js kholein aur PIXEL_ID badlein.');
    return;
  }

  // Admin pages dukaan ke maalik ka apna kaam hain. Inhe ginne se Meta ko
  // ghalat signal jata hai aur ad ki targeting kharab hoti hai.
  if (/admin|hc-staff|hc-export|hc-builder|settings|investor|seo-dashboard/i.test(location.pathname)) {
    return;
  }

  /* ---- Meta ka apna loader ---- */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  /* ============================================================
     dataLayer se Meta tak
     Site pehle se ecommerce events dataLayer par bhejti hai (GA4 ke liye).
     Yahan wohi events utha kar Meta ke naamon me badal diye jate hain, taake
     ek hi jagah se dono chalein aur donon ki ginti hamesha barabar rahe.
     ============================================================ */
  var MAP = {
    view_item:      'ViewContent',
    add_to_cart:    'AddToCart',
    view_cart:      'ViewCart',
    begin_checkout: 'InitiateCheckout',
    purchase:       'Purchase'
  };

  function toContents(items) {
    return (items || []).map(function (i) {
      return {
        id: String(i.item_id || ''),
        quantity: Number(i.quantity || 1),
        item_price: Number(i.price || 0)
      };
    });
  }

  window.dataLayer = window.dataLayer || [];
  var seen = 0;
  var busy = false;

  function drain() {
    // fbq apne andar dataLayer ko chhoo sakta hai, aur dataLayer.push wrapped
    // hai. Bina is pehre ke drain khud ko dobara bula leta hai aur ek hi
    // purchase hazaaron baar chala jata hai.
    if (busy) return;
    busy = true;

    try {
      while (seen < window.dataLayer.length) {
        var item = window.dataLayer[seen];
        seen++;                       // parh liya ka nishan pehle, chalane se pehle

        if (!item || !item.event || !item.ecommerce) continue;
        var name = MAP[item.event];
        if (!name) continue;

        var e = item.ecommerce;
        var payload = {
          currency: e.currency || 'PKR',
          value: Number(e.value || 0),
          content_type: 'product',
          contents: toContents(e.items),
          content_ids: (e.items || []).map(function (i) { return String(i.item_id || ''); })
        };

        // Purchase ke saath order ka number bhejna zaroori hai. Iske bagair
        // agar customer thank-you page refresh kar de to Meta usay do sale
        // gin leta hai.
        if (item.event === 'purchase' && e.transaction_id) {
          fbq('track', name, payload, { eventID: String(e.transaction_id) });
        } else {
          fbq('track', name, payload);
        }
      }
    } finally {
      busy = false;
    }
  }

  var origPush = window.dataLayer.push;
  window.dataLayer.push = function () {
    var r = origPush.apply(window.dataLayer, arguments);
    try { drain(); } catch (err) { /* tracking kabhi page na tore */ }
    return r;
  };

  // Jo events is file ke load hone se pehle push ho chuke hain, unhe bhi utha lo
  setTimeout(drain, 400);
  setTimeout(drain, 1800);
})();
