import {Router} from "express"; // Importar el enrutador de express
import {getRolesC, getRolIdC, postRolesC, putRolesC } from "../controllers/ms_roles.controller.js"; // Importar los controladores para los roles

const router=Router(); //Crear una instancia del router de express

router.get('/roles', getRolesC) // Obtener todos los registros de roles
router.get('/roles/:id', getRolIdC) // Obtener un registro de rol por ID
router.post('/roles', postRolesC) // Crear un nuevo registro de rol
router.put('/roles/:id', putRolesC) // Actualizar un registro de rol por ID

export default router; // Exportar el enrutador
