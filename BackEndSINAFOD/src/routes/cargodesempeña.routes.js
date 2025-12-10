import {Router} from "express"; // Importar el enrutador de express
import { getCargoDesempeñaC, getCargoDesempeñaIdC, postCargoDesempeñaC, putCargoDesempeñaC } from "../controllers/cargodesempeña.controller.js"; // Importar los controladores para los cargos que desempeña

const router=Router(); //Crear una instancia del router de express


router.get('/cargodes', getCargoDesempeñaC) //Ruta para obtener todos los cargos que desempeña
router.get('/cargodes/:id', getCargoDesempeñaIdC) //Ruta para obtener un cargo que desempeña por su id
router.post('/cargodes', postCargoDesempeñaC ) //Ruta para crear un nuevo cargo que desempeña
router.put('/cargodes/:id', putCargoDesempeñaC) //Ruta para actualizar un cargo que desempeña por su id


export default router; // Exportar el enrutador
