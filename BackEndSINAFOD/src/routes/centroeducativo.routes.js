import { Router } from "express"; // Importar el enrutador de express
import {
  getCentroEducativoC,
  getCentroEducativoPartC,
  getIdCentroEducativoC,
  getIdCentroEducativoIdDeptoC,
  postCentroEducativoC,
  putCentroEducativoC,
} from "../controllers/centroeducativo.controller.js"; // Importar los controladores para los centros educativos
const router = Router(); //Crear una instancia del router de express

router.get("/centroeducativo", getCentroEducativoC); //Ruta para obtener todos los centros educativos
router.get("/centroeducativo/:id", getIdCentroEducativoC); //Ruta para obtener un centro educativo por su id
router.get("/centroeducativo/:identificacion", getCentroEducativoPartC); //Ruta para obtener un centro educativo por la identificacion del participante
router.post("/centroeducativo", postCentroEducativoC); //Ruta para crear un nuevo centro educativo
router.put("/centroeducativo/:id", putCentroEducativoC); //Ruta para actualizar un centro educativo por su id
router.get("/centroeducativoiddepto/:iddepto/:idmuni", getIdCentroEducativoIdDeptoC); //Ruta para obtener los centros educativos por el id del departamento y municipio

export default router; // Exportar el enrutador
