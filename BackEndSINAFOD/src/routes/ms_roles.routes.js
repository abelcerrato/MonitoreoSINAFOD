import {Router} from "express";
import {getRolesC, getRolIdC, postRolesC, putRolesC } from "../controllers/ms_roles.controller.js";

const router=Router();
router.get('/roles', getRolesC)
router.get('/roles/:id', getRolIdC)
router.post('/roles', postRolesC)
router.put('/roles/:id', putRolesC)

export default router;
