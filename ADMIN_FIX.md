# 🔐 Admin Access Fix

## Problem: "Not authorized as admin"

## ✅ Quick Fix (2 Methods)

---

### **Method 1: Add Admin to Firestore (RECOMMENDED)**

1. **Firebase Console kholo:**
   https://console.firebase.google.com/project/hunny-collection-pk/firestore

2. **Firestore Database → Start collection**

3. **Collection ID:** `admins`

4. **Document ID:** (auto-generate rehne do)

5. **Field add karo:**
   - **Field name:** `email`
   - **Type:** `string`
   - **Value:** (wohi email jo tum login ke liye use kar rahe ho)

   **Example:**
   ```
   email: "admin@hunnycollection.pk"
   ```

6. **Save** karo

7. **Admin panel refresh karo**

---

### **Method 2: Check Email Match**

**Authentication Email = Firestore Email**

1. **Firebase Console → Authentication → Users**
   - Note your email: `___________`

2. **Firebase Console → Firestore → admins collection**
   - Check email field: `___________`

**Dono SAME hone chahiye!** (case-sensitive)

---

### **Method 3: Temporary Bypass (For Testing Only)**

Agar abhi test karna hai bina admin setup ke:

**Console mein check karo:**

1. Admin panel kholo
2. **F12** press karo
3. **Console** tab kholo
4. Dekho kya error aa raha hai

**Email dekh kar Firestore mein add karo!**

---

## ✅ **Complete Setup:**

### **Step 1: Create Admin User**

Firebase Console → Authentication → Add User:
- Email: `admin@hunnycollection.pk`
- Password: (your password)

### **Step 2: Add to Firestore**

Firebase Console → Firestore → Start Collection:
- Collection: `admins`
- Field: `email` = `admin@hunnycollection.pk`

### **Step 3: Login**

Admin panel par jao:
- Email: `admin@hunnycollection.pk`
- Password: (your password)

**Done!** ✅

---

## 🎯 **Still Having Issues?**

### **Check Firestore Rules:**

Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admins/{admin} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

**Publish** karo!

---

## 📧 **Common Issues:**

| Issue | Solution |
|-------|----------|
| Email mismatch | Check case (uppercase/lowercase) |
| No admins collection | Create it in Firestore |
| Wrong field name | Field must be `email` |
| Rules blocking | Update Firestore rules |

---

**Ab try karo!** 🌸
