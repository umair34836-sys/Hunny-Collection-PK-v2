// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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

// Retry utility for Firebase operations with exponential backoff
export async function retryOperation(operation, maxRetries = 3, delayMs = 2000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Firebase attempt ${attempt}/${maxRetries}...`);
      const result = await operation();
      if (attempt > 1) {
        console.log(`✅ Success on attempt ${attempt}`);
      }
      return result;
    } catch (error) {
      lastError = error;
      const isOffline = error.code === 'unavailable' || error.message?.includes('offline');
      
      if (isOffline) {
        console.warn(`❌ No internet connection (Attempt ${attempt}/${maxRetries})`);
      } else {
        console.warn(`❌ Attempt ${attempt} failed:`, error.code || error.message);
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  const isOffline = lastError?.code === 'unavailable' || lastError?.message?.includes('offline');
  if (isOffline) {
    console.error('❌ No internet connection. Please check your network.');
  } else {
    console.error(`❌ All ${maxRetries} attempts failed. Last error:`, lastError.message);
  }
  throw lastError;
}