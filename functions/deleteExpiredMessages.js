// Firebase Cloud Function to delete expired chat messages
// This function runs every hour and deletes messages older than 24 hours

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Run every hour (0 * * * *)
exports.deleteExpiredMessages = functions.pubsub
    .schedule('0 * * * *')
    .timeZone('Asia/Karachi') // Pakistan timezone
    .onRun(async (context) => {
        try {
            const now = new Date();
            const messagesRef = db.collection('messages');
            
            // Get all messages
            const snapshot = await messagesRef.get();
            
            if (snapshot.empty) {
                console.log('No messages to delete');
                return null;
            }
            
            let deletedCount = 0;
            const batch = db.batch();
            
            snapshot.forEach((doc) => {
                const messageData = doc.data();
                const expiresAt = new Date(messageData.expiresAt);
                
                // Check if message has expired
                if (now >= expiresAt) {
                    batch.delete(doc.ref);
                    deletedCount++;
                }
            });
            
            if (deletedCount > 0) {
                await batch.commit();
                console.log(`Deleted ${deletedCount} expired messages`);
            } else {
                console.log('No expired messages found');
            }
            
            return null;
        } catch (error) {
            console.error('Error deleting expired messages:', error);
            return null;
        }
    });
