import {Router} from "express"; // Importar el enrutador de express
// Importar los controladores para los docentes DGDP
import { getDocentesC, getDocentesIdC, getFiltroDocenteC, getFiltroDocentesC, postDocentesC, putDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router(); //Crear una instancia del router de express


router.get('/docentesDGDP', getDocentesC ) //Ruta para obtener todos los docentes DGDP
router.get('/docentesDGDP/:identificacion', getDocentesIdC) //Ruta para obtener un docente DGDP por su identificacion
router.post('/docentesDGDP', postDocentesC) //Ruta para crear un nuevo docente DGDP
router.put('/docentesDGDP/:id', putDocentesC) //Ruta para actualizar un docente DGDP por su id

router.get('/filtroDocentes/:filtro', getFiltroDocenteC) //Para buscar docentes por el filtro
router.get('/SACEID/:filtro', getFiltroDocentesC) //Para buscar por el filtro de docente para ir a insertar


export default router; // Exportar el enrutador
