import firebase from "firebase"

// set in config/<dev|prod>.js

declare const FIREBASE_CONFIG

export function initializeFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG)
}
