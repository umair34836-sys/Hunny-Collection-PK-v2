# Install Button Kyun Nahi Dikh Raha Tha

---

# ⬆️ POORA ZIP UPLOAD KAREIN

Live site check ki. **PWA wali files upload huin hi nahi.**

Page ke meta tags me `manifest` aur `apple-mobile-web-app-capable` dono
ghaayab hain, aur `theme-color` abhi bhi purana `#8CE4FF` hai. Yani jo PWA
files pichhli baar bheji thin, woh GitHub par nahi gayin.

Ye files zaroori hain:

| File | Kyun |
|---|---|
| `manifest.json` | App ki pehchaan — bina iske Chrome install nahi deta |
| `service-worker.js` | Bina iske bhi Chrome install nahi deta |
| `pwa.js` | Install ka button |
| `offline.html` | Internet na ho to |
| **`assets/icons/`** | **10 icons — inke bina Chrome mana kar deta hai** |
| 14 HTML pages | Inme manifest ka link hai |
| 90 product pages | Sab dobara bane |

⚠️ `assets/icons` folder zaroor upload karein. Chrome ko 192px aur 512px ke
icons chahiye hi chahiye — na milein to install ka button kabhi nahi aata.

---

## Aur ek asli bug bhi mil gaya

Sirf files upload karna kaafi nahi tha. `pwa.js` page ke **bilkul aakhir**
me load hota tha:

```html
    <script src="/pwa.js"></script>
</body>
```

Lekin Chrome install ka signal (`beforeinstallprompt`) **page shuru hote hi**
bhej deta hai — aksar `pwa.js` ke load hone se pehle.

Aur ye signal **dobara nahi aata.** Jo miss ho gaya, so ho gaya.

Yani upload ke baad bhi button aksar nazar nahi aata, aur kabhi kabhi
aa jata — bilkul be-tarteeb.

### Hal

Ab har page ke `<head>` me 5 line ka ek chhota sa hissa hai jo us signal ko
foran pakad kar rakh leta hai. Baad me jab `pwa.js` load hoti hai, woh usay
utha leti hai.

Ab signal chahe jitni jaldi aaye, zaya nahi hota.

---

## Aur ek cheez jo maine daal di

Ab agar button phir bhi na dikhe, to **website khud bata degi kyun.**

Browser ka Console kholein (Chrome → menu → More tools → Developer tools →
Console) aur `[PWA]` dhoondein. Wahan likha aayega, jaise:

> `[PWA] Install ka button kyun nahi dikha: ["service worker ne page abhi
> sambhala nahi — ek baar page refresh karein"]`

Chrome ye kabhi nahi batata ke kya kami hai, isliye ye khud likhwa diya.

---

## Upload ke baad button na dikhe to — tarteeb se dekhein

### 1. Pehli baar par nahi aata, dobara kholne par aata hai
Ye normal hai. Chrome install tab hi deta hai jab service worker page ko
"sambhal" le, aur woh **doosri baar** page kholne par hota hai.

**Site kholein → ek baar refresh karein → phir dekhein.**

### 2. iPhone par button aata hi nahi
Apple ye feature nahi deta. iPhone wale Safari → Share → **Add to Home
Screen** se install karte hain. App phir bhi theek chalti hai.

### 3. Computer par alag jagah hota hai
Desktop Chrome me menu me nahi, **address bar ke daayen taraf** ek chhota
sa install ka nishan aata hai.

### 4. Pehle se install ho to nahi aata
Ye theek hai — zaroorat hi nahi.

### 5. Chrome ko thodi browsing chahiye
Chrome us site par install nahi deta jahan bandey ne kuch kiya hi na ho.
Ek do page kholein, thoda scroll karein.

---

## Test kiya hua — 19/19

| Check | Nateeja |
|---|---|
| **Signal pwa.js se pehle aaye to pakda jata hai** | **Theek — yahi bug tha** |
| pwa.js purana signal utha leti hai | Theek — option aa jata hai |
| Stub saare pages me | 4/4 checked |
| Stub `<head>` me, pwa.js se pehle | Theek |
| Console wajah batata hai | Theek |
| Pehli baar option aata hai | Theek |
| Ek baar poocha, dobara nahi | Theek |
| Mana karne par bhi option rehta hai | Theek |
| Install ke baad sab gayab | Theek |

Baaki sab bhi chalaya — mobile 14, PWA 25, newproducts 19, cart 6,
checkout 7, orders 23, export 10, builder 12. Kul **135 test, sab paas.**

---

# TEST KARNE KA TAREEQA

1. Poora zip upload karein — **`assets/icons` folder bhoolein mat**
2. 2–3 minute rukein
3. Android phone par Chrome me site kholein
4. **Ek baar refresh karein** (ye qadam zaroori hai)
5. Menu kholein — **"🟢 Install App"** nazar aana chahiye
6. Aur 4 second baad ek baar poochne wala box bhi

Phir bhi na aaye to Console me `[PWA]` wali line dekh kar mujhe bhej dein —
usme saaf likha hoga kya kami hai.
