// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../moh-mentalhealth-firebase-adminsdk-fbsvc-40fe124c6d.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
