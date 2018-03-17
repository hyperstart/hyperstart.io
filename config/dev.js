// each property in the exported object is a constant of the same name/value in the source

// don't forget to JSON.stringify() the values of each property.

module.exports = {
  FIREBASE_CONFIG: JSON.stringify({
    apiKey: "AIzaSyB4OdCZTEEw319HtZFDnRxkK_uh5dOQRlY",
    authDomain: "hyperstart-development.firebaseapp.com",
    databaseURL: "https://hyperstart-development.firebaseio.com",
    projectId: "hyperstart-development",
    storageBucket: "hyperstart-development.appspot.com"
  })
}
