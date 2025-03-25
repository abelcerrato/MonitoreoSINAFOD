import { getDocentesIdM, getDocentesM, postDocentesM, putDocentesM } from "../models/docentesDGDP.models.js";


export const getDocentesC = async (req, res) => {
    try {
        const docentes= await getDocentesM();
        res.json(docentes);

    } catch (error) {
        console.log('Error al obtener docentes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        
    }
}


export const getDocentesIdC = async (req, res) => {
    const { id } = req.params;
    try {
        const docentes = await getDocentesIdM(identificacion);
        if (docentes === null) {
            res.status(404).json({ error: 'Docente no encontrado' });
            return;
        }
        res.json(docentes);
    } catch (error) {
        console.log('Error al obtener docente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postDocentesC = async (req, res) => {
    const { codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
            sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona } = req.body;
    try {
        const docentes = await postDocentesM(codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                            sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona);
        res.json({ message: "Docente agregado ", docentes: docentes });
    } catch (error) {
        console.error('Error al insertar docente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putDocentesC = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona } = req.body;
        console.log(req.body);

        const docentes = await putDocentesM(codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                            sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona, id);
        res.json({ message: "Docente actualizado", docentes: docentes });
    } catch (error) {
        console.error('Error al actualizar docente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}