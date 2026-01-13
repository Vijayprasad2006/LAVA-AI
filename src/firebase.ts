// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRlzA4M_omFoEtKG7qES5mfiTEr-38P-M",
  authDomain: "studio-1108785481-2d445.firebaseapp.com",
  projectId: "studio-1108785481-2d445",
  storageBucket: "studio-1108785481-2d445.firebasestorage.app",
  messagingSenderId: "647324400026",
  appId: "1:647324400026:web:d4dde3b7da80617469a223"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: initialize commonly used services and export them
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Providers and helpers for social sign-in
import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
export const githubProvider = new GithubAuthProvider()

export async function signInWithProvider(provider: any) {
  // Add common scopes for GitHub to obtain user/email info
  try {
    if (provider && provider.providerId === 'github.com') {
      provider.addScope && provider.addScope('read:user')
      provider.addScope && provider.addScope('user:email')
    }
  } catch (err) {
    // ignore
  }

  const result = await signInWithPopup(auth, provider)
  const user = result.user
  if (!user) return null

  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      provider: provider.providerId || null,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    })
  } else {
    await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true })
  }

  return user
}

export { app, auth, db, storage };
export default app;
