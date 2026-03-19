# 📺 Video Advertisement Guide

## Kaise Kaam Karta Hai?

Ye video advertisement system **bina Firebase ke** kaam karta hai. Saara data aapke browser ke **localStorage** mein save hota hai aur GitHub Pages par perfectly chalega.

---

## 📹 Video Kaise Add Karein?

### Step 1: Video Upload Karein
1. Apni video ko **MP4 format** mein convert karein
2. Video size guidelines:
   - ✅ **Recommended**: 5MB ya kam (fast loading)
   - ⚠️ **Maximum**: 100MB (GitHub limit - slow on mobile)
   - 📱 **Mobile users** ke liye chhota size better hai
3. Video file ko **assets** folder mein upload karein
4. File ka naam simple rakhein (e.g., `v1.mp4`, `ad.mp4`)

> **💡 Pro Tip:** Video compress karne ke liye [HandBrake](https://handbrake.fr/) use karein - free tool hai!

### Step 2: Settings Configure Karein
1. **settings.html** page par jayein
2. Left sidebar mein **📺 Video Ad** par click karein
3. Settings configure karein:
   - ✅ **Enable Video Advertisement** - Check karein
   - 📹 **Video File Name** - Exact file name likhein (e.g., `v1.mp4`)
   - 📝 **Video Title** (Optional) - Title jo video ke upar dikhega
   - ▶️ **Auto Play** - Video automatically play ho
   - ❌ **Show Close Button** - User video close kar sake
   - 📍 **Position** - Video kahan dikhega (Top/Bottom)

### Step 3: Save aur Test
1. **Save Video Ad Settings** button par click karein
2. **index.html** page par jayein
3. Video ad apne aap show hoga!

---

## ⚙️ Settings Options

| Setting | Description |
|---------|-------------|
| **Enable/Disable** | Video ad on/off karein bina settings delete kiye |
| **Video File Name** | Assets folder mein video ka exact naam |
| **Video Title** | Video ke upar dikhne wala title (optional) |
| **Auto Play** | Video page load hote hi play ho (muted) |
| **Show Close Button** | User video close kar sake |
| **Position** | Top (hero ke baad) ya Bottom (footer se pehle) |

---

## 💡 Tips

1. **Video Size**: 
   - Recommended: 5MB ya kam (best performance)
   - Maximum: 100MB (GitHub limit - slow loading)
   - Mobile users ke liye hamesha chhota size use karein
2. **Video Format**: Sirf MP4 format use karein
3. **Video Length**: 15-30 seconds ideal hai
4. **File Naming**: Simple names use karein (no spaces)
5. **Compression**: [HandBrake](https://handbrake.fr/) se compress karein
6. **Testing**: Pehle chhota video test karein

---

## 🔧 Troubleshooting

### Video Show Nahi Ho Raha?
- Check karein ki file **assets** folder mein hai
- File name exactly same hai settings mein?
- Browser console mein error check karein (F12)
- File size toh zyada bada nahi? (>100MB GitHub par upload nahi hoga)

### Video Load Hone Mein Time Lag Raha Hai?
- File size check karein - 10MB+ slow ho sakta hai
- Mobile users ke liye 5MB se kam recommend karte hain
- [HandBrake](https://handbrake.fr/) se compress karein

### Auto Play Kaam Nahi Kar Raha?
- Browsers muted auto-play ko allow karte hain
- User interaction ke baad hi sound on hota hai

### Settings Save Nahi Ho Rahi?
- Browser localStorage enable hai?
- Private/Incognito mode to nahi hai?

---

## 📁 File Structure

```
Hunny Collection Pk/
├── assets/
│   ├── logo.jpeg
│   ├── banner1.jpeg
│   └── v1.mp4          ← Your video here
├── index.html
├── settings.html
├── video-ad.js         ← Video ad logic
└── style.css
```

---

## 🎯 Example Settings

**Simple Video Ad:**
- Enabled: ✅
- File Name: `v1.mp4`
- Title: `Special Sale!`
- Auto Play: ✅
- Close Button: ✅
- Position: Top

---

## 🚀 GitHub Pages Par Deploy

1. Saari files GitHub par push karein
2. Video file bhi **assets** folder mein upload karein
3. GitHub Pages automatically video serve karega
4. Koi extra configuration nahi chahiye!

---

## 📞 Support

Agar koi problem ho to browser console (F12) check karein aur error message note karein.

**Happy Advertising! 🎉**
