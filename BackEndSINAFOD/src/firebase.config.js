// backend/src/config/firebase.config.js
import admin from 'firebase-admin';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Configuración segura para entornos local y producción
let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  // Para producción (Vercel): usa la variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
}

// else {
//   // Para desarrollo local: usa el archivo JSON (pero NO lo subas a GitHub)
//   const __dirname = dirname(fileURLToPath(import.meta.url));
//   serviceAccount = JSON.parse(
//     readFileSync(join(__dirname, './firebase-credenciales-local.json'))
//   );
// }

// Inicialización de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Exporta los servicios necesarios
export const bucket = admin.storage().bucket();
export default admin;