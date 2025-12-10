import express from "express"; // Importar express para crear el servidor
import {PORT} from './config.js' // Importar el puerto desde la configuración

// Importar las rutas
import userRoutes from './routes/ms_usuarios.routes.js'
import Investigacion from "./routes/investigacion.routes.js";
import Formacion from "./routes/formacion.routes.js";
import Departamentos from "./routes/departamentos.routes.js";
import Municipios from "./routes/municipos.routes.js"
import Participante from "./routes/Participante.routes.js";
import CentroEducativo from "./routes/centroeducativo.routes.js"
import Academico from "./routes/Academico.routes.js";
import Aldeas from "./routes/aldeas.routes.js";
import DocentesDGDP from "./routes/docentesDGDP.routes.js";
import uploadRoutes from "./routes/uploads.routes.js";

import ms_rolesRoutes from "./routes/ms_roles.routes.js";
import ms_modulosRoutes from "./routes/ms_modulos.routes.js"
import ms_objetosRoutes from "./routes/ms_objetos.routes.js";
import ms_permisosRoutes from "./routes/ms_permisos.routes.js"

import CargoDesempeña from "./routes/cargodesempeña.routes.js"


import cors from "cors" // Importar cors para manejar solicitudes entre dominios

import 'dotenv/config'; // Cargar las variables de entorno


const app = express() // Crear una instancia de la aplicación express
app.use(cors()); // Habilitar CORS para todas las rutas


// Middleware para parsear JSON
app.use(express.json())

// Usar las rutas importadas
app.use(userRoutes)
app.use(Investigacion)
app.use(Formacion)
app.use(Departamentos)
app.use(Municipios)
app.use(Participante)
app.use(CentroEducativo)
app.use(Academico)
app.use(Aldeas)
app.use(DocentesDGDP)
app.use(uploadRoutes)

app.use(ms_rolesRoutes)
app.use(ms_modulosRoutes)
app.use(ms_objetosRoutes)
app.use(ms_permisosRoutes)

app.use(CargoDesempeña)

console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`); // Mensaje de confirmación al iniciar el servidor
});

