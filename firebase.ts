import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = !!firebaseConfig.apiKey;

export const app = isConfigValid ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export const loginWithEmail = (email: string, password: string) => {
  if (!auth) {
    alert("請先在環境變數中設定 Firebase API 金鑰");
    return Promise.reject("Firebase not configured");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};
