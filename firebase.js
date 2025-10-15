import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuIY7OUjLBcr_eJ8FMgdKINsBdF0n48jI",
  authDomain: "constitutionapp-cf259.firebaseapp.com",
  projectId: "constitutionapp-cf259",
  storageBucket: "constitutionapp-cf259.appspot.com",
  messagingSenderId: "44389337259",
  appId: "1:44389337259:web:3d9ee689b04e4e7da24fee"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { auth, db };
