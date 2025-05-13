import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/ms_usuarios.routes.js'
import Investigacion from "./routes/investigacion.routes.js";
import Formacion from "./routes/formacion.routes.js";
import Departamentos from "./routes/departamentos.routes.js";
import Municipios from "./routes/municipos.routes.js"
import CapacitacionP from "./routes/CapParticipante.routes.js";
import Academico from "./routes/Academico.routes.js";
import Aldeas from "./routes/aldeas.routes.js";
import DocentesDGDP from "./routes/docentesDGDP.routes.js";
import uploadRoutes from "./routes/uploads.routes.js";

import ms_rolesRoutes from "./routes/ms_roles.routes.js";
import ms_modulosRoutes from "./routes/ms_modulos.routes.js"
import ms_objetosRoutes from "./routes/ms_objetos.routes.js";
import ms_permisosRoutes from "./routes/ms_permisos.routes.js"

import cors from "cors"

import 'dotenv/config'; 


const app = express()
app.use(cors());



app.use(express.json())
app.use(userRoutes)
app.use(Investigacion)
app.use(Formacion)
app.use(Departamentos)
app.use(Municipios)
app.use(CapacitacionP)
app.use(Academico)
app.use(Aldeas)
app.use(DocentesDGDP)
app.use(uploadRoutes)


app.use(ms_rolesRoutes)
app.use(ms_modulosRoutes)
app.use(ms_objetosRoutes)
app.use(ms_permisosRoutes)

console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

