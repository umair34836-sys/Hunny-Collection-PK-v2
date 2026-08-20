# Checkout Par Ab Customer Khud Chunta Hai

---

## Masla kya tha

Agar cart me teen cheezein hain to checkout teeno ka order kar deta tha.
Customer ke paas koi raasta nahi tha ke keh sake "abhi sirf ye ek chahiye."

Uske paas do hi option bachte thay:
- Poora cart khareed le, ya
- Wapas cart page par jaye, baaki cheezein delete kare, phir checkout kare

Doosra raasta jhanjhat wala hai. Aur delete karne ke baad woh cheezein
gum ho jati hain &mdash; agli baar dobara dhoondni parti hain. Aksar
customer aisa karne ke bajaye poora order hi chhor deta hai.

---

## Ab kya hai

Checkout ke Order Summary me har cheez ke saath **tick box** hai.

- Shuru me **sab ticked** hote hain, taake jo poora cart lena chahta hai
  uske liye kuch nahi badla
- Jo cheez abhi nahi leni, uska tick hata dein
- **Total foran badal jata hai**
- Untick ki hui cheez halki par jati hai, taake ek nazar me pata chale
  kya ja raha hai aur kya nahi
- Upar **"Sab select karein"** ka box hai, ek tap me sab ticked ya sab hataye

**Aur sabse ahem:** jo cheezein aap ne nahi li, woh **cart me hi rehti
hain.** Order ke baad bhi. Neeche likha aata hai:

> *"2 cheezein cart me rahengi, aap baad me order kar sakte hain."*

Pehle order poora hote hi poora cart khali ho jata tha &mdash; chahe aap ne
usme se kuch bhi na liya ho.

### Chhoti baatein jo dhyan se ki hain

- **Agar cart me sirf ek cheez hai to koi tick box nahi dikhta.** Ek cheez
  me chunne ko kuch hai hi nahi, box sirf jagah kharab karta.
- **Agar sab tick hata dein** to Confirm ka button band ho jata hai aur
  likha aata hai *"Kam se kam ek cheez select karein."* Khaali order ban
  hi nahi sakta.
- **Tick box phone ke liye bare rakhe hain** (20px), taake ungli se aasani
  se lagein.
- **Ek hi product ke do size alag ginte hain.** Agar aap ne Small aur Large
  dono cart me daale hain, to Small order karne par Large cart me hi rahega.

---

## Test kiya hua

| Test | Nateeja |
|---|---|
| Teen me se ek chuna | Sirf wahi order, do cart me bachi |
| Sab chune | Cart poora khali |
| Ek hi cheez cart me | Bina tick ke seedha order |
| Kuch bhi na chuna | Order block, button band |
| Alag alag quantity | Total bilkul sahi |
| Ek product, do size | Sirf chuna hua gaya, doosra bacha |
| Page ka poora code | 7/7 hisse maujood |

Purane test bhi dobara chalaye &mdash; Buy Now ka fix aur product pages,
sab pehle jaisa kaam kar rahe hain.

---

# UPLOAD KARNA HAI

Sirf ek file badli hai:

- **`checkout.html`**

Baaqi sab pehle jaisa. Chahein to poora zip upload kar dein, koi harj nahi.

---

# TEST KARNE KA TAREEQA

Asli phone par, **incognito** window me:

1. Teen alag alag products cart me daalein
2. Cart se **Checkout** par jayein
3. Har cheez ke saath **tick box** nazar aana chahiye
4. Beech wali cheez ka **tick hata dein**
   - Total kam ho jana chahiye
   - Woh row halki par jani chahiye
   - Neeche likha aana chahiye "1 cheez cart me rahegi"
5. **Confirm Order** dabayein
6. Order ke baad **cart kholein** &mdash; jo cheez aap ne nahi li thi,
   woh abhi bhi wahan honi chahiye

Phir ye bhi dekh lein:

7. Saare tick hata dein &mdash; button band ho jana chahiye
8. Cart me sirf ek cheez rakh kar checkout karein &mdash; koi tick box
   nahi dikhna chahiye

Kahin bhi kuch ajeeb lage to batayein.
