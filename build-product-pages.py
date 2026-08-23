#!/usr/bin/env python3
"""
Builds one real HTML page per product.

Why this exists: every product currently lives at product.html?id=XXX and is
filled in by JavaScript. To Google that is a single empty page, not 90
products. These generated files contain the name, price, description and
image directly in the HTML, so a search engine can read them without running
any JavaScript.
"""

import json
import re
import os
import html
from datetime import date

SITE = "https://hunnycollectionpk.com"
PHONE = "923018858303"
OUT_DIR = "."


def load_products(path="products-data.js"):
    t = open(path, encoding="utf-8").read()
    start = t.index("window.HUNNY_PRODUCTS")
    arr = t[t.index("[", start): t.rindex("]") + 1]
    return json.loads(arr)


def slugify(name, pid):
    s = (name or "").lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    words = s.split("-")[:8]
    s = "-".join(w for w in words if w)
    if not s:
        s = "product"
    return f"{s}-{pid[:6].lower()}"


def clean_desc(d, limit=None):
    if not d:
        return ""
    d = re.sub(r"\*([^*]+)\*", r"\1", d)          # strip *markers*
    d = re.sub(r"[ \t]+", " ", d)
    d = re.sub(r"\n{3,}", "\n\n", d).strip()
    if limit and len(d) > limit:
        cut = d[:limit]
        if " " in cut:
            cut = cut[:cut.rindex(" ")]
        d = cut + "..."
    return d


def desc_html(d):
    """Turn the plain description into paragraphs and bullet lists."""
    if not d:
        return "<p>Details coming soon.</p>"
    out = []
    bullets = []
    for line in d.split("\n"):
        line = line.strip()
        if not line:
            continue
        if line.startswith("-"):
            bullets.append(html.escape(line.lstrip("- ").strip()))
            continue
        if bullets:
            out.append("<ul>" + "".join(f"<li>{b}</li>" for b in bullets) + "</ul>")
            bullets = []
        out.append(f"<p>{html.escape(line)}</p>")
    if bullets:
        out.append("<ul>" + "".join(f"<li>{b}</li>" for b in bullets) + "</ul>")
    return "\n            ".join(out)


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta_desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0d0b09">

<meta property="og:type" content="product">
<meta property="og:site_name" content="Hunny Collection PK">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:image" content="{img_abs}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="assets/favicon-32.png">
<link rel="apple-touch-icon" href="assets/favicon-180.png">
<link rel="stylesheet" href="style.css">
<script src="/analytics.js"></script>
<script src="/facebook-pixel.js"></script>
<link rel="manifest" href="/manifest.json">
<script>
// Catches Chrome's install event before pwa.js loads; otherwise it is lost.
window.__hcInstall = null;
window.addEventListener('beforeinstallprompt', function (e) {{
    e.preventDefault();
    window.__hcInstall = e;
    window.dispatchEvent(new Event('hc-installable'));
}});
</script>
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">

<script type="application/ld+json">
{schema}
</script>

