import { getParticipanteCodSACEM, getParticipanteIdentificacionM } from "../models/CapParticipante.models.js";
import { getDocenteCodSACEM, getDocenteIdentificacionM, getDocentesIdM, getDocentesM, postDocentesM, putDocentesM } from "../models/docentesDGDP.models.js";


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
    const { identificacion } = req.params;
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


//para buscar por identificacion en tabla de docentesdgdp
export const getDocenteIdentificacionC = async (req, res) => {
    const { filtro } = req.params;
    try {
        const docentes = await getDocenteIdentificacionM(filtro);
        if (docentes === null) {
            res.status(404).json({ error: 'Docente no encontrado por identificacion' });
            return;
        }
        res.json(docentes);
    } catch (error) {
        console.log('Error al obtener docente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//para buscar por codigo SACE en tabla de docentesdgdp
export const getDocenteCodSACEC = async (req, res) => {
    const { filtro } = req.params;
    try {
        const docentes = await getDocenteIdentificacionM(filtro);
        if (docentes === null) {
            res.status(404).json({ error: 'Docente no encontrado por identificacion' });
            return;
        }
        res.json(docentes);
    } catch (error) {
        console.log('Error al obtener docente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




//filtrar por codigo SACE o por Identificacion

/* 
export const getFiltroDocenteC = async (req, res) => {
    const { filtro } = req.params;
    try {
        let resultado;

        // Buscar por identificación de docente
        resultado = await getDocenteIdentificacionM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por código SACE de docente
        resultado = await getDocenteCodSACEM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por identificación de participante
        resultado = await getParticipanteIdentificacionM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por código SACE de participante
        resultado = await getParticipanteCodSACEM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Si no encontró en ninguno
        res.status(404).json({ error: 'No se encontraron resultados para el filtro proporcionado' });
    } catch (error) {
        console.error('Error al obtener docente o participante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
 */


//filtrar por codigo SACE o por Identificacion
export const getFiltroDocenteC = async (req, res) => {
    const { filtro } = req.params;
    try {
        const resultados = await Promise.all([
            getDocenteIdentificacionM(filtro),
            getDocenteCodSACEM(filtro),
            getParticipanteCodSACEM(filtro),
            getParticipanteIdentificacionM(filtro)
        ]);

        // Buscar el primer resultado que no esté vacío o null
        const resultadoValido = resultados.find(item => item && (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0));

        if (resultadoValido) {
            return res.json(resultadoValido);
        }

        res.status(404).json({ error: 'No se encontraron resultados para el filtro proporcionado' });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




//filtrar por codigo SACE o por Identificacion
export const getFiltroDocentesC = async (req, res) => {
    const { filtro } = req.params;
    try {
        const resultados = await Promise.all([
            getDocenteIdentificacionM(filtro),
            getDocenteCodSACEM(filtro)
        ]);

        // Buscar el primer resultado que no esté vacío o null
        const resultadoValido = resultados.find(item => item && (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0));

        if (resultadoValido) {
            return res.json(resultadoValido);
        }

        res.status(404).json({ error: 'No se encontraron resultados para el filtro proporcionado' });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
