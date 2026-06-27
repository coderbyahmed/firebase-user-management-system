import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAx2KvnfQ9W9l4IwXAUKGxYhPywRihBXGA",
  authDomain: "user-management-system-f1219.firebaseapp.com",
  projectId: "user-management-system-f1219",
  storageBucket: "user-management-system-f1219.firebasestorage.app",
  messagingSenderId: "802044384979",
  appId: "1:802044384979:web:ddcfa5b4d333b2ec436626",
  measurementId: "G-MCDCVBHNM9"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
