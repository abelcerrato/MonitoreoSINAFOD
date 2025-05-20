import {Router} from "express";
import { getParticipanteC, getParticipanteIdC, getParticipanteIdFormacionC, getParticipanteIdFormInvestC, getParticipanteIdInvestC, putParticipanteC  } from "../controllers/Participante.controller.js";
import { getFiltroDocentesC } from "../controllers/docentesDGDP.controller.js";
const router=Router();


router.get('/participante', getParticipanteC)
router.get('/participante/:id', getParticipanteIdC)
router.get('/participanteInvest/:id', getParticipanteIdInvestC)
router.get('/participanteFormacion/:id', getParticipanteIdFormacionC)
router.post('/participante/:tipo/:id', getFiltroDocentesC)
router.put('/participante/:id', putParticipanteC)


router.get('/participante/:tipo/:id', getParticipanteIdFormInvestC)



export default router;
