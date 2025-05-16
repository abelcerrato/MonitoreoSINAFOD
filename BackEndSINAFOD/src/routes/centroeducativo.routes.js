import {Router} from "express";
import { getCentroEducativoC, getCentroEducativoIdPartC, getIdCentroEducativoC, postCentroEducativoC, putCentroEducativoC } from "../controllers/centroeducativo.controller.js";
const router=Router();


router.get('/centroeducativo', getCentroEducativoC )
router.get('/centroeducativo/:id', getIdCentroEducativoC)
router.get('/centroeducativo/:identificacion', getCentroEducativoIdPartC)
router.post('/centroeducativo', postCentroEducativoC)
router.put('/centroeducativo/:id', putCentroEducativoC)


export default router;
