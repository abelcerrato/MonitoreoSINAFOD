import {Router} from "express";
import { getCargoDesempeñaC, getCargoDesempeñaIdC, postCargoDesempeñaC, putCargoDesempeñaC } from "../controllers/cargodesempeña.controller.js";

const router=Router();


router.get('/cargodes', getCargoDesempeñaC)
router.get('/cargodes/:id', getCargoDesempeñaIdC)
router.post('/cargodes', postCargoDesempeñaC )
router.put('/cargodes/:id', putCargoDesempeñaC)




export default router;
