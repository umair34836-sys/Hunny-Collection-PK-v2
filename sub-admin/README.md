# Sub-Admin Panel System - Documentation

## Overview
This project now includes a complete **Sub-Admin Panel System** that allows the God Admin (super admin) to invite and manage multiple sub-admins, each with their own isolated dashboard, products, and orders.

## Architecture

### God Panel (Existing Admin Panel)
- **Location**: Root directory (`admin.html`, `admin-*.html`)
- **Access**: First admin to login automatically becomes God Admin
- **Features**:
  - Full access to all products, orders, reviews, etc.
  - Can view and manage ALL data in the system
  - Can invite and manage sub-admins
  - Uses pink color theme (#8CE4FF, #FEEE91)

### Sub-Admin Panel (New)
- **Location**: `/sub-admin/` folder
- **Access**: By invitation only from God Admin
- **Features**:
  - Isolated dashboard for each sub-admin
  - Can only see and manage THEIR OWN products and orders
  - Can view all products but can only edit/delete their own
  - Uses purple/blue color theme (#667eea, #764ba2)

## Folder Structure

```
project-root/
├── admin.html                      # God Panel Dashboard
├── admin-products.html             # God Panel Products
├── admin-orders.html               # God Panel Orders
├── admin-sub-admins.html           # Sub-Admin Management (God Panel only)
├── admin-common.js                 # God Panel Auth & Utilities
├── admin-api.js                    # God Panel API (all data)
├── firestore.rules                 # Updated with sub-admin support
│
└── sub-admin/                      # Sub-Admin Panel Folder
    ├── sub-admin.html              # Sub-Admin Dashboard
    ├── sub-admin-products.html     # Sub-Admin Products
    ├── sub-admin-orders.html       # Sub-Admin Orders
    ├── sub-admin-orders-history.html # Sub-Admin Order History
    ├── sub-admin-common.js         # Sub-Admin Auth & Utilities
    └── sub-admin-api.js            # Sub-Admin API (filtered by owner)
```

## Database Changes

### Admins Collection
```javascript
admins/{uid}
{
  email: "admin@example.com",
  uid: "firebase-uid",
  role: "super-admin",
  adminType: "god" | "sub",  // NEW FIELD
  createdAt: "2026-04-14T...",
  autoRegistered: true/false
}
```

### Products Collection (Updated)
```javascript
products/{productId}
{
  name: "Product Name",
  price: 1000,
  // ... other fields
  ownerId: "admin-uid",        // NEW FIELD
  ownerEmail: "admin@example.com"  // NEW FIELD
}
```

### Orders Collection (Updated)
```javascript
orders/{orderId}
{
  customerName: "Customer",
  total: 1000,
  // ... other fields
  adminOwnerId: "admin-uid",    // NEW FIELD (for sub-admin orders)
  adminOwnerEmail: "admin@example.com"  // NEW FIELD
}
```

### Sub-Admin Invitations Collection (New)
```javascript
sub-admin-invitations/{invitationId}
{
  email: "subadmin@example.com",
  invitedAt: timestamp,
  status: "pending",
  invitedBy: "god-admin-uid"
}
```

## How It Works

### For God Admin

1. **Login to God Panel** (`admin.html`)
   - First time login auto-registers as God Admin
   - Full access to everything

2. **Invite Sub-Admins**
   - Go to "Sub-Admins" in sidebar or "Sub-Admin Management" quick action
   - Enter sub-admin email
   - Click "Send Invitation"
   - Sub-admin appears in "Pending Invitations" until they register

3. **Manage Sub-Admins**
   - View all active sub-admins
   - Delete sub-admins (their data remains but becomes inaccessible)
   - Cancel pending invitations

4. **View All Data**
   - God panel shows ALL products and orders from all admins
   - Can filter by owner if needed (future enhancement)

### For Sub-Admins

1. **Receive Invitation**
   - God admin sends invitation email
   - Access sub-admin login at: `/sub-admin/sub-admin.html`

2. **Login to Sub-Admin Panel**
   - Use the invited email and password
   - Only invited emails can access sub-admin panel

3. **Manage Own Dashboard**
   - View personal stats (products, orders, revenue)
   - Add own products (automatically tagged with UID)
   - View and update own orders only
   - Cannot access other sub-admins' data

4. **Product Ownership**
   - Products created by sub-admin are tagged with their UID
   - Can view all products but can only edit/delete their own
   - Other sub-admins can see but not modify

## Firestore Security Rules

Updated rules ensure:
- ✅ God admins can manage sub-admins
- ✅ Sub-admins can only access their own data
- ✅ Products/orders are owner-restricted for sub-admins
- ✅ God admins have full access to everything

Key rules:
```javascript
// Only god admins can delete admins
allow delete: if isGodAdmin();

// Sub-admins can only update/delete their own products
allow update: if isAdmin() && 
                 (resource.data.ownerId == request.auth.uid || isGodAdmin());

// Sub-admins can only update their own orders
allow update: if isAdmin() &&
                 (resource.data.adminOwnerId == request.auth.uid || isGodAdmin());
```

## Setup Instructions

### Deploy Updated Firestore Rules

1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `hunny-collection-pk`
3. Go to Firestore Database
4. Click "Rules" tab
5. Copy contents from `firestore.rules` and paste
6. Click "Publish"

### Test God Panel

1. Open `admin.html`
2. Login with email/password
3. You should auto-register as God Admin
4. Check Firestore `admins` collection - should have `adminType: 'god'`

### Test Sub-Admin Management

1. In God Panel, go to "Sub-Admins"
2. Enter an email to invite
3. Check Firestore `sub-admin-invitations` - should show pending invitation

### Test Sub-Admin Panel

1. Open `/sub-admin/sub-admin.html`
2. Login with invited email
3. Should see sub-admin dashboard
4. Add a product - check Firestore, should have `ownerId` and `ownerEmail`
5. Verify can only see own products

## Color Themes

### God Panel (Pink Theme)
- Primary: #8CE4FF (light blue)
- Secondary: #FEEE91 (yellow)
- Dark: var(--dark-pink)
- Used in: All root admin-*.html files

### Sub-Admin Panel (Purple/Blue Theme)
- Primary: #667eea (purple)
- Secondary: #764ba2 (dark purple)
- Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Used in: All sub-admin/*.html files

## API Functions

### God Panel API (admin-api.js)
```javascript
// Sub-admin management
getAllSubAdmins()
createSubAdminInvitation(email, invitedByUid)
getPendingSubAdminInvitations()
deleteSubAdminInvitation(invitationId)
deleteSubAdmin(adminId)

// Product/Order creation (updated)
createProduct(productData, ownerId, ownerEmail)
createDigitalProduct(productData, ownerId, ownerEmail)
```

### Sub-Admin API (sub-admin/sub-admin-api.js)
```javascript
// Products
getMyProducts(ownerId)
createProduct(productData, ownerId, ownerEmail)
updateProduct(productId, productData, ownerId)
deleteProduct(productId, ownerId)

// Orders
getMyOrders(adminOwnerId)
updateOrderStatus(orderId, status, ownerId)

// Digital Products
getMyDigitalProducts(ownerId)
createDigitalProduct(productData, ownerId, ownerEmail)

// Stats
getSubAdminDashboardStats(ownerId)
```

## Migration Notes

### Existing Products/Orders
- Products/orders created before this update will NOT have `ownerId` fields
- They will still be accessible to God Admin
- Sub-admins will not see them (filtered by ownerId)
- To migrate: manually add `ownerId` to existing products if needed

### Existing Admins
- Existing admins will NOT have `adminType` field
- On next login, they should be updated to `adminType: 'god'`
- Or manually update in Firestore

## Future Enhancements (Optional)

1. **Email Notifications**
   - Send actual email invitations via Firebase Cloud Functions
   - Notify sub-admins of new orders

2. **Revenue Sharing**
   - Automatic profit calculation per sub-admin
   - Investor share tracking per sub-admin

3. **Cross-Admin Product Sharing**
   - Allow sub-admins to share products with other sub-admins
   - Product collaboration features

4. **Sub-Admin Performance Stats**
   - Individual sub-admin analytics
   - Sales performance tracking

5. **Role-Based Permissions**
   - Custom roles for sub-admins
   - Granular permission control

## Troubleshooting

### Sub-Admin Can't Login
- Check if email exists in `sub-admin-invitations` collection
- Verify email matches invitation exactly
- Check Firestore rules are deployed

### Products Not Showing for Sub-Admin
- Verify `ownerId` field is set on products
- Check sub-admin UID matches product `ownerId`
- Verify Firestore rules allow read access

### God Admin Can't Manage Sub-Admins
- Verify `adminType: 'god'` in Firestore admins collection
- Check Firestore rules deployed correctly
- Verify auth state is correct

## Support

For issues or questions:
1. Check Firestore rules are deployed
2. Verify adminType fields are set correctly
3. Check browser console for errors
4. Review this documentation

---

**Last Updated**: April 14, 2026
**Version**: 1.0
**Author**: Hunny Collection PK Development Team
