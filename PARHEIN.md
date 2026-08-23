# Ad Se Log Aa Rahe Hain, Page Unhe Rok Nahi Raha

---

# ⬆️ UPLOAD KAREIN

**GitHub par:** poora zip (khaaskar **90 product pages** aur `hc-export-products.html`)

---

## Aap ke numbers ka matlab

| | |
|---|---|
| Kharcha (dono ads) | ~PKR 465 |
| Asli visitors | 37 |
| **Per visitor** | **~PKR 12** |

Pakistan me ye **sasta hai.** Aap ka ad kaam kar raha hai.

Lekin ab ye:

| | |
|---|---|
| Kul users | 37 |
| **Scroll kisne kiya** | **5** |
| **10 second se zyada kisne guzare** | **5** |

**32 log aaye aur bina scroll kiye chale gaye.**

---

## Wajah — maine naap kar dekhi

Aap ke product page par tasveer **poori screen** kha jati thi.

Chhote Android par (360×640 — Pakistan me bahut aam):

| Cheez | Kahan thi | Nateeja |
|---|---|---|
| Tasveer | 362px | Poori screen |
| **Price** | 550px | **Screen se neeche** |
| **Buy Now** | 636px | **Screen se neeche** |

Screen par sirf 530px nazar aate hain. Yani jo banda scroll nahi karta,
usne **na price dekha, na Buy Now.**

Aur ye Instagram ke ad traffic ke liye khaas taur par bura hai: **unhone
tasveer ad me pehle hi dekh li hai.** Dobara wahi poori screen ki tasveer
dikhane ka koi faida nahi. Unhe price chahiye.

### Ab kya kiya

**1. Tasveer ki hadd bandh di** — ab screen ke 44% se zyada nahi leti.

**2. Neeche chipka hua Buy Now bar** — price aur button **hamesha** nazar
aate hain, chahe banda scroll kare ya na kare.

Naap kar dekha:

| | Pehle | Ab |
|---|---|---|
| Price (chhota phone) | 550px — chupa | **477px — nazar aata hai** |
| Buy Now | 636px — chupa | **hamesha chipka hua** |

---

## Ek kami jo meri thi

Aap ke Events me sirf `page_view`, `scroll`, `session_start` thay.
`view_item` aur `add_to_cart` **bilkul nahi.**

Wajah: jo 90 static product pages maine banaye, **unme ye events daale hi
nahi thay.** Maine woh sirf purane dynamic `product.html` me rakhe thay.
Ye meri chook hai.

Isi liye aap ko nazar nahi aa raha tha ke us bag wale page par 21 log aaye
aur un me se kitno ne cart tak haath badhaya.

**Ab dono events lag gaye hain**, aur naye export me bhi khud aayenge.

---

## Ek cheez jo aap ke numbers me chhupi hai

Aap ka **doosra ad sasta tha:**

| Ad | Kya naapa | Qeemat |
|---|---|---|
| Instagram post (bag) | 146 "link clicks" | PKR 423 |
| Website wala ad | **9 Landing Page Views** | **PKR 4.69 per view** |

Dhyan dein Meta ne khud alag lafz istemal kiye: pehle me "link clicks",
doosre me "**Landing Page Views**".

Farq ye hai: **click** ka matlab sirf ungli laga. **Landing page view** ka
matlab page waqai khula. Isi liye Meta ne 146 clicks dikhaye lekin GA4 me
sirf 37 log aaye.

Aap ne woh sasta wala ad **pause kar rakha hai.**

---

# AB KYA KAREIN — tarteeb se

### 1. Ye files upload karein
Bina iske aage koi test bekar hai, kyunki abhi bhi purane pages live hain.

### 2. Ek din rukein, phir Events dobara dekhein
GA4 → Events. Ab `view_item` aur `add_to_cart` nazar aane chahiyein.

**Yahi asal jawab dega:**
- `view_item` bahut, `add_to_cart` zero → page dekh kar log ruk jate hain
  (price, bharosa, ya tasveer ka masla)
- `add_to_cart` hai lekin `purchase` zero → checkout me masla hai

Ye do baatein bilkul alag hain, aur ilaaj bhi alag hai.

### 3. Doosra ad dobara chalayein
Woh PKR 4.69 per landing page view par tha. **Resume** dabayein aur usay
chalne dein. Pehle wale se sasta hai.

---

## Ek baat sach mein

86% log ka bina scroll kiye chale jana **thoda normal bhi hai** — Instagram
ke ad par ungli aksar galti se lag jati hai, aur woh banda kharidne ke irade
se nahi aata.

Ye fix us ginti ko zero nahi karega. Lekin jo log **waqai** dilchaspi rakhte
hain, unhe ab price aur Buy Now dhoondna nahi parega. Abhi unhe bhi nahi
mil raha tha.

Agla asal faisla **`add_to_cart` ki ginti** dekh kar hoga. Woh aane do,
phir batayein — us par agla kadam tay karenge.