<style>
  /* Nothing may exceed the screen width. minmax(0,1fr) and min-width:0 are
     the two rules that actually let a grid or flex child shrink; without
     them a child refuses to go below its content and pushes the page wide. */
  *,*::before,*::after{{box-sizing:border-box}}
  html,body{{max-width:100%;overflow-x:clip;-webkit-text-size-adjust:100%}}
  img,video,svg{{max-width:100%;height:auto}}
  .pd h1,.pd p,.pd li,.pd td,.pd th,.pd span,.pd a{{overflow-wrap:break-word;word-break:break-word}}
  .pd{{max-width:1100px;margin:0 auto;padding:24px 18px 60px;width:100%}}
  .pd-crumb{{font-size:13px;color:#8a8279;margin-bottom:18px}}
  .pd-crumb a{{color:#8a8279;text-decoration:none}}
  .pd-grid{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px}}
  .pd-grid>*{{min-width:0}}
  @media(max-width:860px){{.pd-grid{{grid-template-columns:minmax(0,1fr);gap:24px}}}}
  @media(max-width:560px){{
    .pd{{padding:12px 14px 50px}}
    .pd h1{{font-size:19px;line-height:1.3}}
    .pd-now{{font-size:24px}}
    .pd-thumbs img{{width:52px;height:52px}}
    /* A square hero eats the whole screen on a small phone, pushing the
       price and the buy button out of sight. Visitors arriving from an ad
       have already seen the picture; what they need next is the price. */
    .pd-hero{{aspect-ratio:auto;height:44vh;max-height:340px;object-fit:cover}}
    .pd-crumb{{margin-bottom:10px;font-size:12px}}
    .pd-thumbs{{margin-top:8px}}
    .pd-grid{{gap:16px}}
    .pd-cat{{margin-bottom:4px}}
    .pd-price{{margin:10px 0 4px}}
    .pd-stock{{margin-bottom:14px}}
    /* A two-column table is unreadable at this width, so each row becomes
       a stacked label and value. */
    .pd-spec,.pd-spec tbody,.pd-spec tr,.pd-spec th,.pd-spec td{{display:block;width:auto}}
    .pd-spec tr{{padding:10px 0;border-bottom:1px solid #ececec}}
    .pd-spec th,.pd-spec td{{border:0;padding:0}}
    .pd-spec th{{font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}}
    .pd-more{{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
    .pd-sec{{margin-top:34px}}
    .pd-sec h2{{font-size:19px}}
  }}
  @media(max-width:360px){{
    .pd-thumbs img{{width:48px;height:48px}}
    .pd-buy,.pd-cart{{font-size:15px;padding:14px}}
  }}

  /* Buying stays one tap away no matter how far down the page the customer
     has read, or whether they scrolled at all. On the smallest phones the
     main button sits just below the fold, and this covers that. */
  .pd-bar{{position:fixed;left:0;right:0;bottom:0;background:#fff;
           border-top:1px solid #e8e8e8;box-shadow:0 -4px 18px rgba(0,0,0,.09);
           padding:9px 13px;display:none;align-items:center;gap:11px;z-index:900}}
  .pd-bar .p{{font-weight:800;font-size:16px;white-space:nowrap;line-height:1.15}}
  .pd-bar .p small{{display:block;font-weight:400;font-size:10.5px;color:#8a8279}}
  .pd-bar button{{flex:1;background:linear-gradient(135deg,#E8B44F,#C0872B);
                  color:#1a1409;border:0;border-radius:50px;padding:13px 10px;
                  font-size:15px;font-weight:800;font-family:inherit;cursor:pointer}}
  @media(max-width:768px){{
    .pd-bar{{display:flex}}
    body{{padding-bottom:72px}}
    .whatsapp-float{{bottom:86px}}
  }}
  .pd-hero{{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;background:#f5f2ef}}
  .pd-thumbs{{display:flex;gap:9px;margin-top:10px;flex-wrap:wrap}}
  .pd-thumbs img{{width:70px;height:70px;object-fit:cover;border-radius:5px;cursor:pointer;border:2px solid transparent;background:#f5f2ef}}
  .pd-thumbs img.on{{border-color:#B8862F}}
  .pd h1{{font-size:clamp(21px,3.6vw,29px);line-height:1.25;margin:0 0 6px}}
  .pd-cat{{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#8a8279;margin-bottom:8px}}
  .pd-price{{display:flex;align-items:baseline;gap:11px;flex-wrap:wrap;margin:16px 0 6px}}
  .pd-now{{font-size:28px;font-weight:800}}
  .pd-was{{font-size:17px;color:#9a9289;text-decoration:line-through}}
  .pd-off{{font-size:12px;font-weight:700;color:#fff;background:#C2334D;border-radius:3px;padding:4px 9px}}
  .pd-stock{{font-size:14px;color:#1b7f3b;font-weight:600;margin-bottom:20px}}
  .pd-buy{{display:block;width:100%;text-align:center;background:linear-gradient(135deg,#E8B44F,#C0872B);
          color:#1a1409;font-weight:800;font-size:16px;padding:16px;border-radius:6px;
          text-decoration:none;border:none;cursor:pointer;font-family:inherit}}
  .pd-cart{{display:block;width:100%;text-align:center;background:#fff;color:#1e1a17;border:1px solid #1e1a17;
           font-weight:600;font-size:15px;padding:14px;border-radius:6px;margin-top:10px;
           text-decoration:none;cursor:pointer;font-family:inherit}}
  .pd-opts{{display:block;text-align:center;font-size:14px;color:#8a6a2a;margin-top:12px;text-decoration:none}}
  .pd-note{{font-size:13px;color:#8a8279;text-align:center;margin-top:11px}}
  .pd-trust{{margin-top:22px;border:1px solid #ececec;border-radius:8px;background:#fbfbfa;padding:2px 15px}}
  .pd-trust div{{display:flex;gap:11px;padding:11px 0;border-bottom:1px solid #efefef;font-size:14px}}
  .pd-trust div:last-child{{border-bottom:0}}
  .pd-trust p{{margin:0;color:#3a3a3a}}
  .pd-sec{{margin-top:46px;max-width:760px}}
  .pd-sec h2{{font-size:21px;margin-bottom:12px}}
  .pd-sec p{{margin:0 0 11px;color:#3f3a35;font-size:15px;line-height:1.65}}
  .pd-sec ul{{margin:0 0 13px 19px;color:#3f3a35;font-size:15px}}
  .pd-sec li{{margin-bottom:5px}}
  .pd-spec{{width:100%;border-collapse:collapse;font-size:15px;table-layout:fixed}}
  .pd-spec th,.pd-spec td{{text-align:left;padding:10px 0;border-bottom:1px solid #ececec;vertical-align:top}}
  .pd-spec th{{width:140px;color:#8a8279;font-weight:600}}
  .pd-more{{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-top:16px}}
  .pd-more>*{{min-width:0}}
  .pd-more a{{text-decoration:none;color:inherit}}
  .pd-more img{{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:6px;background:#f5f2ef}}
  .pd-more span{{display:block;font-size:13px;margin-top:6px;line-height:1.35}}
  .pd-more b{{display:block;font-size:14px;margin-top:3px}}
</style>
</head>
<body>

<div class="pd">
  <nav class="pd-crumb">
    <a href="index.html">Home</a> / <a href="shop.html">Shop</a> / {cat_esc}
  </nav>

  <div class="pd-grid">
    <div>
      <img class="pd-hero" id="pd-hero" src="{img}" alt="{alt}" width="800" height="800">
      {thumbs}
    </div>

    <div>
      <div class="pd-cat">{cat_esc}</div>
      <h1>{name_esc}</h1>

      <div class="pd-price">
        <span class="pd-now">Rs.&nbsp;{price_fmt}</span>
        {was_html}
      </div>
      <div class="pd-stock">{stock_line}</div>

      <button class="pd-buy" type="button" onclick="hcBuyNow()">Buy Now &mdash; Cash on Delivery</button>
      <button class="pd-cart" type="button" onclick="hcAddToCart()">Add to Cart</button>
      <a class="pd-opts" href="product.html?id={pid}">Size &amp; doosre options dekhein</a>
      <p class="pd-note">Paisay parcel milne par dein &middot; Koi advance nahi</p>

      <div class="pd-trust">
        <div><span>🚚</span><p>Delivery 2&ndash;5 working days</p></div>
        <div><span>💵</span><p>Cash on Delivery all over Pakistan</p></div>
        <div><span>🔄</span><p>7 day exchange &mdash; <a href="return-policy.html">policy dekhein</a></p></div>
        <div><span>📞</span><p>Booking se pehle hum aap ko call karte hain</p></div>
      </div>
    </div>
  </div>

  <section class="pd-sec">
    <h2>Product details</h2>
    {desc}
  </section>

  <section class="pd-sec">
    <h2>Information</h2>
    <table class="pd-spec">
      <tr><th>Category</th><td>{cat_esc}</td></tr>
      <tr><th>Price</th><td>Rs. {price_fmt}</td></tr>
      <tr><th>Payment</th><td>Cash on Delivery, Pakistan bhar me</td></tr>
      <tr><th>Delivery</th><td>2&ndash;5 working days</td></tr>
      <tr><th>Exchange</th><td>7 din, article istemal na hua ho</td></tr>
    </table>
  </section>

  {related}
</div>

<div class="pd-bar">
  <div class="p">Rs.&nbsp;{price_fmt}<small>Cash on Delivery</small></div>
  <button type="button" onclick="hcBuyNow()">Buy Now</button>
</div>

<script>
  // The product this page is about. Written into the page at build time so
  // the cart works without any network request.
  var HC_PRODUCT = {product_json};

  // These pages were built without any analytics events, so a visitor who
  // landed straight on a product from an ad was invisible in the funnel.
  window.dataLayer = window.dataLayer || [];
  function hcTrack(name, extra) {{
    var items = [{{
      item_id: HC_PRODUCT.id,
      item_name: HC_PRODUCT.name,
      item_category: HC_PRODUCT.category,
      price: Number(HC_PRODUCT.sellingPrice || 0),
      quantity: 1
    }}];
    window.dataLayer.push({{ ecommerce: null }});
    window.dataLayer.push({{
      event: name,
      ecommerce: Object.assign({{ currency: 'PKR',
        value: Number(HC_PRODUCT.sellingPrice || 0), items: items }}, extra || {{}})
    }});
  }}
  hcTrack('view_item');

  // Same shape and same localStorage key that app.js uses, so the cart,
  // the header count and checkout all stay in agreement.
  function hcPutInCart() {{
    var cart = [];
    try {{ cart = JSON.parse(localStorage.getItem('cart') || '[]'); }} catch (e) {{ cart = []; }}
    if (!Array.isArray(cart)) cart = [];

    var variant = {{}};
    var i = cart.findIndex(function (item) {{
      return item.id === HC_PRODUCT.id && JSON.stringify(item.variant) === JSON.stringify(variant);
    }});

    if (i > -1) {{
      cart[i].quantity = (cart[i].quantity || 1) + 1;
    }} else {{
      var entry = {{}};
      for (var k in HC_PRODUCT) entry[k] = HC_PRODUCT[k];
      entry.variant = variant;
      entry.quantity = 1;
      cart.push(entry);
    }}

    localStorage.setItem('cart', JSON.stringify(cart));
    return true;
  }}

  function hcBuyNow() {{
    hcPutInCart();
    hcTrack('add_to_cart');
    window.location.href = 'checkout.html';
  }}

  function hcAddToCart() {{
    hcPutInCart();
    hcTrack('add_to_cart');
    var el = document.createElement('div');
    el.textContent = 'Cart me add ho gaya';
    el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:90px;' +
      'background:#1e1a17;color:#fff;padding:13px 24px;border-radius:50px;font-size:15px;' +
      'font-weight:600;z-index:2000;box-shadow:0 6px 24px rgba(0,0,0,.25)';
    document.body.appendChild(el);
    setTimeout(function () {{ el.remove(); }}, 1900);
  }}

  // Thumbnail switching. Everything above renders without JavaScript;
  // this only adds convenience on top of already-visible content.
  document.querySelectorAll('.pd-thumbs img').forEach(function (t) {{
    t.addEventListener('click', function () {{
      document.getElementById('pd-hero').src = this.src;
      document.querySelectorAll('.pd-thumbs img').forEach(function (o) {{ o.classList.remove('on'); }});
      this.classList.add('on');
    }});
  }});
</script>
<script src="whatsapp-float.js"></script>
<script src="/pwa.js"></script>
<script type="module" src="/analytics-tracker.js"></script>
</body>
</html>
"""


def build():
    products = load_products()
    pages = []

    # slugs first, so related links can point at them
    for p in products:
        p["_slug"] = slugify(p.get("name"), p["id"])

    by_cat = {}
    for p in products:
        by_cat.setdefault((p.get("category") or "").strip().lower(), []).append(p)

    for p in products:
        pid = p["id"]
        name = p.get("name") or "Product"
        cat = (p.get("category") or "Fashion").strip()
        price = int(p.get("sellingPrice") or p.get("price") or 0)
        orig = int(p.get("originalPrice") or 0)
        imgs = p.get("images") or []
        img = imgs[0] if imgs else "assets/logo-new.png"
        slug = p["_slug"]
        url = f"{SITE}/{slug}.html"
        img_abs = img if img.startswith("http") else f"{SITE}/{img}"

        short = clean_desc(p.get("description"), 155)
        if not short:
            short = f"{name} available in Pakistan."
        meta_desc = f"{short} Rs. {price:,}. Cash on Delivery all over Pakistan, 2-5 day delivery, 7 day exchange."[:300]

        title = f"{name} - Rs. {price:,} | Hunny Collection PK"
        if len(title) > 65:
            title = f"{name[:38].strip()}... - Rs. {price:,} | Hunny Collection PK"

        was_html = ""
        if orig > price > 0:
            off = round((orig - price) / orig * 100)
            was_html = (f'<span class="pd-was">Rs.&nbsp;{orig:,}</span>'
                        f'<span class="pd-off">{off}% OFF</span>')

        stock = p.get("stock")
        if isinstance(stock, (int, float)) and 0 < stock <= 10:
            stock_line = f"In stock &mdash; sirf {int(stock)} baaki hain"
            avail = "https://schema.org/InStock"
        elif isinstance(stock, (int, float)) and stock <= 0:
            stock_line = "Abhi out of stock"
            avail = "https://schema.org/OutOfStock"
        else:
            stock_line = "In stock"
            avail = "https://schema.org/InStock"

        thumbs = ""
        if len(imgs) > 1:
            tl = "".join(
                f'<img src="{html.escape(i)}" alt="{html.escape(name)} view {n+1}"'
                f'{" class=\'on\'" if n == 0 else ""} loading="lazy">'
                for n, i in enumerate(imgs[:5]))
            thumbs = f'<div class="pd-thumbs">{tl}</div>'

        schema = json.dumps({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": name,
            "image": [i if i.startswith("http") else f"{SITE}/{i}" for i in imgs[:4]] or [img_abs],
            "description": clean_desc(p.get("description"), 900) or name,
            "category": cat,
            "sku": p.get("sku") or pid,
            "brand": {"@type": "Brand", "name": "Hunny Collection PK"},
            "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": "PKR",
                "price": str(price),
                "availability": avail,
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {"@type": "Organization", "name": "Hunny Collection PK"}
            }
        }, indent=2, ensure_ascii=False)

        # related: same category, never itself
        sibs = [s for s in by_cat.get(cat.lower(), []) if s["id"] != pid][:4]
        related = ""
        if sibs:
            cards = ""
            for s in sibs:
                si = (s.get("images") or ["assets/logo-new.png"])[0]
                sp = int(s.get("sellingPrice") or s.get("price") or 0)
                cards += (f'<a href="{s["_slug"]}.html">'
                          f'<img src="{html.escape(si)}" alt="{html.escape(s.get("name") or "")}" loading="lazy">'
                          f'<span>{html.escape((s.get("name") or "")[:52])}</span>'
                          f'<b>Rs. {sp:,}</b></a>')
            related = (f'<section class="pd-sec" style="max-width:none">'
                       f'<h2>Isi tarah ki cheezein</h2>'
                       f'<div class="pd-more">{cards}</div></section>')

        page = TEMPLATE.format(
            title=html.escape(title, quote=True),
            meta_desc=html.escape(meta_desc, quote=True),
            og_title=html.escape(f"{name} - Rs. {price:,}", quote=True),
            url=url,
            img=html.escape(img, quote=True),
            img_abs=html.escape(img_abs, quote=True),
            alt=html.escape(f"{name} - {cat} - Hunny Collection PK", quote=True),
            thumbs=thumbs,
            cat_esc=html.escape(cat),
            name_esc=html.escape(name),
            price_fmt=f"{price:,}",
            was_html=was_html,
            stock_line=stock_line,
            pid=pid,
            desc=desc_html(clean_desc(p.get("description"))),
            related=related,
            schema=schema,
            product_json=json.dumps({
                "id": pid,
                "name": name,
                "category": cat,
                "sellingPrice": price,
                "originalPrice": orig or None,
                "price": price,
                "images": imgs[:1],
                "slug": slug,
                "sku": p.get("sku") or pid,
            }, ensure_ascii=False),
        )

        with open(os.path.join(OUT_DIR, f"{slug}.html"), "w", encoding="utf-8") as f:
            f.write(page)
        pages.append((slug, name))

    # ---- sitemap ----
    today = date.today().isoformat()
    core = ["", "shop.html", "contact.html", "return-policy.html", "privacy-policy.html"]
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for c in core:
        pri = "1.0" if c == "" else ("0.9" if c == "shop.html" else "0.5")
        freq = "daily" if c in ("", "shop.html") else "monthly"
        lines += [f"  <url><loc>{SITE}/{c}</loc><lastmod>{today}</lastmod>"
                  f"<changefreq>{freq}</changefreq><priority>{pri}</priority></url>"]
    for slug, _ in pages:
        lines += [f"  <url><loc>{SITE}/{slug}.html</loc><lastmod>{today}</lastmod>"
                  f"<changefreq>weekly</changefreq><priority>0.8</priority></url>"]
    lines.append("</urlset>")
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"built {len(pages)} product pages")
    print(f"sitemap: {len(core) + len(pages)} URLs")
    return pages


if __name__ == "__main__":
    build()
