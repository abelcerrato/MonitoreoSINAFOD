import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/users.routes.js'
import InvestCap from "./routes/investigacionCap.routes.js";
import Departamentos from "./routes/departamentos.routes.js";
import Municipios from "./routes/municipos.routes.js"
import CapacitacionP from "./routes/CapParticipante.routes.js";
import Academico from "./routes/Academico.routes.js";
import Aldeas from "./routes/aldeas.routes.js";
import DocentesDGDP from "./routes/docentesDGDP.routes.js";
import cors from "cors"
import multer from "multer"; 
import fs from "fs";
import path from "path";

import 'dotenv/config'; 


const app = express()
app.use(cors());
// Asegura que la carpeta 'uploads' exista
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Crea la carpeta si no existe
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Usa la ruta absoluta
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



// Ruta específica para subir el documento
app.post("/api/upload-documento", upload.single("documento"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }
  
  res.json({
    success: true,
    path: req.file.path,  // Ejemplo: "uploads/1712345678900-mi-archivo.pdf"
    filename: req.file.originalname,
  });
});


app.use(express.json())
app.use(userRoutes)
app.use(InvestCap)
app.use(Departamentos)
app.use(Municipios)
app.use(CapacitacionP)
app.use(Academico)
app.use(Aldeas)
app.use(DocentesDGDP)

console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

