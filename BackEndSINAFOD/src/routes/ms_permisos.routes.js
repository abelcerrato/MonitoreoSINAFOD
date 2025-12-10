import {Router} from "express"; // Importar el enrutador de express
import {getPermisosC, getPermisosIdRolC, postRolyPermisosC, putRolyPermisosC } from "../controllers/ms_permisos.controller.js"; // Importar los controladores para los permisos

const router=Router(); //Crear una instancia del router de express

router.get('/permisos', getPermisosC) // Obtener todos los registros de permisos
router.get('/permisos/:id', getPermisosIdRolC) // Obtener un registro de permisos por ID de rol
router.post('/permisos', postRolyPermisosC) // Crear un nuevo registro de rol y permisos
router.put('/permisos', putRolyPermisosC) // Actualizar un registro de rol y permisos

export default router; // Exportar el enrutador
