import { Router } from "express"; // Importar el enrutador de express
import {
  getIdInvestigacionC,
  getInvestigacionC,
  postInvestigacionC,
  postLineamientosInvestigacionC,
  putInvestigacionC,
  putLineamientosInvestigacionC,
  uploadLineamientosInvestigacion,
} from "../controllers/investigacion.controller.js"; // Importar los controladores para la investigación
const router = Router(); // Crear una instancia del enrutador

//---------------------------------------------------------
//                    INVESTIGACION
//---------------------------------------------------------
router.get("/investigacion", getInvestigacionC); // Obtener todos los registros de investigación
router.get("/investigacion/:id", getIdInvestigacionC); // Obtener un registro de investigación por ID
router.post("/investigacion", postInvestigacionC); // Crear un nuevo registro de investigación
router.put("/investigacion/:id", putInvestigacionC); // Actualizar un registro de investigación por ID

//---------------------------------------------------------
//             LINEAMIENTOS INVESTIGACION
//---------------------------------------------------------
router.put("/lineamientosinvestigacion/:id", uploadLineamientosInvestigacion, putLineamientosInvestigacionC ); // Actualizar lineamientos de investigación por ID
router.post("/lineamientosinvestigacion", uploadLineamientosInvestigacion, postLineamientosInvestigacionC ); // Crear nuevos lineamientos de investigación

export default router; // Exportar el enrutador
