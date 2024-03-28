var admin = require("firebase-admin");

var serviceAccount = require("../secrets/daksha-yanthra-firebase-adminsdk-igh8y-8bc665f710.json");

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = firebaseAdmin;
