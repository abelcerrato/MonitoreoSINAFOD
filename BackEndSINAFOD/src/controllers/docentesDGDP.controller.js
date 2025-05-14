import { getCicloAcademicoM } from "../models/Academico.models.js";
import { getParticipanteCodSACEM, getParticipanteIdentificacionM, postCapParticipanteM } from "../models/CapParticipante.models.js";
import { getDocenteCodSACEM, getDocenteIdentificacionM, getDocentesIdM, getDocentesM, postDocentesM, putDocentesM } from "../models/docentesDGDP.models.js";
import { getUsuarioIdM } from "../models/ms_usuarios.models.js";


export const getDocentesC = async (req, res) => {
    try {
        const docentes = await getDocentesM();
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
        //const { id } = req.params;
        const { codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea,
            sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona } = req.body;
        console.log(req.body);

        const docentes = await putDocentesM(codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea,
            sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona);
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
            getParticipanteCodSACEM(filtro),
            getParticipanteIdentificacionM(filtro),
            getDocenteIdentificacionM(filtro),
            getDocenteCodSACEM(filtro)
        ]);

        // Buscar el primer resultado que no esté vacío o null
        const resultadoValido = resultados.find(item => item && (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0));

        if (resultadoValido) {
            return res.json(resultadoValido);
        }

        return res.status(404).json({ mensaje: 'No se encontraron registros para el filtro proporcionado.' });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};








//filtrar por codigo SACE o por Identificacion
export const getFiltroDocentesC = async (req, res) => {
    const { idinvestigacioncap } = req.params
    const { codigosace, identificacion, nombre, correo, iddepartamento, idmunicipio, idaldea,
        sexo, institucion, institucioncodsace, idnivelesacademicos, cicloacademico, zona,
        funcion, centroeducativo, departamentoced, municipioced, creadopor,
        idgradosacademicos, añosdeservicio, tipoadministracion, codigodered,
        deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced } = req.body;

    console.log('respuesta del servidor: ', req.body);


    const usuario = creadopor;



    let idciclosacademicos = null; // Por defecto lo dejamos en null

    // Lógica para asignar el valor a idciclosacademicos según idgradosacademicos
    if (idgradosacademicos >= 1 && idgradosacademicos <= 3) {
        idciclosacademicos = 1;
    } else if (idgradosacademicos >= 4 && idgradosacademicos <= 6) {
        idciclosacademicos = 2;
    } else if (idgradosacademicos >= 7 && idgradosacademicos <= 9) {
        idciclosacademicos = 3;
    }

    try {

        // Buscar por identificación de docente y por codigo sace
        const resultado1 = await getDocenteIdentificacionM(identificacion);
        const resultado2 = await getDocenteCodSACEM(codigosace);

        //verificar si encuentra algun registro
        if (resultado1 == null && resultado2 == null) { //si no encuentra registros, pasa a insertar en docente y participante

            //insertar en docente
            const docentes = await postDocentesM(codigosace, nombre, identificacion, correo, departamentoced, municipioced, aldeaced,
                sexo, centroeducativo, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona);



            //insertar en participante
            const CapParticipante = await postCapParticipanteM(idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipioced, usuario, idnivelesacademicos, idgradosacademicos,
                idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered,
                deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced)


            return res.status(201).json({
                message: "Docente agregado y capacitación del participante registrada.",
                docentes,
                participantes: CapParticipante
            });

        } else { //si encuentra registros, pasa a actualizar en docente y agregar participante 

            //actualizar en docente
            const docentes = await putDocentesM(codigosace, nombre, correo, departamentoced, municipioced, aldeaced,
                sexo, centroeducativo, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona, identificacion);


            //insertar en participante
            const CapParticipante = await postCapParticipanteM(idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipioced, usuario, idnivelesacademicos, idgradosacademicos,
                idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered,
                deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced)

            return res.status(201).json({
                message: "Docente actualizado y capacitación del participante registrada.",
                docentes,
                participantes: CapParticipante
            });
        }

    } catch (error) {
        console.error('Error al obtener datos:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
