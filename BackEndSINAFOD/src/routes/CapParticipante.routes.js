import {Router} from "express";
import { getCapParticipanteC, getCapParticipanteIdC, getCapParticipanteIdInvestC, postCapParticipanteC, putCapParticipanteC  } from "../controllers/CapParticipante.controller.js";
import { getFiltroDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router();


router.get('/CapacitacionP', getCapParticipanteC)
router.get('/CapacitacionP/:id', getCapParticipanteIdC)
router.get('/CapacitacionInvest/:id', getCapParticipanteIdInvestC)
router.post('/CapacitacionP', getFiltroDocentesC)
router.put('/CapacitacionP/:id', putCapParticipanteC)




export default router;
