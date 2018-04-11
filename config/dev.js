// each property in the exported object is a constant of the same name/value in the source

// don't forget to JSON.stringify() the values of each property.
module.exports = {
  FIREBASE_CONFIG: JSON.stringify({
    apiKey: "AIzaSyB4OdCZTEEw319HtZFDnRxkK_uh5dOQRlY",
    authDomain: "hyperstart-development.firebaseapp.com",
    databaseURL: "https://hyperstart-development.firebaseio.com",
    projectId: "hyperstart-development",
    storageBucket: "hyperstart-development.appspot.com"
  }),
  STORE_CONFIG: JSON.stringify({
    type: "firestore"
  }),
  // the ID of the hyperapp project
  HYPERAPP_ID: JSON.stringify("R2gEktncHKhVcHcqtY23RdJONPo1-vF63AhjbT0C8"),
  // the current environment
  ENVIRONMENT: JSON.stringify("dev")
}
