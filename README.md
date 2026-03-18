# 🌸 Hunny Collection PK - Complete WebStore

✅ **FULLY WORKING | IMAGE UPLOAD | MULTIPLE IMAGES | NO BUILD REQUIRED**

---

## 🖼️ **Image Upload Features**

### **Admin Panel Se:**
- ✅ **Direct Upload** to Firebase Storage
- ✅ **Multiple Images** per product
- ✅ **Image Preview** before saving
- ✅ **Drag & Drop** support
- ✅ **Auto URL generation**

### **Product Page:**
- ✅ **Image Gallery** with thumbnails
- ✅ **Click to enlarge**
- ✅ **Multiple angles** support

---

## 🚀 **Deploy to GitHub Pages (2 Easy Steps)**

### **Step 1: Upload All Files to GitHub**

1. Go to: https://github.com/umair34836-sys/Hunny-Collection-PK
2. Click **"Add file"** → **"Upload files"**
3. **Select ALL files** from this folder
4. Click **"Commit changes"**

### **Step 2: Enable GitHub Pages**

1. Go to: **Settings** → **Pages**
2. **Branch:** Select `main`
3. **Folder:** `/ (root)`
4. Click **Save**

**Wait 2-3 minutes!**

### **Your Live URL:**
```
https://umair34836-sys.github.io/Hunny-Collection-PK/
```

---

## 🔥 **Firebase Setup (REQUIRED - 5 Minutes)**

### **1. Enable Authentication**

Firebase Console → Authentication → Get Started:
- **Email/Password:** Enable

### **2. Create Firestore Database**

Firebase Console → Firestore Database → Create Database:
- **Mode:** Test mode (for now)
- **Location:** Any (closest to Pakistan)

### **3. Create Admin User**

Firebase Console → Authentication → Users → Add User:
- **Email:** `admin@hunnycollection.pk`
- **Password:** (create a strong password - SAVE THIS!)

### **4. Add Admin to Firestore**

Firebase Console → Firestore Database → Start Collection:
- **Collection ID:** `admins`
- **Document ID:** (auto-generate)
- **Field:** `email` (string) = `admin@hunnycollection.pk`
- **Save**

### **5. Update Firestore Rules**

Firebase Console → Firestore Database → Rules:

**Copy-Paste This:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{category} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{order} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /admins/{admin} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

**Click Publish**

### **3. Enable Storage (For Image Upload)**

Firebase Console → Storage → Get Started:
- **Mode:** Test mode
- **Location:** Same as Firestore
- **Save**

**Storage Rules Update Karo:**

Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
match /b/{bucket}/o {
  match /{allPaths=**} {
    allow read: if true;
    allow write: if request.auth != null;
  }
}
```

**Publish** karo!

---

## 📁 **Files Included**

```
Hunny Collection PK/
├── index.html           (Homepage)
├── shop.html            (Shop with filters)
├── product.html         (Product detail page)
├── cart.html            (Shopping cart)
├── checkout.html        (Checkout - COD)
├── login.html           (User login)
├── signup.html          (User signup)
├── contact.html         (Contact page)
├── admin.html           (Admin panel)
├── style.css            (Light pink theme)
├── app.js               (Main JavaScript)
├── firebase-config.js   (Firebase setup)
├── firestore.rules      (Database rules)
├── storage.rules        (Storage rules)
└── README.md            (This file)
```

---

## ✨ **Features**

### **Customer Side:**
- ✅ Browse products without login
- ✅ User signup/login
- ✅ Shopping cart
- ✅ Checkout (Cash on Delivery)
- ✅ Order placement
- ✅ Light pink theme
- ✅ Responsive design

### **Admin Side:**
- ✅ Protected admin login
- ✅ Dashboard with stats
- ✅ Add/Edit/Delete products
- ✅ Create categories
- ✅ View orders
- ✅ Update order status (Pending, Confirmed, Shipped, Delivered)

---

## 🎯 **How to Use**

### **For Customers:**
1. Visit: `https://umair34836-sys.github.io/Hunny-Collection-PK/`
2. Browse products
3. Sign up / Login
4. Add to cart
5. Checkout (COD)

