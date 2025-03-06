
import {Router} from "express";
import { getInvestigacionCapC, getInvestigacionCapIdInvC, posInvestigacionCapC, putInvestigacionCapC } from "../controllers/investigacionCap.controller.js";
const router=Router();


//---------------------------------------------------------
//      INVESTIGACION O CAPACITACION
//---------------------------------------------------------
router.get('/investC', getInvestigacionCapC)
router.get('/investC/:id', getInvestigacionCapIdInvC)
router.post('/investC', posInvestigacionCapC)
router.put('/investC/:id', putInvestigacionCapC)


export default router;