import 'dotenv/config';  // Carga las variables de entorno

export const DB_USER= process.env.DB_USER // Usuario de la base de datos
export const DB_HOST= process.env.DB_HOST // Host de la base de datos
export const DB_PASSWORD= process.env.DB_PASSWORD // Contraseña de la base de datos
export const DB_DATABASE=process.env.DB_DATABASE // Nombre de la base de datos
export const DB_PORT=process.env.DB_PORT // Puerto de la base de datos

export const PORT= process.env.PORT || 3000; // Puerto del servidor o asigna el puerto 3000 si no está definido en las variables de entorno



