import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import appletConfig from './firebase-applet-config.json';

const getRawEnv = (key: string): string => (import.meta.env[key] as string) || '';

// Safely resolve fields even if env variables were shifted during pasting
const rawProjectId = getRawEnv('VITE_FIREBASE_PROJECT_ID');
const rawAuthDomain = getRawEnv('VITE_FIREBASE_AUTH_DOMAIN');
const rawStorageBucket = getRawEnv('VITE_FIREBASE_STORAGE_BUCKET');
const rawSenderId = getRawEnv('VITE_FIREBASE_MESSAGING_SENDER_ID');
const rawAppId = getRawEnv('VITE_FIREBASE_APP_ID');

const projectId = (rawProjectId && !/^\d+$/.test(rawProjectId))
  ? rawProjectId
  : (rawAuthDomain && !rawAuthDomain.includes('.') ? rawAuthDomain : appletConfig.projectId);

const authDomain = (rawAuthDomain && rawAuthDomain.includes('.'))
  ? rawAuthDomain
  : (rawAppId && rawAppId.includes('firebaseapp.com') ? rawAppId : `${projectId}.firebaseapp.com`);

const storageBucket = (rawStorageBucket && rawStorageBucket.includes('firebasestorage.app'))
  ? rawStorageBucket
  : (rawSenderId && rawSenderId.includes('firebasestorage.app') ? rawSenderId : `${projectId}.firebasestorage.app`);

const messagingSenderId = (rawSenderId && /^\d+$/.test(rawSenderId))
  ? rawSenderId
  : (rawProjectId && /^\d+$/.test(rawProjectId) ? rawProjectId : appletConfig.messagingSenderId);

const appId = (rawAppId && rawAppId.startsWith('1:'))
  ? rawAppId
  : (rawStorageBucket && rawStorageBucket.startsWith('1:') ? rawStorageBucket : appletConfig.appId);

export const firebaseConfig = {
  apiKey: getRawEnv('VITE_FIREBASE_API_KEY') || appletConfig.apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId: getRawEnv('VITE_FIREBASE_MEASUREMENT_ID') || appletConfig.measurementId || ''
};

const isConfigValid = !!firebaseConfig.apiKey;

export const app = isConfigValid 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) 
  : null;

// Connect strictly to default Firestore database via getFirestore(app)
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export const loginWithEmail = (email: string, password: string) => {
  if (!auth) {
    console.error("Firebase not configured");
    return Promise.reject(new Error("Firebase not configured"));
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}
