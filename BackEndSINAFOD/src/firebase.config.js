// backend/src/config/firebase.config.js
import admin from 'firebase-admin';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Configuración para obtener la ruta correcta del archivo JSON
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, './monitoreosinafod-firebase-adminsdk-fbsvc-b4a84097bf.json'))
);

// Inicialización de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "monitoreosinafod.firebasestorage.app" // Reemplaza con tu bucket
});

// Exporta los servicios necesarios
export const bucket = admin.storage().bucket();
export default admin;