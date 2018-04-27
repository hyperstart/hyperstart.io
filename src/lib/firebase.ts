import firebase from "firebase"

// FIREBASE_CONFIG: JSON.stringify({
//   apiKey: "AIzaSyB4OdCZTEEw319HtZFDnRxkK_uh5dOQRlY",
//   authDomain: "hyperstart-development.firebaseapp.com",
//   databaseURL: "https://hyperstart-development.firebaseio.com",
//   projectId: "hyperstart-development",
//   storageBucket: "hyperstart-development.appspot.com"
// }),

// set in config/<dev|prod>.js

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
}

declare const FIREBASE_CONFIG: FirebaseConfig

export function initializeFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG)
}

export function getFunctionUrl(fn: string): string {
  return `https://${FIREBASE_CONFIG.authDomain}/${fn}`
}
