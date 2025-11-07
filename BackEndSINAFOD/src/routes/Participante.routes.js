import { Router } from "express";
import {
  getEtniasC,
  getParticipanteC,
  getParticipanteFormacionC,
  getParticipanteIdC,
  getParticipanteIdFormacionC,
  getParticipanteIdFormInvestC,
  getParticipanteIdInvestC,
  getParticipanteInvestigacionC,
  getRelacionParticipanteFormacionC,
  postParticipantesIFCedC,
  putParticipanteC,
} from "../controllers/Participante.controller.js";
import { getFiltroDocentesC } from "../controllers/docentesDGDP.controller.js";

import { cargaMasivaFormacion, cargaMasivaFormacionParticipantes } from "../controllers/cargamasiva.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });



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


// Nueva ruta para carga masiva
//router.post('/carga-masiva-formacion', upload.single('archivo'), cargaMasivaFormacion); // no está en uso
router.post('/carga-masiva-formacion', upload.single('archivo'), cargaMasivaFormacionParticipantes); 


//ruta para traer las etnias
router.get("/etnias", getEtniasC);


router.get("/relacionParticipanteFormacion", getRelacionParticipanteFormacionC); //trae los participantes por el id de la Formacion

export default router;
