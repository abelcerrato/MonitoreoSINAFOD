// Importar el enrutador de express
import {Router} from "express"; 

// Importar los controladores para la formación
import { getFormacionC, getIdFormacionC, postFormacionC, postLineamientosFormacionC, putFormacionC, putLineamientosFormacionC, uploadLineamientosFormacion } from "../controllers/formacion.controller.js";

// Crear una instancia del enrutador
const router=Router();


//---------------------------------------------------------
//                       FORMACION
//---------------------------------------------------------
router.get('/formacion', getFormacionC) // Obtener todos los registros de formación
router.get('/investformacionC/:id', getIdFormacionC) // Obtener un registro de formación por ID
router.post('/formacion', postFormacionC) // Crear un nuevo registro de formación
router.put('/formacion/:id', putFormacionC) // Actualizar un registro de formación por ID

//---------------------------------------------------------
//               LINEAMIENTOS FORMACION
//---------------------------------------------------------
router.put('/lineamientosformacion/:id', uploadLineamientosFormacion, putLineamientosFormacionC); // Actualizar lineamientos de formación por ID
router.post('/lineamientosformacion', uploadLineamientosFormacion, postLineamientosFormacionC); // Crear nuevos lineamientos de formación


export default router; // Exportar el enrutador



