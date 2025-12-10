import {Router} from "express"; // Importar el enrutador de express
import { getAldeasIdC } from "../controllers/aldeas.controller.js"; // Importar el controlador para las aldeas
const router=Router(); //Crear una instancia del router de express


//---------------------------------------------------------
//                  ALDEAS
//---------------------------------------------------------

router.get('/aldeas/:id', getAldeasIdC) //Ruta para obtener las aldeas por el id del centro de formación


export default router; // Exportar el enrutador
