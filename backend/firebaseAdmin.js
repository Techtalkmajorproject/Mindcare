const { getApps, initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
require("dotenv").config();

let app;
if (!getApps().length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        app = initializeApp({
            credential: applicationDefault()
        });
    } else {
        console.warn("WARNING: GOOGLE_APPLICATION_CREDENTIALS not set. Firebase Admin may not initialize correctly.");
        try {
            app = initializeApp();
        } catch (error) {
            console.error("Firebase admin init failed (Expected if lacking creds locally):", error.message);
        }
    }
} else {
    app = getApps()[0];
}

let db = null;
let auth = null;

try {
    if (app) {
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (e) {
    console.error("Warning: Firestore/Auth could not initialize. Provide valid credentials.");
}

const admin = { firestore: { FieldValue, Timestamp } };
module.exports = { admin, db, auth };
