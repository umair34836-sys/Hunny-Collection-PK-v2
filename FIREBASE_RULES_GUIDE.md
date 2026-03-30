# 🔥 Firebase Security Rules - Deployment Guide

## ✅ Rules Created For:

### 1. **Firestore Rules** (`firestore.rules`)
### 2. **Storage Rules** (`storage.rules`)

---

## 📋 What These Rules Do:

### **Firestore Rules:**

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| **Products** | ✅ Anyone | ✅ Admin/Vendors | ✅ Admin/Vendors | ✅ Admin/Vendors |
| **Categories** | ✅ Anyone | ✅ Admin only | ✅ Admin only | ✅ Admin only |
| **Orders** | ✅ Own orders | ✅ Auth users | ✅ Admin/Status only | ✅ Admin only |
| **Users** | ✅ Own data | ✅ Own account | ✅ Limited fields | ❌ No one |
| **Admins** | ✅ Auth users | ❌ No one | ❌ No one | ❌ No one |
| **Settings** | ✅ Anyone | ✅ Admin only | ✅ Admin only | ✅ Admin only |
| **Reviews** | ✅ Anyone | ✅ Auth users | ✅ Own reviews | ✅ Admin/Owner |

### **Storage Rules:**

| Folder | Read | Write | Restrictions |
|--------|------|-------|--------------|
| **/public/** | ✅ Anyone | ❌ Console only | - |
| **/products/{userId}/** | ✅ Anyone | ✅ Owner only | Images, Max 5MB |
| **/shops/{shopId}/** | ✅ Anyone | ✅ Auth users | Images, Max 5MB |
| **/avatars/{userId}/** | ✅ Anyone | ✅ Owner only | Images, Max 5MB |
| **/order-proofs/{orderId}/** | ✅ Customer/Admin | ✅ Auth users | Images, Max 5MB |
| **/banners/** | ✅ Anyone | ❌ Console only | - |
| **/vendor-documents/{userId}/** | ✅ Owner/Admin | ✅ Owner only | Images, Max 5MB |

---

## 🚀 How to Deploy Rules:

### **Method 1: Firebase Console (Recommended)**

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `hunny-collection-pk`

2. **Deploy Firestore Rules**
   - Go to **Firestore Database** → **Rules** tab
   - Copy entire content from `firestore.rules`
   - Paste in the rules editor
   - Click **Publish**

3. **Deploy Storage Rules**
   - Go to **Storage** → **Rules** tab
   - Copy entire content from `storage.rules`
   - Paste in the rules editor
   - Click **Publish**

---

### **Method 2: Firebase CLI (Advanced)**

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## ⚠️ Important Notes:

### **Before Deploying:**

1. **Create Admins Collection**
   - Go to Firestore Database
   - Create collection: `admins`
   - Add documents with user emails:
   ```
   Document ID: user_uid_here
   Field: email (string) = admin@example.com
   ```

2. **Test Rules First**
   - Use Firebase Rules Playground
   - Test with different user scenarios
   - Make sure nothing breaks

3. **Backup Current Rules**
   - Copy existing rules before replacing
   - Save them somewhere safe

---

## 🔧 Vendor System Specific Rules:

### **Vendors Can:**
- ✅ Create products with their `vendorId`
- ✅ Update their own products
- ✅ Delete their own products
- ✅ View orders containing their products
- ✅ Upload product images to `/products/{vendorId}/`

### **Vendors Cannot:**
- ❌ Create categories
- ❌ Delete other vendor products
- ❌ Modify order status (only view)
- ❌ Access admin features

---

## 🛡️ Security Features:

### **Data Validation:**
- ✅ Product name: 1-200 characters
- ✅ Product price: Must be >= 0
- ✅ Product images: Must be array with at least 1 item
- ✅ Order items: Must have at least 1 item
- ✅ Order total: Must be >= 0

### **File Upload Validation:**
- ✅ Only images allowed
- ✅ Max file size: 5MB
- ✅ Min dimensions: 100x100px
- ✅ Max dimensions: 4096x4096px

### **Access Control:**
- ✅ Users can only access their own data
- ✅ Vendors can only manage their own products
- ✅ Admins have full control
- ✅ Public data is readable by everyone

---

## 📝 Testing Checklist:

### **Test as Customer:**
- [ ] Can view products
- [ ] Can create orders
- [ ] Can view own orders
- [ ] Cannot access other users' orders
- [ ] Cannot create categories

### **Test as Vendor:**
- [ ] Can create products
- [ ] Can update own products
- [ ] Cannot update other vendor products
- [ ] Can view orders with own products
- [ ] Cannot create categories

### **Test as Admin:**
- [ ] Can manage all products
- [ ] Can manage all categories
- [ ] Can manage all orders
- [ ] Can view all users
- [ ] Can manage settings

---

## 🆘 Troubleshooting:

### **Error: "Missing or insufficient permissions"**
- Check if user is authenticated
- Verify user has correct role (admin/vendor)
- Check Firestore rules in Firebase Console

### **Error: "Image upload failed"**
- Check file size (must be < 5MB)
- Verify file is an image
- Check storage rules are deployed

### **Error: "Cannot write to admins collection"**
- This is intentional! Admins must be added via Console
- Go to Firestore → admins collection → Add document manually

---

## 📞 Support:

If you face any issues:
1. Check Firebase Console → Rules → Playground
2. Test with different scenarios
3. Check browser console for errors
4. Verify Firebase project ID matches

---

## ✅ Deployment Complete!

After deploying:
1. ✅ Test all features
2. ✅ Verify vendor system works
3. ✅ Check image uploads
4. ✅ Confirm admin panel access
5. ✅ Test order creation

**Your Firebase is now secure! 🔒**
