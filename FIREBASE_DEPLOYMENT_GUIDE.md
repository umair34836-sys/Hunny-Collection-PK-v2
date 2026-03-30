# 🔥 Firebase Rules - Perfect for Vendor System

## ✅ Ready to Deploy Rules

Yeh rules aapke **Hunny Collection PK** project ke liye perfect hain, especially **vendor system** ke saath!

---

## 📋 Rules Overview:

### **Firestore Rules:**

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| **Products** | ✅ Anyone | ✅ Admin/Vendors | ✅ Admin/Vendors | ✅ Admin/Vendors |
| **Categories** | ✅ Anyone | ✅ Admin only | ✅ Admin only | ✅ Admin only |
| **Orders** | ✅ Own/Vendors | ✅ Customers | ✅ Admin/Status | ✅ Admin only |
| **Users** | ✅ Own/Admin | ✅ Self | ✅ Self/Admin | ❌ No one |
| **Admins** | ✅ Auth users | ❌ No one | ❌ No one | ❌ No one |
| **Settings** | ✅ Anyone | ✅ Admin only | ✅ Admin only | ✅ Admin only |

### **Storage Rules:**

| Folder | Read | Write |
|--------|------|-------|
| **/products/{userId}/** | ✅ Anyone | ✅ Owner only |
| **/public/** | ✅ Anyone | ❌ Console only |
| **/banners/** | ✅ Anyone | ❌ Console only |

---

## 🚀 Deploy to Firebase (Step-by-Step):

### **Method 1: Firebase Console (Easy)**

#### **Step 1: Deploy Firestore Rules**

1. Open Firebase Console: https://console.firebase.google.com
2. Select project: **hunny-collection-pk**
3. Go to: **Firestore Database** → **Rules** tab
4. Copy entire content from `firestore.rules`
5. Paste in rules editor
6. Click **Publish** ✅

#### **Step 2: Deploy Storage Rules**

1. Go to: **Storage** → **Rules** tab
2. Copy entire content from `storage.rules`
3. Paste in rules editor
4. Click **Publish** ✅

---

### **Method 2: Firebase CLI (Advanced)**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy both rules
firebase deploy --only firestore:rules,storage:rules
```

---

## ⚠️ IMPORTANT - Setup Admin First!

Rules deploy karne se **PEHLE**, admin setup karein:

### **Firestore Console Mein:**

1. **Firestore Database** open karein
2. **Start collection** par click karein
3. Collection ID: `admins`
4. **Add document** karein
5. Document ID: `[ADMIN_USER_UID]` (admin ka Firebase UID)
6. Field add karein:
   - Field name: `email`
   - Type: `string`
   - Value: `admin@example.com`
7. **Save** karein

### **Admin UID Kaise Milega:**

1. Firebase Console → **Authentication** → **Users**
2. Admin user dhundhein
3. UID copy karein
4. Uss UID se admins collection mein document banayein

---

## ✅ Rules Testing Checklist:

### **Test as Customer:**
- [ ] Can view all products
- [ ] Can view categories
- [ ] Can create own orders
- [ ] Can view own orders
- [ ] Cannot create categories
- [ ] Cannot access other users' orders

### **Test as Vendor:**
- [ ] Can create products with own vendorId
- [ ] Can update own products
- [ ] Can delete own products
- [ ] Can view all categories
- [ ] Cannot create categories
- [ ] Can view orders with own products
- [ ] Cannot update other vendors' products
- [ ] Can upload product images to /products/{vendorId}/

### **Test as Admin:**
- [ ] Can manage all products
- [ ] Can create/update/delete categories
- [ ] Can manage all orders
- [ ] Can view all users
- [ ] Can manage settings
- [ ] Full control over everything

---

## 🔒 Security Features:

### **Products:**
- ✅ Vendor can only manage own products (checked by vendorId)
- ✅ Product validation (name, price, images)
- ✅ Anyone can view products

### **Categories:**
- ✅ Only admin can create/update/delete
- ✅ Vendors can only select from existing categories
- ✅ Anyone can view categories

### **Orders:**
- ✅ Customer can only create own orders
- ✅ Vendor can view orders with their products
- ✅ Admin has full control
- ✅ Order validation (items, total)

### **Storage:**
- ✅ Only images allowed
- ✅ Max 5MB file size
- ✅ Vendors can only upload to own folder
- ✅ Product images are public

---

## 🆘 Troubleshooting:

### **Error: "Missing or insufficient permissions"**

**Solution:**
1. Check if user is authenticated
2. Verify admin is in `admins` collection
3. Check vendor has `role: 'vendor'` in users collection
4. Verify product has correct `vendorId`

### **Error: "Cannot create category"**

**Solution:**
- Only admin can create categories
- Login with admin account
- Go to admin panel → Categories → Add Category

### **Error: "Cannot upload image"**

**Solution:**
1. Check file is image (jpg, png, etc.)
2. Check file size < 5MB
3. Verify uploading to correct folder: `/products/{your-uid}/`
4. Check storage rules are deployed

---

## 📝 Quick Test Commands:

### **Test Product Creation (Vendor):**
```javascript
// In Firebase Console → Firestore → Rules Playground
// Test as vendor user
match /products/{productId} {
  allow create: if request.auth.uid == "VENDOR_UID" &&
                   request.resource.data.vendorId == "VENDOR_UID";
}
```

### **Test Category Creation (Admin):**
```javascript
// Test as admin user
match /categories/{categoryId} {
  allow create: if isAdmin(); // Should succeed for admin
}
```

---

## ✅ After Deployment:

1. ✅ Test vendor product creation
2. ✅ Test admin category management
3. ✅ Test image uploads
4. ✅ Test order creation
5. ✅ Verify vendor cannot access other vendor data

---

## 📞 Need Help?

Agar koi issue ho toh:

1. **Check Firebase Console** → Rules → Playground
2. **Test different scenarios**
3. **Check browser console** for errors
4. **Verify collections structure**

---

## 🎯 Perfect For:

- ✅ Multi-vendor e-commerce
- ✅ Admin + Vendor + Customer roles
- ✅ Product management
- ✅ Order tracking
- ✅ Image uploads
- ✅ Category management

---

**Rules are production-ready! Deploy with confidence!** 🚀
