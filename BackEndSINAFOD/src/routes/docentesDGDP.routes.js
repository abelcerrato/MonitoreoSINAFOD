import {Router} from "express";
import { getDocentesC, getDocentesIdC, postDocentesC, putDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router();


router.get('/docentesDGDP', getDocentesC )
router.get('/docentesDGDP/:identificacion', getDocentesIdC)
router.post('/docentesDGDP', postDocentesC)
router.put('/docentesDGDP/:id', putDocentesC)




export default router;
