# Facebook (Meta) Pixel — Setup

---

# ⬆️ UPLOAD KAREIN

**GitHub par:**

| File | Kya hai |
|---|---|
| **`facebook-pixel.js`** | Naya — pixel |
| **14 customer pages** | Pixel ka link |
| **93 product pages** | Pixel ka link |
| **`hc-export-products.html`** | Naye pages me bhi pixel |
| **`build-product-pages.py`** | Generator |

⚠️ Upload karne se **pehle** neeche wala Qadam 1 kar lein, warna pixel chalega
nahi.

---

# QADAM 1 — Apna Pixel ID daalein

`facebook-pixel.js` kholein, sabse upar ye line hai:

```js
const PIXEL_ID = '000000000000000';   // <-- yahan apna Pixel ID likhein
```

## Pixel ID kahan se milega

1. **business.facebook.com** kholein
2. Baayen menu → **All tools** → **Events Manager**
3. **Data sources** → apna pixel chunein
4. Naam ke neeche **15–16 ginti ka number** likha hoga — wahi ID hai

## Agar pixel bana hi nahi

Events Manager → **Connect data sources** → **Web** → **Meta Pixel** →
**Connect** → naam likhein → **Create**

Meta aap ko code dega — **woh code paste MAT karein.** `facebook-pixel.js`
me sab pehle se hai. Sirf ID uthayein.

---

## Ye pixel kya kya bhejta hai

Aap ki site pehle se poora funnel `dataLayer` par bhejti hai (GA4 ke liye).
Pixel wahin se utha kar Meta ke naamon me badal deta hai — isi liye **GA4
aur Meta ki ginti hamesha barabar rahegi.**

| Customer ne kya kiya | Meta ko kya jata hai |
|---|---|
| Koi bhi page khola | `PageView` |
| Product dekha | `ViewContent` |
| Cart me daala | `AddToCart` |
| Cart khola | `ViewCart` |
| Checkout khola | `InitiateCheckout` |
| **Order kiya** | **`Purchase`** — qeemat ke saath |

**`Purchase` sab se ahem hai.** Uske bagair Meta ko pata hi nahi chalta ke
kaun sa ad paisa laaya, aur woh aap ke ad ko sahi logon tak nahi pahuncha
sakta.

---

## Teen cheezein jo dhyan se ki hain

### 1. Order ka number saath jata hai
`Purchase` ke saath order ka ID bhi bheja jata hai. Agar customer thank-you
page **refresh** kar de, to Meta usay **dobara sale nahi ginta**. Iske
bagair aap ki sales ki ginti barh kar dikhti aur aap ghalat faisle karte.

### 2. Admin pages par pixel band hai
Aap khud jitni baar admin panel kholte hain, woh Meta ko nahi jata. Warna
Meta ko lagta ke aap ki dukaan ka customer aap khud hain, aur ad kisi aur
ko dikhna band ho jata.

### 3. Ek event sirf ek baar
GA4 lagate waqt ek bug pakda tha jisme ek order **2,783 baar** ja raha tha.
Yahan wahi ghalti dobara na ho, iske liye pehra laga diya hai — aur test me
sabit bhi kiya hai.

---

## Ek cheez jo maine saath me theek ki

**`checkout.html` par GA4 ka tag laga hi nahi tha.**

Yani aap ka checkout page Google Analytics me nazar hi nahi aa raha tha.
Ab dono lag gaye — GA4 bhi, pixel bhi.

---

## Test kiya hua — 20/20

| Check | Nateeja |
|---|---|
| Bina ID ke kuch load nahi hota | Theek |
| Admin page par band | Theek |
| Init sahi ID ke saath | Theek |
| PageView chala | Theek |
| **Paanchon events mapped** | ViewContent, AddToCart, ViewCart, InitiateCheckout, Purchase |
| **Purchase sirf ek baar** | **Theek** |
| Purchase me asli qeemat | Rs. 3,450 |
| Currency PKR | Theek |
| **Order ka ID dedupe ke liye** | **Theek** |
| Koi event duplicate | Ek bhi nahi |
| dataLayer phaila to nahi | 6 entries |
| Ajeeb events nazarandaaz | Theek |
| 14 customer pages | Sab |
| 93 product pages | Sab |
| Admin pages | Bilkul nahi |
| Naye products me bhi aayega | Theek |

---

# UPLOAD KE BAAD — TEST

1. `facebook-pixel.js` me apna ID daalein
2. Sab files upload karein, 2–3 minute rukein
3. **Events Manager → Test events** kholein
4. Wahan jo browser ka pata diya ho, usme apni site kholein
5. Ya **doosre phone se** site kholein aur Events Manager → **Overview** dekhein

Aana chahiye:
- Site kholte hi **PageView**
- Product page par **ViewContent**
- Cart me daalte hi **AddToCart**
- Checkout par **InitiateCheckout**
- Order karte hi **Purchase**

**Meta Pixel Helper** (Chrome extension) se bhi check kar sakte hain, lekin
woh computer par hi chalta hai.

---

## Do baatein jo sach hain

**1. Ginti 100% nahi hogi.** Ad-blocker aur iPhone ki privacy setting pixel
ko rok deti hain. Meta ki ginti aksar asli se **20–30% kam** hoti hai. Ye
kharabi nahi — har dukaan ke saath yehi hota hai.

**2. Conversions API** naam ki cheez ye kami poori karti hai, lekin uske
liye server chahiye. Aap ki site GitHub Pages par static hai, isliye woh
abhi mumkin nahi. Zaroorat tab parti hai jab ad par mahine ke 50,000+ lag
rahe hon.

---

## Pixel lagne ke baad kya kar sakenge

Ye ab tak nahi ho sakta tha:

- **Purchase par optimize** — Meta us bande ko ad dikhayega jo waqai
  khareedta hai, sirf click karne wale ko nahi
- **Retargeting** — jisne product dekha lekin khareeda nahi, usay dobara
  ad dikhayein. Ye aksar sab se sasta order laata hai
- **Lookalike audience** — jab 100 orders ho jayein, Meta unke jaise aur
  log dhoond kar dega

Teesri cheez ke liye sabr chahiye, lekin **retargeting aap 20–30 orders ke
baad hi shuru kar sakte hain.**
