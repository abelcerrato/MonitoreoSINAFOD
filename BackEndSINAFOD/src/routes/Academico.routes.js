import {Router} from "express"; // Importar el enrutador de express
import { getNivelesAcademicosC, getNivelAcademicoNombreC, getCiclosAcademicosC, getCicloAcademicoNombreC, getGradosAcademicosC, getGradoAcademicoC, getCicloAcademicoIdNivelC, getGradoAcademicoIdCicloC, getGradoAcademicoIdNivelC } from "../controllers/Academico.controller.js"; // Importar los controladores para los niveles, ciclos y grados academicos 
const router=Router(); // Crear una instancia del enrutador


////////////////////////////////////////////////////////////////////////////

router.get('/nivelesAcademicos', getNivelesAcademicosC) //Ruta para obtener todos los niveles academicos

router.get('/nivelAcademico/:NivelAcademico', getNivelAcademicoNombreC) //Ruta para obtener un nivel academico por su nombre

////////////////////////////////////////////////////////////////////////////

router.get('/ciclosAcademicos', getCiclosAcademicosC ) //Ruta para obtener todos los ciclos academicos

router.get('/cicloAcademico/:CicloAcademico', getCicloAcademicoNombreC) //Ruta para obtener un ciclo academico por su nombre

router.get('/cicloAcademicoNivel/:IdNivel', getCicloAcademicoIdNivelC) //Ruta para obtener los ciclos academicos por el id del nivel academico

////////////////////////////////////////////////////////////////////////////

router.get('/gradosAcademicos', getGradosAcademicosC ) //Ruta para obtener todos los grados academicos

router.get('/gradoAcademico/:GradoAcademico', getGradoAcademicoC) //Ruta para obtener un grado academico por su nombre

router.get('/gradoAcademico/:IdCiclo', getGradoAcademicoIdCicloC) //Ruta para obtener los grados academicos por el id del ciclo academico

router.get('/gradoAcademicoNivel/:IdNivel', getGradoAcademicoIdNivelC) //Ruta para obtener los grados academicos por el id del nivel academico



export default router; // Exportar el enrutador
