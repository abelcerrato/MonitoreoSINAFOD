import pg from 'pg' // Importa el módulo pg para interactuar con PostgreSQL
import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } from "./config.js"; // Importa las variables de configuración de la base de datos

// Crear una nueva instancia del pool de conexiones a la base de datos PostgreSQL
export const pool = new pg.Pool({
    user: DB_USER, // Usuario de la base de datos
    host: DB_HOST, // Host de la base de datos
    password: DB_PASSWORD, // Contraseña de la base de datos
    database: DB_DATABASE, // Nombre de la base de datos
    port: DB_PORT, // Puerto de la base de datos
   ssl: { rejectUnauthorized: false}, // Configuración SSL para conexiones seguras
})

