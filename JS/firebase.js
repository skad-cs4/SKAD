// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
getAuth,
signInWithEmailAndPassword,
sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvhtHu1dL7vrEejC_Bx-KEZuw9FZMPSOs",
  authDomain: "skad-4.firebaseapp.com",
  projectId: "skad-4",
  storageBucket: "skad-4.firebasestorage.app",
  messagingSenderId: "522592919003",
  appId: "1:522592919003:web:447fda7f3f42effd615bfe"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);


// Export services + functions
export {
auth,
db,
signInWithEmailAndPassword,
sendPasswordResetEmail
};