# Export Ab Selective Hai

---

## Jo aap ne kaha, wahi kiya

Ab export tool me har product ke saath tick box hai.

- **Selected products** ke hi HTML pages aur tasveerein ZIP me aate hain
- **`products-data.js` me hamesha saare products** aate hain
- **`sitemap.xml` me bhi hamesha saare** aate hain

Matlab 2 naye product add karein to ZIP me sirf 2 pages aur unki tasveerein
hongi &mdash; 90 dobara upload nahi karne parenge. Lekin data file aur
sitemap poore rahenge, isliye website par kuch bhi gayab nahi hoga.

---

## Ye kaam kaise karta hai (zaroori baat)

Sawal ye banta hai: agar 88 products ki tasveerein ZIP me nahi hain, to unki
tasveerein website par kaise chalengi?

Jawab: **har tasveer ka naam har baar bilkul ek jaisa banta hai.**

```
assets/products/<product-ki-id>-0.jpg
assets/products/<product-ki-id>-1.jpg
```

Ye naam product ki apni ID se banta hai, jo kabhi nahi badalti. Isliye
`products-data.js` me un 88 products ki tasveer ka wahi pata likha hota
hai jo pichhli baar upload hui thi &mdash; aur woh file server par pehle se
maujood hai.

Isi liye ye tareeqa mehfooz hai.

---

## Ek extra cheez jo main ne khud add ki

Tool ab khud bata deta hai **kaun se products naye hain aur kaun se badle
hain.**

Jab aap "Firestore se products parhein" dabate hain, tool aapki live website
se `products-data.js` mangwa kar muqabla karta hai:

- **NAYA** &mdash; ye product website par hai hi nahi
- **BADLA** &mdash; naam, price ya tasveer badli hai
- Bina tag ke &mdash; bilkul waise hi hai, dobara bhejne ki zaroorat nahi

Aur naye + badle hue products **khud ba khud ticked** aate hain. Yani zyada
tar waqt aap ko kuch chunna hi nahi parega &mdash; bas ZIP download karein.

Upar ginti bhi dikhti hai: kul, naye, badle hue, waise hi.

### Chunne ke liye teen button

- **Sab** &mdash; poora export (pehli baar ya kuch garbar ho to)
- **Koi nahi** &mdash; sab hata kar khud chunein
- **Sirf naye + badle** &mdash; aam tor par yahi chahiye hota hai

Aur upar search box hai, taake 90 products me se koi ek dhoondna ho to
naam likh kar mil jaye.

---

## Ek ehtiyat jo tool khud karta hai

Agar koi **naya** product aap ne select nahi kiya, to neeche laal warning
aayegi:

> *Dhyan dein: 1 naya product select nahi kiya. Uski tasveerein pehle kabhi
> upload nahi huin, isliye website par uski tasveer tootegi.*

Wajah: naye product ki tasveer server par hai hi nahi. Agar uska naam data
file me chala jaye lekin tasveer na jaye, to website par tooti hui tasveer
dikhegi. **Naye products hamesha select rakhein.**

---

## Test kiya hua

20 products le kar, un me se sirf 3 select kar ke poora export simulate kiya:

| Test | Nateeja |
|---|---|
| ZIP me pages | Sirf 3 |
| ZIP me tasveerein | Sirf un 3 ki |
| `products-data.js` | Poore 20 |
| `sitemap.xml` | Poore 20 (+5 baaki pages) |
| **Chhoote hue 17 products ki tasveer ka pata** | **Sahi file path, base64 nahi** |
| Tasveer ka naam do baar banaya | Dono baar bilkul same |
| Data file me base64 leak | 0 |
| Andar ke faaltu fields | Nikal diye |
| Selected page par cart fix + schema | Dono maujood |
| Tool ka poora code | 7/7 hisse |

Purane test bhi dobara chalaye &mdash; cart ka fix (6/6) aur checkout ka
selection (7/7), dono salamat hain.

---

# UPLOAD KARNA HAI

Sirf ek file badli hai:

- **`hc-export-products.html`**

Chahein to poora zip upload kar dein, koi harj nahi.

---

# AB SE KA TAREEQA

1. Admin panel se naya product add karein
2. `hc-export-products.html` kholein
3. **"Firestore se products parhein"** &mdash; naye product par NAYA ka
   tag aa jayega aur woh khud ticked hoga
4. **"ZIP download karein"**
5. ZIP kholein, sab kuch GitHub par upload karein
6. Google Search Console &rarr; URL Inspection &rarr; naye page ka pata
   daal kar **Request Indexing**

Pehle har baar 30 MB ka ZIP milta tha. Ab do naye products ke liye shayad
1 MB se bhi kam.
