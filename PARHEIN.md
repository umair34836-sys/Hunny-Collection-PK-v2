# GA4 ID Lag Gayi

---

# ⬆️ GITHUB PAR YE 2 FILES UPLOAD KAREIN

| File | Kya badla |
|---|---|
| **`analytics.js`** | Aap ki ID `G-4TRMYR09SQ` daal di |
| **`hc-builder-9x4kt2.html`** | Naye store aap ki ID inherit na karein |

Baaqi sab pehle jaisa.

---

## ⚠️ Google ka diya hua code paste MAT karein

Google ne aap ko jo snippet diya hai, woh **paste nahi karna.**

Wajah: `analytics.js` khud hi wohi kaam karti hai — wahi `gtag.js` load
karti hai aur wahi `config` chalati hai. Agar Google wala code bhi paste
kar diya to **dono ek saath chalenge**, aur GA4 me har visit **do baar**
ginti jayegi.

Aap ki saari ginti dugni ho jayegi aur pata bhi nahi chalega ke jhooti hai.

Isliye bas `analytics.js` upload karein. Us me sab pehle se hai.

---

## Test kiya hua

Asli file chala kar dekha:

| Check | Nateeja |
|---|---|
| gtag script ka pata | `googletagmanager.com/gtag/js?id=G-4TRMYR09SQ` |
| config call | Sahi ID ke saath, ek baar |
| view_item forward hua | 1 baar |
| purchase forward hua | 1 baar |
| Admin page par band rehta hai | Theek |

Aur poora suite bhi dobara chalaya — **173 test, sab paas.**

---

## Builder me ek cheez theek ki

Builder ke andar `analytics.js` ki wahi copy bhari hui thi jisme ab aap ki
ID hai. Iska matlab hota ke aap jo bhi naya store banate, uska saara traffic
**Hunny Collection ki property me** record hota.

Ab builder us ID ko khud khali kar deta hai. Naye store me placeholder aata
hai, aur uske malik ko apni ID daalni parti hai.

---

# UPLOAD KE BAAD — 2 minute ka test

1. Files upload karein, 2&ndash;3 minute rukein
2. **analytics.google.com** kholein
3. **Reports → Realtime**
4. Ab **doosre phone se** (ya incognito me) `hunnycollectionpk.com` kholein
5. 30 second ke andar GA4 me **1 user** nazar aana chahiye

Agar nazar na aaye:
- Apne hi phone se test na karein agar aap admin page par thay — admin
  pages jaan bujh kar ginti me nahi aate
- Ad-blocker ya Private DNS band karein, woh GA4 ko rok deta hai
- Browser me Console kholein aur dekhein koi laal error to nahi

---

## Analytics ab kya batayegi

Poora rasta nazar aayega:

```
product dekha → cart me daala → cart khola → checkout → order
```

Lekin yaad rahe: **abhi traffic hai hi nahi**, to pehle hafte GA4 khaali
dikhega. Ye kharabi nahi.

Asal kaam wahi hai — Instagram aur TikTok par products daalna shuru karein.
Jab log aayenge, tab ye numbers batayenge kaun sa product chalta hai.
