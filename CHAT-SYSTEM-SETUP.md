# 💬 Chat System Setup Guide

## Overview
Real-time chat system for Hunny Collection PK where users can chat with admin, and messages automatically disappear after 24 hours.

## Features
✅ Real-time messaging between users and admin  
✅ Auto-delete messages after 24 hours  
✅ Floating chat widget on all pages  
✅ Full chat page for detailed conversations  
✅ Admin chat panel to manage all conversations  
✅ Mobile responsive design  
✅ Firebase security rules  

## Files Created

### User-Facing Files
1. **chat.html** - Full chat page for users
2. **chat.js** - Chat system JavaScript (Firebase integration)
3. **chat-widget.css** - Floating chat widget styles
4. **chat-widget.js** - Floating chat widget functionality

### Admin Files
5. **admin-chat.html** - Admin chat management panel

### Cloud Functions
6. **functions/deleteExpiredMessages.js** - Auto-delete expired messages

## Setup Instructions

### Step 1: Deploy Firestore Security Rules

The security rules have been updated to support the chat system. Deploy them:

```bash
firebase deploy --only firestore:rules
```

### Step 2: Setup Cloud Functions (IMPORTANT - For Auto-Delete)

The cloud function automatically deletes messages older than 24 hours.

#### 2.1 Initialize Firebase Functions (if not already done)

```bash
cd functions
npm init -y
npm install firebase-admin firebase-functions
cd ..
```

#### 2.2 Add the Function to index.js

Create or update `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const deleteExpiredMessages = require('./deleteExpiredMessages');

exports.deleteExpiredMessages = deleteExpiredMessages.deleteExpiredMessages;
```

#### 2.3 Deploy the Cloud Function

```bash
firebase deploy --only functions:deleteExpiredMessages
```

**Note:** This function requires the **Blaze plan** (pay-as-you-go) for Firebase.

### Step 3: Test the Chat System

#### User Side:
1. Login to the website
2. Click the 💬 Chat button in navigation
3. Or use the floating chat widget (bottom-right corner)
4. Send a message
5. Messages will show a 24-hour expiry time

#### Admin Side:
1. Login as admin
2. Go to Admin Dashboard
3. Click "User Chats" in Quick Actions
4. Or directly visit: `admin-chat.html`
5. Select a user conversation
6. Reply to messages

### Step 4: Verify Auto-Delete

Messages have two layers of auto-deletion:

1. **Client-side:** Messages older than 24 hours are hidden from view
2. **Server-side:** Cloud function runs every hour and permanently deletes expired messages

## Firestore Collections Structure

### `chats` Collection
```
chats/{userId}
  - userId: string (user's UID)
  - userName: string
  - userEmail: string
  - createdAt: timestamp
  - lastMessageAt: timestamp
  - lastMessage: string (preview)
  - lastMessageSender: string ('user' or 'admin')
  - isActive: boolean
```

### `messages` Collection
```
messages/{messageId}
  - chatId: string (user's UID)
  - senderId: string
  - senderName: string
  - senderType: string ('user' or 'admin')
  - message: string
  - timestamp: timestamp
  - expiresAt: string (ISO date - 24 hours from creation)
  - isRead: boolean
```

## Navigation Updates

The chat link has been added to:
- ✅ index.html
- ✅ shop.html
- ✅ account.html
- ✅ admin.html (as "User Chats" in Quick Actions)

## Widget Integration

The floating chat widget appears on:
- ✅ index.html
- ✅ shop.html
- ✅ product.html
- ✅ account.html
- ✅ orders.html

## Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Ensure user is logged in
- Verify `chat-widget.css` and `chat-widget.js` are loaded

### Messages Not Sending
- Check Firebase console for Firestore errors
- Verify Firestore rules are deployed
- Check network tab for failed requests

### Auto-Delete Not Working
- Verify cloud function is deployed: `firebase functions:list`
- Check function logs: `firebase functions:log`
- Ensure Firebase project is on Blaze plan

### Admin Can't See Chats
- Verify admin status in Firestore `admins` collection
- Check browser console for permission errors
- Ensure `admin-chat.html` loads correctly

## Testing Checklist

- [ ] User can send messages
- [ ] Admin can receive messages
- [ ] Admin can reply
- [ ] User receives admin replies
- [ ] Messages disappear after 24 hours
- [ ] Widget appears on all pages
- [ ] Chat page works on mobile
- [ ] Admin panel shows all conversations
- [ ] Real-time updates work
- [ ] Security rules prevent unauthorized access

## Future Enhancements

Optional improvements for later:
- Email notifications for new messages
- Typing indicators
- Message read receipts
- File/image sharing
- Chat history export
- Blocked users list
- Auto-reply bot

## Support

For issues or questions:
- Check Firebase console logs
- Review browser console errors
- Test with different user accounts
- Verify all files are uploaded to hosting

---

**Last Updated:** April 9, 2026  
**Version:** 1.0
