import {Router} from "express";
import {pool} from '../db.js'
import { verificarToken,  getUserC, getUserIdC, loginC, logoutC, postUserC, resetContraseñaUserC, updateContraseñaC, updateUserC, verificarUsuarioC} from "../controllers/ms_usuarios.controllers.js";

const router=Router();

router.get('/usuarios', getUserC)

router.get('/usuario/:id', getUserIdC)

router.post('/verificarUsuario', verificarUsuarioC)

router.post('/insertarUsuarios', postUserC)

router.put('/actualizarUsuarios/:id', updateUserC)

router.put('/resetearContra/:usuario', resetContraseñaUserC) //resetea la contraseña y asigna Temporal1*

router.post('/inicioSesion', loginC)//hace login y verifica si la contraseña es temporal

router.get("/verify-token", verificarToken); //verifica si el token es valido y si el usuario tiene sesion activa


router.put('/actualizarContra/:usuario', updateContraseñaC)//actualiza la contraseña en caso que sea temporal o nuevo usuario

router.put('/cierreSesion/:id', logoutC)//cambie el estado se sesionactiva a false





export default router;