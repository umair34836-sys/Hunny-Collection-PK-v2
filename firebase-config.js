// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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

// Enable Firestore offline persistence (local cache)
// This lets the app work on slow/no internet by serving cached data
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open — persistence works best in one tab at a time
        console.log('Firestore persistence: Multiple tabs detected, using single-tab mode');
    } else if (err.code === 'unimplemented') {
        // Browser doesn't support IndexedDB
        console.log('Firestore persistence: Browser does not support offline mode');
    }
});