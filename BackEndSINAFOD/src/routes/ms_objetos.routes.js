import {Router} from "express"; // Importar el enrutador de express
import { getObjetoIdC, getObjetosC, postObjetosC, putObjetosC } from "../controllers/ms_objetos.controller.js"; // Importar los controladores para los objetos

const router=Router(); //Crear una instancia del router de express

router.get('/objetos', getObjetosC) // Obtener todos los registros de objetos
router.get('/objetos/:id', getObjetoIdC) // Obtener un registro de objeto por ID
router.post('/objetos', postObjetosC) // Crear un nuevo registro de objeto
router.put('/objetos/:id', putObjetosC) // Actualizar un registro de objeto por ID

export default router; // Exportar el enrutador
