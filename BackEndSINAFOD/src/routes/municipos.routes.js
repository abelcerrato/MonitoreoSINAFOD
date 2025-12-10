import {Router} from "express"; // Importar el enrutador de express
import { getMunicipiosC, getMunicipiosIdC } from "../controllers/municipos.controller.js"; // Importar los controladores para los municipios
const router=Router(); //Crear una instancia del router de express


//---------------------------------------------------------
//                  MUNICIPIOS
//---------------------------------------------------------
router.get('/municipios/:id', getMunicipiosIdC) // Obtener los municipios por el id del departamento
router.get('/municipios', getMunicipiosC) // Obtener todos los municipios

export default router; // Exportar el enrutador
