# 🌸 Hunny Collection PK - Investor Management System

Complete investor management system for profit sharing, tracking, and withdrawals.

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `investor-panel.html` | Investor dashboard for tracking earnings and withdrawals |
| `admin-investment-settings.html` | Admin panel for managing investors and settings |
| `investor-module.js` | Backend logic for profit calculations |
| `firestore.rules` | Updated security rules for investor collections |
| `admin.html` | Updated with Investment Settings link |

---

## 🚀 Setup Instructions

### 1. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

Or manually copy rules from `firestore.rules` to Firebase Console.

### 2. Create Initial Admin Investor

Open Firebase Console → Firestore Database → Create collection `investors` with first document:

```json
{
  "code": "INV-ADMIN",
  "name": "Admin Investor",
  "phone": "03000000000",
  "investment": 3000,
  "profitPercentage": 12,
  "capMultiplier": 2,
  "capAmount": 6000,
  "password": "admin123",
  "status": "active",
  "totalEarned": 0,
  "totalPaid": 0,
  "pendingWithdrawal": 0,
  "joinedDate": "2025-01-01T00:00:00.000Z"
}
```

### 3. Create Default Settings

Collection: `investment_settings`

```json
{
  "profitType": "net-profit",
  "defaultPercentage": 12,
  "capMultiplier": 2,
  "minWithdrawal": 100,
  "withdrawalProcessing": "manual",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 📊 How to Use

### For Admin (You)

1. **Access Investment Settings:**
   - Go to `admin.html`
   - Click "💰 Investment Settings" in sidebar
   - Or directly visit `admin-investment-settings.html`

2. **Add New Investor:**
   - Click "👥 Investors" tab
   - Click "+ Add New Investor"
   - Fill in details (code auto-generated)
   - Set profit percentage (recommended: 10-12%)
   - Set cap multiplier (recommended: 2x)
   - Give password to investor

3. **Configure Settings:**
   - Go to "🔧 Configuration" tab
   - Set profit type: **Net Profit Share** (recommended)
   - Set default percentage: **12%**
   - Set cap multiplier: **2** (investor gets 2x investment total)
   - Set minimum withdrawal: **Rs. 100**

4. **Process Withdrawals:**
   - Go to "💸 Withdrawals" tab
   - See pending requests
   - Approve or reject

5. **Calculate Profits:**
   - Go to "🧮 Profit Calculator" tab
   - Select product to see breakdown
   - View investor share and your profit

### For Investors

1. **Login:**
   - Visit `investor-panel.html`
   - Enter investor code (e.g., INV-XXXXXX)
   - Enter password (given by admin)

2. **Dashboard:**
   - View total investment
   - See total earned
   - Check pending withdrawals
   - View available balance

3. **Track Orders:**
   - Go to "📦 Orders" section
   - See all orders with profit breakdown
   - View your share per order

4. **Withdraw:**
   - Go to "💸 Withdraw" section
   - Click "Request Withdrawal"
   - Enter amount (max: available balance)
   - Select method (JazzCash/Easypaisa/Bank)
   - Enter account number
   - Submit request

---

## 💰 Profit Calculation Formula

### Net Profit Share (Recommended)

```
Net Profit = Order Total - Product Cost - Shipping - Packaging - Other Expenses

Investor Share = Net Profit × (Percentage / 100)

Your Profit = Net Profit - Investor Share
```

### Example:

| Item | Amount |
|------|--------|
| Order Total | Rs. 1,000 |
| Product Cost | Rs. 600 |
| Shipping | Rs. 100 |
| Packaging | Rs. 50 |
| **Net Profit** | **Rs. 250** |
| Investor Share (12%) | Rs. 30 |
| **Your Profit** | **Rs. 220** |

---

## 📋 Firestore Collections

### investors
```
- code: string (unique investor code)
- name: string
- phone: string
- investment: number
- profitPercentage: number
- capMultiplier: number
- capAmount: number (investment × multiplier)
- password: string
- status: string (active/inactive)
- totalEarned: number
- totalPaid: number
- pendingWithdrawal: number
- joinedDate: timestamp
```

### investor_earnings
```
- orderId: string
- investorId: string
- investorCode: string
- investorName: string
- productName: string
- netProfit: number
- percentage: number
- amount: number
- status: string (pending/paid)
- date: timestamp
- capAmount: number
- totalEarnedAfter: number
- capReached: boolean
```

### withdrawal_requests
```
- investorId: string
- investorCode: string
- investorName: string
- amount: number
- method: string (JazzCash/Easypaisa/Bank)
- account: string
- title: string
- status: string (pending/approved/rejected)
- date: timestamp
- processedDate: timestamp
- processedBy: string
```

### investment_settings
```
- profitType: string (net-profit/revenue)
- defaultPercentage: number
- capMultiplier: number
- minWithdrawal: number
- withdrawalProcessing: string (manual/auto)
- updatedAt: timestamp
```

---

## 🔐 Security Rules

The updated `firestore.rules` include:

- **investors**: Admin can write, investors can read own data
- **investor_earnings**: Admin can write, investors can read own earnings
- **withdrawal_requests**: Investors can create own, admin can process
- **investment_settings**: Admin only

---

## 🎯 Investment Deal Structure (Recommended)

```
Investment: Rs. 3,000
Profit Share: 12% of Net Profit per order
Cap: Rs. 6,000 (2x investment)
Duration: Until cap is reached (~1 year)
Principal Return: NOT returned (covered by cap)
```

### Why This Structure?

| Benefit | You (Owner) | Investor |
|---------|-------------|----------|
| Principal | ✅ Keep Rs. 3,000 | ❌ Not returned |
| Profit | ✅ Pay only from profits | ✅ Earn up to Rs. 6,000 |
| Risk | ✅ Low (profit-based) | ✅ Medium |
| Return | ✅ 100% on investment | ✅ 200% return |
| Timeline | ✅ ~1 year | ✅ ~1 year |

---

## 📱 Withdrawal Methods Supported

- 📱 **JazzCash**
- 📲 **Easypaisa**
- 🏦 **Bank Transfer**

---

## 🧪 Testing

### Test Investor Login:
1. Visit `investor-panel.html`
2. Use test investor code
3. Check dashboard loads

### Test Admin Panel:
1. Visit `admin-investment-settings.html`
2. Add test investor
3. Check investor appears in list

### Test Profit Calculator:
1. Go to Profit Calculator tab
2. Select product
3. Verify calculations

---

## 🐛 Troubleshooting

### Investor can't login:
- Check code is correct (case-sensitive)
- Verify password matches
- Check investor status is 'active'

### Withdrawal not showing:
- Check Firestore rules are deployed
- Verify investor ID matches
- Check withdrawal request was created

### Profit calculation wrong:
- Verify product cost price is set
- Check shipping/packaging costs
- Confirm percentage in settings

---

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Verify Firestore rules are deployed
3. Check browser console for errors
4. Ensure all files are uploaded

---

## 📄 License

Private - Hunny Collection PK

---

**Created:** 2025
**Version:** 1.0.0
