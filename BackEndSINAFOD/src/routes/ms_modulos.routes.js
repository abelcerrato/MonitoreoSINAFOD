import {Router} from "express"; // Importar el enrutador de express
import { getModuloIdC, getModulosC, postModuloC, putModuloC } from "../controllers/ms_modulos.controller.js"; // Importar los controladores para los módulos

const router=Router(); //Crear una instancia del router de express

router.get('/modulos', getModulosC) // Obtener todos los registros de módulos
router.get('/modulo/:id', getModuloIdC ) // Obtener un registro de módulo por ID
router.post('/modulo', postModuloC) // Crear un nuevo registro de módulo
router.put('/modulo/:id', putModuloC) // Actualizar un registro de módulo por ID


export default router; // Exportar el enrutador
