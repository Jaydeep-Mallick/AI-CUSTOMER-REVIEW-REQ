const admin = require('firebase-admin');

// Ensure FIREBASE_PRIVATE_KEY exists and handle newlines
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

let db;

try {
  // Only initialize if we have the minimum required config
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      })
    });
    db = admin.firestore();
    console.log('Firebase Admin initialized successfully');
  } else {
    console.warn('Firebase Admin config incomplete. Using mock DB for development.');
    db = null; // We'll handle this in the service layer for graceful degradation
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  db = null;
}

module.exports = { admin, db };
