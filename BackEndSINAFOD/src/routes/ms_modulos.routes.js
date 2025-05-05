import {Router} from "express";
import { getModuloIdC, getModulosC, postModuloC, putModuloC } from "../controllers/ms_modulos.controller.js";


const router=Router();
router.get('/modulos', getModulosC)
router.get('/modulo/:id', getModuloIdC )
router.post('/modulo', postModuloC)
router.put('/modulo/:id', putModuloC)


export default router;
