
import {Router} from "express";
import { getInvestigacionCapC, getInvestigacionCapIdInvC, posInvestigacionCapC, postLineamientosC, putInvestigacionCapC, putLineamientosC, upload, uploadLineamientos,  } from "../controllers/investigacionCap.controller.js";
const router=Router();


//---------------------------------------------------------
//      INVESTIGACION O CAPACITACION
//---------------------------------------------------------
router.get('/investC', getInvestigacionCapC)
router.get('/investC/:id', getInvestigacionCapIdInvC)
router.post('/investC', posInvestigacionCapC)
router.put('/investC/:id', putInvestigacionCapC)

router.put('/lineamientos/:id', uploadLineamientos, putLineamientosC);

router.post('/lineamientos', uploadLineamientos, postLineamientosC);




export default router;



