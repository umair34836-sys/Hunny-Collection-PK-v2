# Quick Add — Asli Markaz Format Ke Hisaab Se

---

# ⬆️ UPLOAD KAREIN

**GitHub par:** poora zip
**Firebase Console par:** `firestore.rules` (analytics ke liye, agar abhi tak nahi kiya)

Kholne ka pata: **admin panel → sidebar → ⚡ Quick Add**

---

## Aap ka text dekh kar teen cheezein badalni pari

Pehle maine andaza laga kar parser banaya tha. Aap ka asli text dekh kar
pata chala ke teen baatein meri soch se alag hain:

### 1. Markaz ke text me price hota hi nahi

Maine parser price dhoondne ke liye banaya tha. Aap ke teeno products me
**ek bhi price nahi hai.**

Ab page saaf likhta hai: *"Price Markaz ke text me nahi hota, woh khud
daalna parega."* Ye batana zaroori tha, warna khali khana dekh kar lagta
ke tool toot gaya.

### 2. Aap ek saath kai products paste karte hain

Aap ne teen products ek hi baar me bheje. Pehle wala tool ek waqt me ek
hi sambhalta.

**Ab queue ban jati hai.** Teeno paste karein, aur upar patti dikhegi:

> **1 / 3** — 3 baaki hain
> `Cotton Night Suit` `Cool Undertone Lipstick` `YARA PRIMER`

Har save ke baad **agla product khud bhar jata hai.** Aap ko sirf price aur
tasveerein deni hain. Dobara paste karne ki zaroorat nahi.

### 3. `Product Code` ab SKU ban jata hai

`MZ1176200322SHKLFS` — ab ye khud SKU ke khane me chala jata hai.
Isse baad me pata chalta rahega ke kaun sa product Markaz par kaun sa tha.

---

## Ab kya kya khud nikal jata hai

| Khana | Kahan se |
|---|---|
| **Naam** | `*Product Name*:` |
| **Tafseel** | `*Product Description*:` — poori copy aur bullets |
| **Spec** | `*Product Details*:` — Fabric, Pattern, Neck Type waghera |
| **Sizes** | `Available Sizes:` ki line |
| **SKU** | `Product Code:` |
| **Price** | ✗ text me hai hi nahi — khud daalein |

Aur do safaiyan jo dhyan se ki hain:

**`*` ke nishan nikal jate hain.** `*Product Name*:` wala nishan naam me
nahi jata.

**Note ek hi baar aata hai.** Markaz wahi warning do jagah likhta hai —
description me bhi aur details ke baad bhi. Ab woh sirf ek baar aati hai.

**Aur ek cheez:** aap ke teesre product (YARA PRIMER) ka description
**bilkul khali** tha. Aisi soorat me tool spec se hi description bana deta
hai, warna us product ka page khali reh jata.

---

## Test kiya hua — 37/37

Ab andaze par nahi, **aap ke asli text par**:

| Check | Nateeja |
|---|---|
| Teeno products mile | 3/3 |
| Teeno naam bilkul theek | Theek |
| `*` ke nishan nikle | Theek |
| Product Code SKU bana | Theek |
| Sizes details se nikle | Medium, Large, X-Large |
| Sizes ki line tafseel me dobara nahi | Theek |
| **Price bana kar nahi daali** | **Theek** |
| Selling copy bachi | Theek |
| Bullets bache | Theek |
| Spec lines bachi | Theek |
| Product Code tafseel me nahi | Theek |
| **Note teeno me ek ek baar** | **Theek** |
| **Khali description spec se bhara** | **Theek** |
| Ajeeb text par crash | Nahi hota |
| Purana aam text bhi chalta hai | Price 2400 mila |
| Queue aage barhti hai | Theek |
| Queue khatam hone tak text nahi mitta | Theek |

Aur baaki sab — kul **241 test, sab paas.**

---

# ISTEMAL KA TAREEQA

1. Markaz se **ek ya kai** products ka text copy karein
2. Quick Add me paste karein — khud alag ho jayenge
3. Pehle product ka **Markaz price** daalein
4. **Tasveerein** chunein (kai ek saath)
5. **Save** dabayein
6. Agla product khud bhar jayega — sirf price aur tasveerein dein
7. Queue khatam hone tak yehi chalta rahega

Uske baad hamesha ki tarah: **Export tool → ZIP → GitHub upload**

---

## Jo abhi bhi khud karna parega

- **Tasveerein download karna** — Markaz doosri website ko seedha lene nahi
  deta (CORS), iska hal browser me nahi hai
- **Price daalna** — text me hota hi nahi
- **Category chunna** — pehli baar. Uske baad yaad rehti hai

Baaki sab khud ho jata hai. Teen products ka andaza: pehle **12–15 minute**
lagte, ab **4–5 minute.**

Agar kisi product ka text ajeeb tarah se toote to woh text mujhe bhej dein,
parser me us shakal ke liye bhi bandobast kar doonga.
