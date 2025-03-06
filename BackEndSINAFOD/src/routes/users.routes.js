import {Router} from "express";
import {pool} from '../db.js'
import {  deleteUserC, getUserC, getUserIdC, posUserC, updateUserC, verificarUsuarioC} from "../controllers/users.controllers.js";
const router=Router();


//---------------------------------------------------------
//                  USUARIOS
//---------------------------------------------------------
router.get('/users', getUserC)

router.get('/users/:id', getUserIdC)

router.post('/verificarUsuario', verificarUsuarioC)

router.post('/users', posUserC)

router.delete('/users/:id', deleteUserC)

router.put('/users/:id', updateUserC)





export default router;
