import {Router} from "express";
import { getMunicipiosC, getMunicipiosIdC } from "../controllers/municipos.controller.js";
const router=Router();


//---------------------------------------------------------
//                  MUNICIPIOS
//---------------------------------------------------------

router.get('/municipios/:id', getMunicipiosIdC)
router.get('/municipios', getMunicipiosC)

export default router;
