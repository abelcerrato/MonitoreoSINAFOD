import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getCapParticipanteIdInvestM, getCapParticipanteIdM, getCapParticipanteM, postCapParticipanteM, putCapParticipanteM } from "../models/CapParticipante.models.js";
import { getDepartamentoId } from "../models/departamentos.models.js";
import { getMunicipiosIdM, getMunicipioxIdDepto } from "../models/municipos.models.js";
import { getUsuarioIdM } from "../models/user.models.js";

export const getCapParticipanteC = async (req, res) => {
    try {
        const CapParticipante = await getCapParticipanteM();
        res.json(CapParticipante)
    } catch (error) {
        console.error('Error al obtener registros de Capacitacion del participante:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}

//Trae los participantes por el id
export const getCapParticipanteIdC = async (req, res) => {
    try {
        const { id } = req.params
        const CapParticipante = await getCapParticipanteIdM(id);

        if (!CapParticipante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(CapParticipante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//Trae los participantes por el id de la investigacion
export const getCapParticipanteIdInvestC = async (req, res) => {
    try {
        const { id } = req.params
        const CapParticipante = await getCapParticipanteIdInvestM(id);

        if (!CapParticipante) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(CapParticipante)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const postCapParticipanteC = async (req, res) => {
    try {
        const { idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
            departamentoced, municipioced, creadopor, idnivelesacademicos, idgradosacademicos, 
            CicloAcademico, sexo, añosdeservicio, tipoadministracion, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced } = req.body
        console.log(req.body);

        const muniResponse = await getMunicipioxIdDepto(municipioced);
        if (!muniResponse || muniResponse.length === 0 || !muniResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const municipio = muniResponse[0].id;

        const userResponse = await getUsuarioIdM(creadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;
/* 
        const NivelResponse = await getNivelAcademicoM(NivelAcademico);
        if (!NivelResponse || NivelResponse.length === 0 || !NivelResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const idnivelesacademicos = NivelResponse[0].id; */


        let idciclosacademicos = null; // Por defecto lo dejamos en null

        // Lógica para asignar el valor a idciclosacademicos según idgradosacademicos
        if (idgradosacademicos >= 1 && idgradosacademicos <= 3) {
            idciclosacademicos = 1;
        } else if (idgradosacademicos >= 4 && idgradosacademicos <= 6) {
            idciclosacademicos = 2;
        } else if (idgradosacademicos >= 7 && idgradosacademicos <= 9) {
            idciclosacademicos = 3;
        }


        // const CicloResponse = await getCicloAcademicoM(CicloAcademico);

        // if (CicloResponse && CicloResponse.length > 0 && CicloResponse[0].id) {
        //     idciclosacademicos = CicloResponse[0].id;
        // }

        const CapParticipante = await postCapParticipanteM(idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
            departamentoced, municipio, usuario, idnivelesacademicos, idgradosacademicos, idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced)
        //res.json(CapParticipante
        res.json({ message: "Capacitacion del participante agregada", user: CapParticipante });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const putCapParticipanteC = async (req, res) => {

    try {
        const { id } = req.params;
        const { idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
            departamentoced, municipioced, modificadopor, idnivelesacademicos, idgradosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced } = req.body

        /* 
                const deptoResponse = await getDepartamentoId(departamentoced);
                if (!deptoResponse || deptoResponse.length === 0 || !deptoResponse[0].id) {
                    return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
                }
                const departamento = deptoResponse[0].id; */

        const muniResponse = await getMunicipioxIdDepto(municipioced);
        if (!muniResponse || muniResponse.length === 0 || !muniResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const municipio = muniResponse[0].id;


        const userResponse = await getUsuarioIdM(modificadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;



        let idciclosacademicos = null; // Por defecto lo dejamos en null

        // Lógica para asignar el valor a idciclosacademicos según idgradosacademicos
        if (idgradosacademicos >= 1 && idgradosacademicos <= 3) {
            idciclosacademicos = 1;
        } else if (idgradosacademicos >= 4 && idgradosacademicos <= 6) {
            idciclosacademicos = 2;
        } else if (idgradosacademicos >= 7 && idgradosacademicos <= 9) {
            idciclosacademicos = 3;
        }


        const CapParticipante = await putCapParticipanteM(idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
            departamentoced, municipio, usuario, idnivelesacademicos, idgradosacademicos, idciclosacademicos, 
            sexo, añosdeservicio, tipoadministracion, codigodered, deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced, id)
        //res.json(CapParticipante)
        res.json({ message: "Capacitacion del participanteactualizada ", user: CapParticipante });
    } catch (error) {
        console.error('Error al actualizar la Capacitacion del participante: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}
