# 🌸 Hunny Collection PK

**Premium Female Fashion Store in Pakistan**

A complete e-commerce website built for GitHub Pages with Firebase backend.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Firebase Configuration](#-firebase-configuration)
- [Video Advertisement](#-video-advertisement)
- [Admin Panel](#-admin-panel)
- [Site Settings](#-site-settings)
- [File Upload Guide](#-file-upload-guide)
- [Responsive Design](#-responsive-design)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

---

## ✨ Features

### 🛍️ **E-commerce**
- ✅ Product catalog with categories
- ✅ Shopping cart system
- ✅ Checkout with order placement
- ✅ Order tracking
- ✅ User accounts (login/signup)
- ✅ Cash on Delivery (COD)
- ✅ **Multiple product images gallery**
- ✅ **Image navigation (previous/next)**

### 📱 **Mobile First**
- ✅ Fully responsive design
- ✅ Hamburger menu for mobile
- ✅ Touch-friendly interface
- ✅ Works on all screen sizes

### 🎨 **Design**
- ✅ Pink theme (customizable)
- ✅ Banner images for sections
- ✅ Logo + text branding
- ✅ Video advertisements
- ✅ Floating WhatsApp button

### ⚙️ **Admin Features**
- ✅ Add/Edit/Delete products
- ✅ Manage categories
- ✅ View all orders
- ✅ Update order status
- ✅ Site settings panel

### 🔥 **Firebase Integration**
- ✅ User authentication
- ✅ Firestore database
- ✅ Real-time updates
- ✅ Cloud storage for images

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Firebase (Authentication + Firestore) |
| **Hosting** | GitHub Pages |
| **Storage** | Firebase Storage / Local assets |
| **Styling** | Custom CSS (Pink theme) |

---

## 📁 Project Structure

```
Hunny Collection Pk/
├── assets/                  # Images & Videos
│   ├── logo.jpeg           # Store logo
│   ├── home banner.jpeg    # Hero section banner
│   ├── banner1-5.jpeg      # Section banners
│   └── *.mp4               # Video ads (optional)
│
├── HTML Pages
│   ├── index.html          # Homepage
│   ├── shop.html           # Shop/Products page
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout page
│   ├── contact.html        # Contact page
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── product.html        # Product detail
│   ├── account.html        # User account
│   ├── orders.html         # Order history
│   ├── admin.html          # Admin panel
│   └── settings.html       # Site settings
│
├── JavaScript
│   ├── app.js              # Main app logic
│   ├── firebase-config.js  # Firebase setup
│   ├── site-settings.js    # Settings loader
│   ├── video-ad.js         # Video ads system
│   └── whatsapp-float.js   # WhatsApp button
│
├── CSS
│   ├── style.css           # Main styles
│   └── whatsapp-float.css  # WhatsApp styles
│
└── README.md               # This file
```

---

## 🚀 Setup Instructions

### Step 1: Clone/Download Repository

```bash
git clone <your-repo-url>
cd "Hunny Collection Pk"
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Copy Firebase config

### Step 3: Configure Firebase

Edit `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 4: Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 5: Enable GitHub Pages

1. Go to Repository Settings
2. Navigate to **Pages**
3. Source: **main branch**
4. Save

---

## 🔥 Firebase Configuration

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firestore Indexes

Create composite indexes in Firestore Console for:
- Products (category, featured, createdAt)
- Orders (userId, status, createdAt)

---

## 📺 Video Advertisement

### Setup (No Coding Required)

1. **Upload Video** to `assets/` folder
   - Format: MP4 only
   - Recommended size: 5MB or less
   - Maximum size: 100MB
   - Name: Simple (e.g., `v1.mp4`, `ad.mp4`)

2. **Configure Settings**
   - Go to `settings.html`
   - Click **📺 Video Ad** section
   - Enable video advertisement
   - Enter file name (e.g., `v1.mp4`)
   - Set title (optional)
   - Choose position (Top/Bottom)
   - Save settings

3. **View on Homepage**
   - Video appears automatically
   - Auto-play (muted)
   - Close button available

### Features

| Setting | Description |
|---------|-------------|
| **Enable/Disable** | Turn on/off without deleting settings |
| **File Name** | Exact name in assets folder |
| **Title** | Display title above video |
| **Auto Play** | Video plays automatically (muted) |
| **Close Button** | Allow users to close |
| **Position** | Top (after hero) or Bottom |

---

## ⚙️ Admin Panel

### Access

1. Go to `admin.html`
2. Login with admin credentials
3. Full access to:
   - Products management
   - Categories management
   - Orders view
   - Site settings

### Features

- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 View all orders
- ✅ Update order status
- 🏷️ Manage categories

---

## 🔧 Site Settings

Access via `settings.html`

### Configurable Options

| Section | Settings |
|---------|----------|
| **General** | Store name, tagline, description, copyright |
| **Contact** | WhatsApp, email, location, support hours |
| **Social** | Facebook, Instagram, TikTok, YouTube |
| **SEO** | Meta description, keywords, OG image |
| **Shipping** | Shipping message, delivery time, cities |
| **Payment** | Payment methods, instructions |
| **Video Ad** | Video advertisement settings |

### How to Use

1. Open `settings.html`
2. Navigate to desired section
3. Update values
4. Click **Save**
5. Changes apply site-wide

---

## 📤 File Upload Guide

### Images

**Supported Formats:** JPEG, PNG, WebP

**Upload to `assets/` folder:**
- Logo: `logo.jpeg` (50x50px recommended)
- Home Banner: `home banner.jpeg` (1920x600px)
- Section Banners: `banner1.jpeg` to `banner5.jpeg`

**Product Images (Multiple):**
- Upload via Admin Panel → Add/Edit Product
- Click "📁 Upload Multiple Images"
- Select multiple images (hold Ctrl for multiple selection)
- First image will be main display image
- Other images shown in gallery with navigation
- Or paste direct URLs from ImgBB/Cloudinary
- Click on thumbnail to view full image
- Use ← → buttons to navigate between images

### Videos

**Supported Format:** MP4 only

**Upload to `assets/` folder:**
- Recommended: 5MB or less
- Maximum: 100MB
- Duration: 15-30 seconds ideal
- Resolution: 720p (HD) sufficient

**Compression Tool:** [HandBrake](https://handbrake.fr/) (Free)

### Steps

1. Copy file to `assets/` folder
2. Use simple file names (no spaces)
3. Reference in settings or HTML

---

## 📱 Responsive Design

### Breakpoints

| Screen Size | Layout |
|-------------|--------|
| **Desktop** (1200px+) | 4-column grid, full navigation |
| **Tablet** (768-1199px) | 2-3 column grid, adjusted spacing |
| **Mobile** (481-767px) | 2-column grid, hamburger menu |
| **Small Mobile** (≤480px) | 1-column grid, compact layout |

### Mobile Features

- ✅ Hamburger menu (animated)
- ✅ Touch-friendly buttons
- ✅ Optimized images
- ✅ Readable fonts
- ✅ Full-width buttons (small screens)
- ✅ Slide-out navigation

### Test Responsive Design

1. **Browser DevTools:** F12 → Toggle Device Toolbar
2. **Real Device:** Open on phone/tablet
3. **Online Tool:** [Responsive Design Checker](https://responsivedesignchecker.com/)

---

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub
2. Settings → Pages
3. Source: main branch
4. Wait 2-3 minutes
5. Site live at: `https://username.github.io/repo-name`

### Custom Domain (Optional)

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Add CNAME file to repository
3. Configure DNS in domain provider
4. Update in GitHub Pages settings

### Update Site

```bash
git add .
git commit -m "Update description"
git push
```

Changes live in 2-3 minutes.

---

## 🔧 Troubleshooting

### Video Not Showing?

- ✅ Check file is in `assets/` folder
- ✅ Verify exact file name in settings
- ✅ Check browser console (F12)
- ✅ Ensure file size < 100MB

### Firebase Errors?

- ✅ Verify Firebase config is correct
- ✅ Check Firestore rules
- ✅ Ensure authentication is enabled
- ✅ Review browser console errors

### Images Not Loading?

- ✅ Check file paths (case-sensitive)
- ✅ Verify files exist in `assets/`
- ✅ Clear browser cache
- ✅ Check file permissions

### Mobile Menu Not Working?

- ✅ Clear browser cache
- ✅ Check JavaScript console
- ✅ Ensure all scripts loaded
- ✅ Test on different browsers

### Site Not Updating?

- ✅ Hard refresh (Ctrl + Shift + R)
- ✅ Clear browser cache
- ✅ Check GitHub Pages build status
- ✅ Wait 2-3 minutes after push

---

## 📞 Support

### Contact Information

- **WhatsApp:** +92 301 8858303
- **Email:** info@hunnycollection.pk
- **Location:** Pakistan

### Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Guide](https://pages.github.com/)
- [HandBrake (Video Compressor)](https://handbrake.fr/)
- [Responsive Design Testing](https://responsivedesignchecker.com/)

---

## 📄 License

This project is proprietary software for Hunny Collection PK.

---

## 🎉 Credits

**Developed with ❤️ for Hunny Collection PK**

- Frontend: HTML, CSS, JavaScript
- Backend: Firebase
- Hosting: GitHub Pages
- Design: Custom Pink Theme

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Pages** | 12 HTML pages |
| **Features** | 20+ features |
| **Mobile Ready** | 100% responsive |
| **Video Ads** | Supported (up to 100MB) |
| **Payment** | Cash on Delivery |
| **Delivery** | 3-7 business days |

---

**Last Updated:** March 2026  
**Version:** 2.0

---

**Happy Shopping! 🌸**
