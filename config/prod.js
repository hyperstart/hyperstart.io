// each property in the exported object is a constant of the same name/value in the source

// don't forget to JSON.stringify() the values of each property.

module.exports = {
  FIREBASE_CONFIG: JSON.stringify({
    apiKey: "AIzaSyDSg-zygDBZaG92eqO1NrQyJVZK7xVkiQM",
    authDomain: "hyperstart-production.firebaseapp.com",
    databaseURL: "https://hyperstart-production.firebaseio.com",
    projectId: "hyperstart-production",
    storageBucket: "hyperstart-production.appspot.com"
  }),
  STORE_CONFIG: JSON.stringify({
    type: "firestore"
  }),
  // the current environment
  ENVIRONMENT: JSON.stringify("prod")
}
