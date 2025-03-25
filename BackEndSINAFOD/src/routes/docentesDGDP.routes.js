import {Router} from "express";
import { getDocentesC, getDocentesIdC, getFiltroDocenteC, postDocentesC, putDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router();


router.get('/docentesDGDP', getDocentesC )
router.get('/docentesDGDP/:identificacion', getDocentesIdC)
router.post('/docentesDGDP', postDocentesC)
router.put('/docentesDGDP/:id', putDocentesC)


//para buscar por el filtro
router.get('/filtroDocentes/:filtro', getFiltroDocenteC)







export default router;
