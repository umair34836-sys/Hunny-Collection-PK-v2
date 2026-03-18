# 🌸 Hunny Collection PK - Simple HTML Website

✅ **No React, No Build Process - Direct HTML Files!**

---

## 🚀 **Deploy to GitHub Pages (2 Steps)**

### **Step 1: Upload Files to GitHub**

1. Go to: https://github.com/umair34836-sys/Hunny-Collection-PK
2. Click **"Add file"** → **"Upload files"**
3. **Select all files** from this folder
4. Click **"Commit changes"**

### **Step 2: Enable GitHub Pages**

1. Go to: **Settings** → **Pages**
2. **Branch:** Select `main`
3. **Folder:** `/ (root)`
4. Click **Save**

**Wait 2-3 minutes!**

Your live URL:
```
https://umair34836-sys.github.io/Hunny-Collection-PK/
```

---

## 📁 **Files Structure**

```
Hunny Collection PK/
├── index.html          (Homepage)
├── shop.html           (Shop page)
├── product.html        (Product detail)
├── cart.html           (Shopping cart)
├── checkout.html       (Checkout)
├── login.html          (Login)
├── signup.html         (Sign up)
├── contact.html        (Contact)
├── admin.html          (Admin panel)
├── style.css           (Styles)
├── app.js              (JavaScript)
├── firebase-config.js  (Firebase setup)
├── firestore.rules     (Firebase rules)
└── storage.rules       (Storage rules)
```

---

## 🔥 **Firebase Setup (Required)**

### **1. Create Admin User**

Firebase Console → Authentication → Add user:
- Email: `admin@hunnycollection.pk`
- Password: (create strong password)

### **2. Add Admin to Firestore**

Firestore Database → Start collection:
- Collection ID: `admins`
- Document: (auto-generate)
- Field: `email` = `admin@hunnycollection.pk`

### **3. Update Firestore Rules**

Go to Firestore → Rules → Paste from `firestore.rules`

### **4. Update Storage Rules**

Go to Storage → Rules → Paste from `storage.rules`

---

## 🎯 **Features**

### **Customer Side:**
- ✅ Browse without login
- ✅ Login required for cart
- ✅ Shopping cart
- ✅ Checkout (COD only)
- ✅ Order tracking
- ✅ Light pink theme

### **Admin Panel:**
- ✅ Add/Edit/Delete products
- ✅ Manage categories
- ✅ View orders
- ✅ Update order status

---

## 📍 **URLs**

| Page | URL |
|------|-----|
| Home | `/` |
| Shop | `/shop.html` |
| Cart | `/cart.html` |
| Admin | `/admin.html` |

---

## ⚠️ **Important Notes**

1. **Firebase Backend Required** - This is frontend only
2. **Update Firestore Rules** - Before going live
3. **Create Admin User** - In Firebase Authentication
4. **Add Admin to Firestore** - `admins` collection

---

## 🎉 **Done!**

Your store is ready to use!

**Live URL:** https://umair34836-sys.github.io/Hunny-Collection-PK/

**Admin Panel:** https://umair34836-sys.github.io/Hunny-Collection-PK/admin.html

---

🌸 Happy Selling!
