// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyC97cTPCehqLLtbxzCzb8feQybsj3L1-8w",
    authDomain: "hunny-collection-pk.firebaseapp.com",
    projectId: "hunny-collection-pk",
    storageBucket: "hunny-collection-pk.firebasestorage.app",
    messagingSenderId: "834046819871",
    appId: "1:834046819871:web:2567fdc0d1931433cadf2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable Multi-Tab IndexedDB Persistence (supports multiple tabs)
enableMultiTabIndexedDbPersistence(db)
  .then(() => {
    console.log('✅ Firestore multi-tab persistence enabled');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open - using shared persistence');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Browser not supported, using memory cache');
    } else {
      console.error('❌ Persistence error:', err);
    }
  });

// Retry utility for Firebase operations
export async function retryOperation(operation, maxRetries = 3, delayMs = 2000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error(`❌ All ${maxRetries} attempts failed`);
  throw lastError;
}
