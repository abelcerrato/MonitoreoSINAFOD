import { getCicloAcademicoM } from "../models/Academico.models.js";
import { getParticipanteCodSACEM, getParticipanteIdentificacionM, postParticipanteM } from "../models/Participante.models.js";
import { postCentroEducativoM } from "../models/centroeducativo.models.js";
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
       // const docentes = await getDocenteIdentificacionM(filtro);
        const resultados = await Promise.all([
            //getParticipanteCodSACEM(filtro),
            getParticipanteIdentificacionM(filtro),
            getDocenteIdentificacionM(filtro), 
           // getDocenteCodSACEM(filtro)
        ]);

        // Buscar el primer resultado que no esté vacío o null
        const resultadoValido = resultados.find(item => item && (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0));

        if (resultadoValido) {
            return res.json(resultadoValido);
        }

        return res.status(404).json({ 
            mensaje: 'No se encontraron registros para el filtro proporcionado.',
            //docentes
        
        });

   

    } catch (error) {
        console.error('Error al obtener datos:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};








//filtrar por codigo SACE o por Identificacion
export const getFiltroDocentesC = async (req, res) => {


    const { tipo, id } = req.params;

    let idinvestigacion = null;
    let idformacion = null;

    if (tipo === 'investigacion') {
        idinvestigacion = id;
    } else if (tipo === 'formacion') {
        idformacion = id;
    } else {
        return res.status(400).json({ error: "Tipo inválido. Debe ser 'investigacion' o 'formacion'." });
    }


    const {
        //datos del participante o sea el docente
        identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
        idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
        deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor,
        //datos del cventro educativo
        nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
        primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
        modalidad, iddepartamento, idmunicipio, idaldea
    } = req.body;

    console.log('respuesta del servidor: ', req.body);


    let idciclosacademicos = null; // Por defecto lo dejamos en null

    // Lógica para asignar el valor a idciclosacademicos según idgradoacademicos
    if (idgradoacademicos >= 1 && idgradoacademicos <= 3) {
        idciclosacademicos = 1;
    } else if (idgradoacademicos >= 4 && idgradoacademicos <= 6) {
        idciclosacademicos = 2;
    } else if (idgradoacademicos >= 7 && idgradoacademicos <= 9) {
        idciclosacademicos = 3;
    }


    try {
        // Buscar por identificación de docente y por codigo sace
        const resultado1 = await getDocenteIdentificacionM(identificacion);
        const resultado2 = await getDocenteCodSACEM(codigosace);

        //verificar si encuentra algun registro
        if (resultado1 == null && resultado2 == null) { //si no encuentra registros, pasa a insertar en docente y participante

            //insertar en docente
            const docentes = await postDocentesM(codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea,
                genero, nombreced, codigosaceCed, idnivelacademicos, idciclosacademicos, zona);

            //insertar en participante
            const Participante = await postParticipanteM(
                identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
                idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
                deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor)

            const idparticipante = Participante

            const CentroEducativo = await postCentroEducativoM(
                nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
                primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
                modalidad, iddepartamento, idmunicipio, idaldea, idparticipante)


            return res.status(201).json({
                message: "Participante y su centro educativo regiostrado a la Formacion o investigacion correctamente.",
                docentes,
                participantes: Participante,
                ced: CentroEducativo
            });

        } else { //si encuentra registros, pasa a agregar participante 


            //insertar en participante
            const Participante = await postParticipanteM(
                identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
                idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
                deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor)

            const idparticipante = Participante

            const CentroEducativo = await postCentroEducativoM(
                nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
                primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
                modalidad, iddepartamento, idmunicipio, idaldea, idparticipante)


            return res.status(201).json({
                message: "Docente actualizado y participante registrada.",
                participantes: Participante,
                ced: CentroEducativo
            });
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
