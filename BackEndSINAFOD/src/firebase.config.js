import admin from 'firebase-admin'; // Importa el SDK de Firebase Admin
import { join, dirname } from 'path'; // Importa funciones para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Importa función para convertir URL de archivo a ruta de archivo
import { readFileSync } from 'fs'; // Importa función para leer archivos del sistema de archivos

let serviceAccount; // Variable para almacenar las credenciales del servicio de Firebase
let initializationError = null; // Variable para almacenar cualquier error de inicialización

// Cargar las credenciales de Firebase según el entorno
try {
  if (process.env.FIREBASE_CONFIG) {
    //Para producción (Vercel): se usa una variable de entorno
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
    } catch (error) {
      throw new Error('Failed to parse FIREBASE_CONFIG environment variable. Make sure it contains valid JSON.');
    }
  } else {
    // Para desarrollo local: se usa un archivo JSON
    const __dirname = dirname(fileURLToPath(import.meta.url));
    serviceAccount = JSON.parse(
      readFileSync(join(__dirname, './monitoreosinafod-firebase-adminsdk-fbsvc-c2060cd83f.json'))
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

//Exporta el servicio de autenticación de Firebase, o null si hubo un error
export const bucket = initializationError ? null : admin.storage().bucket(); // Exporta el bucket de almacenamiento de Firebase
export default admin; // Exporta la instancia de Firebase Admin