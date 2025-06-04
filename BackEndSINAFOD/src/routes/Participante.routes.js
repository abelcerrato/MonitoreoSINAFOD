import { Router } from "express";
import {
  getParticipanteC,
  getParticipanteFormacionC,
  getParticipanteIdC,
  getParticipanteIdFormacionC,
  getParticipanteIdFormInvestC,
  getParticipanteIdInvestC,
  getParticipanteInvestigacionC,
  postParticipantesIFCedC,
  putParticipanteC,
} from "../controllers/Participante.controller.js";
import { getFiltroDocentesC } from "../controllers/docentesDGDP.controller.js";
const router = Router();

router.get("/participante", getParticipanteC);
router.get("/participante/:id", getParticipanteIdC);
router.get("/participanteInvest", getParticipanteInvestigacionC);//
router.get("/participanteInvest/:id", getParticipanteIdInvestC);
router.get("/participanteFormacion", getParticipanteFormacionC);//
router.get("/participanteFormacion/:id", getParticipanteIdFormacionC);
router.post("/participante/:tipo/:id", getFiltroDocentesC);
router.put("/participante/:id", putParticipanteC);

router.get("/participante/:tipo/:id", getParticipanteIdFormInvestC);

router.post("/participanteInvFormCed", postParticipantesIFCedC); //ruta que refgistra todos los participantes con la formacion o investigacion a la que pertenece y centro educativo

export default router;
