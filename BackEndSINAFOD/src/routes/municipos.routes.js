import {Router} from "express";
import { getMunicipiosIdC } from "../controllers/municipos.controller.js";
const router=Router();


//---------------------------------------------------------
//                  MUNICIPIOS
//---------------------------------------------------------

router.get('/municipios/:id', getMunicipiosIdC)


export default router;
