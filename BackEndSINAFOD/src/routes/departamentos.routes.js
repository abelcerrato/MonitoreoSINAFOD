import {Router} from "express"; // Importar el enrutador de express
import { getDepartamentosC } from "../controllers/departamentos.controller.js"; // Importar el controlador para los departamentos
const router=Router(); //Crear una instancia del router de express


//---------------------------------------------------------
//                  DEPARTAMENTIOS
//---------------------------------------------------------
router.get('/departamentos', getDepartamentosC) //Ruta para obtener todos los departamentos


export default router;  // Exportar el enrutador
