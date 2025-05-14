
import {Router} from "express";
import { getFormacionC, getIdFormacionC, postFormacionC, postLineamientosFormacionC, putFormacionC, putLineamientosFormacionC, uploadLineamientosFormacion } from "../controllers/formacion.controller.js";
const router=Router();


//---------------------------------------------------------
//                       FORMACION
//---------------------------------------------------------
router.get('/formacion', getFormacionC)
router.get('/investformacionC/:id', getIdFormacionC)
router.post('/formacion', postFormacionC)
router.put('/formacion/:id', putFormacionC)

router.put('/lineamientosformacion/:id', uploadLineamientosFormacion, putLineamientosFormacionC);

router.post('/lineamientosformacion', uploadLineamientosFormacion, postLineamientosFormacionC);




export default router;



