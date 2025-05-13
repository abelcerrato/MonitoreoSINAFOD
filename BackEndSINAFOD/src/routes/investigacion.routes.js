
import {Router} from "express";
import { getIdInvestigacionC, getInvestigacionC, postInvestigacionC, postLineamientosInvestigacionC, putInvestigacionC, putLineamientosInvestigacionC, uploadLineamientosInvestigacion,  } from "../controllers/investigacion.controller.js";
import { postInvestigacionM } from "../models/investigacion.models.js";
const router=Router();


//---------------------------------------------------------
//                    INVESTIGACION 
//---------------------------------------------------------
router.get('/investigacion', getInvestigacionC)
router.get('/investigacion/:id', getIdInvestigacionC)
router.post('/investigacion', postInvestigacionC)
router.put('/investigacion/:id', putInvestigacionC)

router.put('/lineamientosinvestigacion/:id', uploadLineamientosInvestigacion, putLineamientosInvestigacionC);

router.post('/lineamientosinvestigacion', uploadLineamientosInvestigacion, postLineamientosInvestigacionC);




export default router;



