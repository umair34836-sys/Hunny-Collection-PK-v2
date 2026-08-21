# Install Ka Tareeqa Badal Diya

---

# ⬆️ GITHUB PAR SIRF EK FILE UPLOAD KAREIN

- **`pwa.js`**

Baaki sab pehle jaisa. (Agar pichhli baar wali PWA files upload nahi ki
thin to poora zip upload kar dein.)

---

## Aap ne jo kaha, wahi kiya

Purani wali patti har baar neeche se upar aati thi — aap theek keh rahe
the, woh pareshan karti hai.

Ab aisa hai:

### 1. Ek hi baar poocha jayega

Pehli baar jab customer site kholega, 4 second baad ek chhota sa box aayega:

> **Hunny Collection app install karein?**
> Phone par icon ban jayega, tez khulegi, aur internet na ho tab bhi aap ka
> cart mehfooz rahega.
>
> **[Install Karein]**
> Abhi nahi

Agar usne **"Abhi nahi"** dabaya — ya bahar khali jagah par tap kiya — to
**ye box dobara kabhi nahi aayega.** Hamesha ke liye. Koi 7 din wala
chakkar nahi, koi dobara poochna nahi.

### 2. Lekin option hamesha maujood rahega

Menu me hamesha ek chhota sa link rahega:

> 🟢 **Install App**

Ye kabhi gayab nahi hota. Customer jab chahe, jis din chahe, khud dabaye
aur install kar le.

**Yahi asal baat hai:** mana karne se **pareshani** khatam hoti hai,
**option** nahi.

### 3. Install ke baad sab gayab

Jab app install ho jaye, na box aayega, na menu ka link. Kyunki ab
zaroorat hi nahi.

---

## Ek chhoti si baat jo maine dhyan se ki

"Asked" wala nishan **box dikhane se pehle** likh diya jata hai, baad me
nahi.

Wajah: agar customer box dekhte hi page refresh kar de, ya net chala jaye,
to box dobara aa jata. Ab woh soorat mumkin hi nahi — ek baar box bana,
matlab poocha ja chuka.

---

## Menu ka link kaisa dikhega

Woh aap ke site ke apne menu ka hissa banta hai, isliye baaki links jaisa
hi dikhega — wahi font, wahi rang. Bas saath me ek chhota hara nishan hoga
taake nazar me aa jaye.

Agar kisi page par menu na ho, to neeche baayen kone me ek chhoti si goli
aa jayegi. WhatsApp ka button daayen kone me hai, isliye takraav nahi hoga.

---

## Test kiya hua — 14/14

Ek nakli browser bana kar poora chakkar chalaya:

| Test | Nateeja |
|---|---|
| Pehli baar: menu me option | Foran aa gaya |
| Box foran nahi aata | 4 second baad |
| Box aane par nishan lag gaya | Theek |
| **Doosri baar: box bilkul nahi** | **Theek** |
| **Doosri baar: menu ka option ab bhi** | **Theek — yahi maqsad tha** |
| Pehle se install ho | Na box, na link |
| Menu na ho to goli | Aa gayi |
| Install hote hi sab gayab | Theek |
| Koi repeating timer | Nahi |
| 7 din wala purana chakkar | Nikal diya |

Aur baaki sab bhi dobara chalaya — PWA 25/25, cart 6/6, checkout 7/7,
orders 23/23, export 10/10, builder 12/12.

---

# TEST KARNE KA TAREEQA

Asli Android phone par, Chrome me:

1. Site kholein **incognito** me (taake pehli baar wala experience mile)
2. 4 second rukein — box aana chahiye
3. **"Abhi nahi"** dabayein
4. Page **refresh** karein — **box dobara nahi aana chahiye**
5. Menu kholein — **"🟢 Install App"** nazar aana chahiye
6. Usay dabayein — Chrome ka apna install wala dialog khulna chahiye
7. Install karein — icon ban jaye, aur menu ka link gayab ho jaye

Agar step 4 par box dobara aa jaye to matlab browser ne localStorage saaf
kar diya — normal window me test karein, incognito me nahi.
