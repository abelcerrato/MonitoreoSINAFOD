import { Router } from "express"; // Importar el enrutador de express
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
} from "../controllers/Participante.controller.js"; // Importar los controladores para los participantes
import { getFiltroDocentesC } from "../controllers/docentesDGDP.controller.js"; // Importar el controlador para el filtro de docentes

import { /* cargaMasivaFormacion, */ cargaMasivaFormacionParticipantes } from "../controllers/cargamasiva.js"; // Importar el controlador para la carga masiva de formación
import multer from 'multer'; // Importar multer para manejo de archivos
const upload = multer({ storage: multer.memoryStorage() }); // Configurar multer para almacenar archivos en memoria


const router = Router(); //Crear una instancia del router de express

router.get("/participante", getParticipanteC); //Ruta para obtener todos los participantes
router.get("/participante/:id", getParticipanteIdC); //Ruta para obtener un participante por su id

router.get("/participanteInvest", getParticipanteInvestigacionC); //Ruta para obtener los participantes de investigación
router.get("/participanteInvest/:id", getParticipanteIdInvestC); //Ruta para obtener un participante de investigación por su id

router.get("/participanteFormacion", getParticipanteFormacionC); //Ruta para obtener los participantes de formación
router.get("/participanteFormacion/:id", getParticipanteIdFormacionC); //Ruta para obtener un participante de formación por su id

router.post("/participante/:tipo/:id", getFiltroDocentesC); //Ruta para INSERTAR los participantes por el filtro y tipo si es formación o investigación
router.put("/participante/:id", putParticipanteC); //Ruta para actualizar un participante por su id

router.get("/participante/:tipo/:id", getParticipanteIdFormInvestC); //Ruta para obtener los participantes por el id de la formación o investigacion y el tipo

router.post("/participanteInvFormCed", postParticipantesIFCedC); //Ruta que refgistra todos los participantes con la formación o investigación a la que pertenece y centro educativo

//router.post('/carga-masiva-formacion', upload.single('archivo'), cargaMasivaFormacion); // no está en uso, ya que esta inserta los participantes de una formación fija
router.post('/carga-masiva-formacion', upload.single('archivo'), cargaMasivaFormacionParticipantes);  // Nueva ruta para carga masiva de participantes con formación

//Ruta para mostrar las etnias
router.get("/etnias", getEtniasC);

router.get("/relacionParticipanteFormacion", getRelacionParticipanteFormacionC); //Trae los participantes por el id de la Formación

export default router; // Exportar el enrutador
