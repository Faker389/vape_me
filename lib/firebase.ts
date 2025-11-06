// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { Timestamp } from "firebase/firestore" // client SDK
import { getFirestore } from "firebase/firestore"
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import type { Firestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export interface transactions {
  id: string
  description: string
  imageUrl: string
  points: number
  rewardId: string
  timestamp: Timestamp
  type: "earn" | "redeem"
}
export interface coupon {
  id: string
  name: string
  description: string
  imageUrl: string
  pointsCost: number
  category: string
  isDiscount: boolean
  discountamount?: number
  expiryDate: Timestamp
  minimalPrice?: number
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp
let auth: Auth
let provider: GoogleAuthProvider
let db: Firestore
let storage: FirebaseStorage

if (typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  provider = new GoogleAuthProvider()
  db = getFirestore(app)
  storage = getStorage(app)
}

// @ts-expect-error - These will be initialized on client side
export { app, auth, provider, db, storage }
export const currentDate = Timestamp.fromDate(new Date())

// src/lib/productsService.ts
export interface Product {
  id: number
  name: string
  price: number
  image: string
}
