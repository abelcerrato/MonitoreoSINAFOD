// backend/src/config/firebase.config.js
import admin from 'firebase-admin';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

let serviceAccount;
let initializationError = null;

try {
  if (process.env.FIREBASE_CONFIG) {
    // For production (Vercel): use environment variable
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
    } catch (error) {
      throw new Error('Failed to parse FIREBASE_CONFIG environment variable. Make sure it contains valid JSON.');
    }
  } else {
    // For local development: use JSON file
    const __dirname = dirname(fileURLToPath(import.meta.url));
    serviceAccount = JSON.parse(
      readFileSync(join(__dirname, './firebase-credenciales-local.json'))
    );
  }

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  initializationError = error;
}

// Export services with error handling
export const bucket = initializationError ? null : admin.storage().bucket();
export default admin;