import {Router} from "express";
import { getObjetoIdC, getObjetosC, postObjetosC, putObjetosC } from "../controllers/ms_objetos.controller.js";


const router=Router();
router.get('/objetos', getObjetosC)
router.get('/objetos/:id', getObjetoIdC)
router.post('/objetos', postObjetosC)
router.put('/objetos/:id', putObjetosC)

export default router;
