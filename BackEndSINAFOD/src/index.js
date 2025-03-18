import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/users.routes.js'
import InvestCap from "./routes/investigacionCap.routes.js";
import Departamentos from "./routes/departamentos.routes.js";
import Municipios from "./routes/municipos.routes.js"
import CapacitacionP from "./routes/CapParticipante.routes.js";
import Academico from "./routes/Academico.routes.js";
import Aldeas from "./routes/aldeas.routes.js";
import cors from "cors"


import 'dotenv/config'; 


const app = express()

app.use(cors());
app.use(express.json())
app.use(userRoutes)
app.use(InvestCap)
app.use(Departamentos)
app.use(Municipios)
app.use(CapacitacionP)
app.use(Academico)
app.use(Aldeas)


console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

