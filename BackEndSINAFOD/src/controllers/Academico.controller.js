

import { getNivelesAcademicosM, getNivelAcademicoM, getCiclosAcademicosM, getCicloAcademicoM, getGradosAcademicosM, getGradoAcademicoM, getCicloAcademicoIdNivelM, getGradoAcademicoIdCicloM, getGradoAcademicoIdNivelM } from "../models/Academico.models.js";

//Trae todos los niveles academicos
export const getNivelesAcademicosC = async (req, res) => {
    try {
        const NivelAcademico = await getNivelesAcademicosM();
        res.json(NivelAcademico)
    } catch (error) {
        console.error('Error al obtener registros de Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el id del nivel academico mediante el nombre
export const getNivelAcademicoNombreC = async (req, res) => {
    try {
        const { NivelAcademico } = req.params
        const NivelAcademicos = await getNivelAcademicoM(NivelAcademico);
        res.json(NivelAcademicos)
    } catch (error) {
        console.error('Error al obtener registros de Nivel Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////



//Trae todos los ciclos academicos
export const getCiclosAcademicosC = async (req, res) => {
    try {
        const Ciclos = await getCiclosAcademicosM();
        res.json(Ciclos)
    } catch (error) {
        console.error('Error al obtener registros de Ciclo Educativo:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el id del ciclo academico mediante el nombre
export const getCicloAcademicoNombreC = async (req, res) => {
    try {
        const { CicloAcademico } = req.params
        const Ciclos = await getCicloAcademicoM(CicloAcademico);
        res.json(Ciclos)
    } catch (error) {
        console.error('Error al obtener registros de Ciclo Educativo:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el ciclo academico mediante el id del nivel academico
export const getCicloAcademicoIdNivelC = async (req, res) => {
    try {

        const { IdNivel } = req.params
        const Ciclos = await getCicloAcademicoIdNivelM(IdNivel);
        res.json(Ciclos)
    } catch (error) {
        console.error('Error al obtener registros de Ciclo Educativo:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////


//Trae todos los grados academicos
export const getGradosAcademicosC = async (req, res) => {
    try {
        const Grados = await getGradosAcademicosM();
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el id grado academico mediante el nombre
export const getGradoAcademicoC = async (req, res) => {
    try {
        const { GradoAcademico } = req.params
        const Grados = await getGradoAcademicoM(GradoAcademico);
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}



//Trae el grado academico mediante el id del ciclo academico
export const getGradoAcademicoIdCicloC = async (req, res) => {
    try {
        const { Ciclo } = req.params
        const Grados = await getGradoAcademicoIdCicloM(Ciclo);
        res.json(Grados)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae el grado academico mediante el id del nivel academico
export const getGradoAcademicoIdNivelC = async (req, res) => {
    try {

        const { IdNivel } = req.params
        const Ciclos = await getGradoAcademicoIdNivelM(IdNivel);
        res.json(Ciclos)
    } catch (error) {
        console.error('Error al obtener registros de Grado Académico:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}