### **For Admin:**
1. Visit: `https://umair34836-sys.github.io/Hunny-Collection-PK/admin.html`
2. Login with admin credentials
3. Click **"Add Product"**
4. **Upload Images:**
   - Click "Choose Files" button
   - Select multiple images
   - Click "📤 Upload Images to Firebase"
   - Wait for upload to complete
   - Preview dikhai dega
5. Fill product details
6. Click "Save Product"

---

## 🖼️ **Image Upload Guide**

### **Method 1: Direct Upload (Recommended)**

**Admin Panel Se:**
1. Admin panel kholo
2. Products → Add Product
3. **"Choose Files"** button click karo
4. Multiple images select karo
5. **"📤 Upload Images to Firebase"** click karo
6. Upload complete hone ka wait karo
7. Preview mein images dikhengi
8. Baaki details bharo
9. Save Product

**Features:**
- ✅ Multiple images (unlimited)
- ✅ Free Firebase Storage (5GB)
- ✅ Auto URL generation
- ✅ Preview before save

---

### **Method 2: External URLs**

**Agar Firebase Storage use nahi karna:**

1. **Image URLs kahan se lein:**
   - **ImgBB:** https://imgbb.com/ (free unlimited)
   - **Cloudinary:** https://cloudinary.com/ (free 25GB)
   - **Postimages:** https://postimages.org/ (free)
   - Apna server/website

2. **URLs copy karo** (comma separated)

3. **Admin panel mein:**
   - "Or paste image URLs" field mein paste karo
   - Example: `https://imgbb.com/abc.jpg, https://imgbb.com/def.jpg`

---

## 📹 **Video Support:**

**Currently:** Sirf images support hoti hain

**Video add karna hai toh:**
1. YouTube par upload karo (unlisted)
2. Video ka thumbnail image use karo
3. Description mein YouTube link daal do

**Ya future update mein video support aa jayegi!**

---

## ⚠️ **Important Notes**

### **Before Going Live:**

1. **Add Some Products:**
   - Go to admin panel
   - Add at least 3-5 products
   - Add categories

2. **Test Everything:**
   - User signup
   - Login/Logout
   - Add to cart
   - Checkout
   - Order placement

3. **Firebase Security:**
   - Update Firestore rules (done above)
   - Update Storage rules (if using)

### **Test Data:**

**Add a Test Product:**
- Name: "Test Dress"
- Price: 2500
- Category: "Dresses"
- Image URL: `https://via.placeholder.com/300x300/FFB6C1/333?text=Dress`

**Add a Test Category:**
- Name: "Dresses"

---

## 🔧 **Troubleshooting**

### **Blank Page:**
- Check browser console (F12)
- Verify Firebase config in `firebase-config.js`
- Make sure Firebase project is created

### **Login Not Working:**
- Enable Email/Password in Firebase Authentication
- Check Firebase Console → Authentication → Sign-in method

### **Products Not Showing:**
- Add products from admin panel
- Check Firestore rules
- Verify products collection exists

### **Can't Login to Admin:**
- Create admin user in Firebase Authentication
- Add admin to Firestore `admins` collection
- Email must match exactly

---

## 📞 **Contact Information**

Pre-configured in the store:
- **WhatsApp:** +92 301 8858303
- **Email:** info@hunnycollection.pk
- **Location:** Pakistan

---

## 🎉 **You're Done!**

Your complete e-commerce store is ready!

**Live URL:** `https://umair34836-sys.github.io/Hunny-Collection-PK/`

**Admin Panel:** `https://umair34836-sys.github.io/Hunny-Collection-PK/admin.html`

---

## 📊 **What's Included:**

✅ Frontend: HTML, CSS, JavaScript (No framework!)
✅ Backend: Firebase (Firestore + Auth)
✅ Hosting: GitHub Pages (Free)
✅ Theme: Light Pink (Professional)
✅ Payment: Cash on Delivery
✅ Admin Panel: Full featured

---

**🌸 Happy Selling!**
