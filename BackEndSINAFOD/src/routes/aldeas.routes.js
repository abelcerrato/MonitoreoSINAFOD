import {Router} from "express";
import { getAldeasIdC } from "../controllers/aldeas.controller.js";
const router=Router();


//---------------------------------------------------------
//                  ALDEAS
//---------------------------------------------------------

router.get('/aldeas/:id', getAldeasIdC)


export default router;
