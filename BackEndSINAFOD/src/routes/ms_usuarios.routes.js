import {Router} from "express"; // Importar el enrutador de express

// Importar los controladores para los usuarios
import { verificarToken,  getUserC, getUserIdC, loginC, logoutC, postUserC, resetContraseñaUserC, updateContraseñaC, updateUserC, verificarUsuarioC} from "../controllers/ms_usuarios.controllers.js";

const router=Router(); //Crear una instancia del router de express

router.get('/usuarios', getUserC) // Obtener todos los registros de usuarios
router.get('/usuario/:id', getUserIdC) // Obtener un registro de usuario por ID
router.post('/verificarUsuario', verificarUsuarioC) //verifica si el usuario existe

router.post('/insertarUsuarios', postUserC) // Crear un nuevo registro de usuario
router.put('/actualizarUsuarios/:id', updateUserC) // Actualizar un registro de usuario por ID

router.put('/resetearContra/:usuario', resetContraseñaUserC) //Resetea la contraseña y asigna la identidad como contraseña temporal
router.put('/actualizarContra/:usuario', updateContraseñaC)//Actualiza la contraseña en caso que sea temporal o nuevo usuario

router.post('/inicioSesion', loginC) //Hace login y verifica si la contraseña es temporal
router.put('/cierreSesion/:id', logoutC)//Cambia el estado de sesionactiva a false

router.get("/verify-token", verificarToken); //verifica si el token es valido y si el usuario tiene sesion activa


export default router; // Exportar el enrutador