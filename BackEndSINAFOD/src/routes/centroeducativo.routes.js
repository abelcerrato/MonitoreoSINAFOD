import {Router} from "express";
import { getCentroEducativoC, getCentroEducativoPartC, getIdCentroEducativoC, postCentroEducativoC, putCentroEducativoC } from "../controllers/centroeducativo.controller.js";
const router=Router();


router.get('/centroeducativo', getCentroEducativoC )
router.get('/centroeducativo/:id', getIdCentroEducativoC)
router.get('/centroeducativo/:identificacion', getCentroEducativoPartC)
router.post('/centroeducativo', postCentroEducativoC)
router.put('/centroeducativo/:id', putCentroEducativoC)


export default router;
