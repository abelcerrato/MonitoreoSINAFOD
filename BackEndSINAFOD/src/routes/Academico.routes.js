import {Router} from "express";
import { getNivelesAcademicosC, getNivelAcademicoNombreC, getCiclosAcademicosC, getCicloAcademicoNombreC, getGradosAcademicosC, getGradoAcademicoC, getCicloAcademicoIdNivelC, getGradoAcademicoIdCicloC, getGradoAcademicoIdNivelC } from "../controllers/Academico.controller.js";
const router=Router();


///////////////////////////////////////////////////////////////////////////

router.get('/nivelesAcademicos', getNivelesAcademicosC)

router.get('/nivelAcademico/:NivelAcademico', getNivelAcademicoNombreC)

////////////////////////////////////////////////////////////////////////////

router.get('/ciclosAcademicos', getCiclosAcademicosC )

router.get('/cicloAcademico/:CicloAcademico', getCicloAcademicoNombreC)

router.get('/cicloAcademicoNivel/:IdNivel', getCicloAcademicoIdNivelC)

////////////////////////////////////////////////////////////////////////////

router.get('/gradosAcademicos', getGradosAcademicosC )

router.get('/gradoAcademico/:GradoAcademico', getGradoAcademicoC)

router.get('/gradoAcademico/:IdCiclo', getGradoAcademicoIdCicloC)

router.get('/gradoAcademicoNivel/:IdNivel', getGradoAcademicoIdNivelC)



export default router;
