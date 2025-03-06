import {Router} from "express";
import { getDepartamentosC } from "../controllers/departamentos.controller.js";
const router=Router();


//---------------------------------------------------------
//                  DEPARTAMENTIOS
//---------------------------------------------------------
router.get('/departamentos', getDepartamentosC)



export default router;
