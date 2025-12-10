import {Router} from "express";
import {getPermisosC, getPermisosIdRolC, postRolyPermisosC, putRolyPermisosC } from "../controllers/ms_permisos.controller.js";

const router=Router();

router.get('/permisos', getPermisosC)
router.get('/permisos/:id', getPermisosIdRolC)
router.post('/permisos', postRolyPermisosC)
router.put('/permisos', putRolyPermisosC)

export default router;
