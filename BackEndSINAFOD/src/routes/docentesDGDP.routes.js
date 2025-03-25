import {Router} from "express";
import { getDocentesC, getDocentesIdC, getFiltroDocenteC, getFiltroDocentesC, postDocentesC, putDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router();


router.get('/docentesDGDP', getDocentesC )
router.get('/docentesDGDP/:identificacion', getDocentesIdC)
router.post('/docentesDGDP', postDocentesC)
router.put('/docentesDGDP/:id', putDocentesC)


//para buscar por el filtro
router.get('/filtroDocentes/:filtro', getFiltroDocenteC)

//para buscar por el filtro de docente para ir a insertar
router.get('/SACEID/:filtro', getFiltroDocentesC)





export default router;
