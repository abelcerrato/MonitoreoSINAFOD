
import { getParticipanteIdInvestM, getParticipanteIdM, getParticipanteM, getParticipanteCodSACEM, getParticipanteIdentificacionM, postParticipanteM, putParticipanteM, getParticipanteIdFormacionM } from "../models/Participante.models.js";


export const getParticipanteC = async (req, res) => {
    try {
        const Participante = await getParticipanteM();
        res.json(Participante)
    } catch (error) {
        console.error('Error al obtener registros de acitacion del participante:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}

//Trae los participantes por el id
export const getParticipanteIdC = async (req, res) => {
    try {
        const { id } = req.params
        const Participante = await getParticipanteIdM(id);

        if (!Participante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(Participante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//Trae los participantes por el id de la investigacion
export const getParticipanteIdInvestC = async (req, res) => {
    try {
        const { id } = req.params
        const Participante = await getParticipanteIdInvestM(id);

        if (!Participante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(Participante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//Trae los participantes por el id de la Formacion
export const getParticipanteIdFormacionC = async (req, res) => {
    try {
        const { id } = req.params
        const Participante = await getParticipanteIdFormacionM(id);

        if (!Participante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(Participante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const postParticipanteC = async (req, res) => {
    try {

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

        const { identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
            idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor } = req.body
        console.log(req.body);


        const Participante = await postParticipanteM(
            idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
            idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor)

        res.json({ message: "Participante agregado exitosamente", user: Participante });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}





export const putParticipanteC = async (req, res) => {

    try {
        const { id } = req.params;
        const { idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
            idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, modificadopor } = req.body


        let idciclosacademicos = null; // Por defecto lo dejamos en null

        // Lógica para asignar el valor a idciclosacademicos según idgradoacademicos
        if (idgradoacademicos >= 1 && idgradoacademicos <= 3) {
            idciclosacademicos = 1;
        } else if (idgradoacademicos >= 4 && idgradoacademicos <= 6) {
            idciclosacademicos = 2;
        } else if (idgradoacademicos >= 7 && idgradoacademicos <= 9) {
            idciclosacademicos = 3;
        }


        const Participante = await putParticipanteM(
            idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
            idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, modificadopor, id)
        //res.json(Participante)
        res.json({ message: "acitacion del participanteactualizada ", user: Participante });
    } catch (error) {
        console.error('Error al actualizar la acitacion del participante: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}




//para buscar por identificacion en tabla de docentesdgdp
export const getParticipanteIdentificacionC = async (req, res) => {
    try {
        const { filtro } = req.params
        const Participante = await getParticipanteIdentificacionM(filtro);

        if (!Participante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(Participante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//para buscar por codigo SACE en tabla de docentesdgdp
export const getParticipanteCodSACEC = async (req, res) => {
    try {
        const { filtro } = req.params
        const Participante = await getParticipanteCodSACEM(filtro);

        if (!Participante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(Participante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
