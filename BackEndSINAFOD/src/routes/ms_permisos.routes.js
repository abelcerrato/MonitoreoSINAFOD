import {Router} from "express";
import {getPermisosC, getPermisosIdRolC, postRolyPermisosC, putPerfilPermisosC } from "../controllers/ms_permisos.controller.js";

const router=Router();

router.get('/permisos', getPermisosC)
router.get('/permisos/:id', getPermisosIdRolC)
router.post('/permisos', postRolyPermisosC)
router.put('/permisos', putPerfilPermisosC)

export default router;
