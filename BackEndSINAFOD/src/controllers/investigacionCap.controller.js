
import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getInvestigacionCapIdInvM, getInvestigacionCapM, postInvestigacionCapM, putInvestigacionCapM } from "../models/investigacionCap.models.js";
import {  getUsuarioIdM} from "../models/user.models.js";

export const getInvestigacionCapC = async (req, res) => {
    try {
        const investCap = await getInvestigacionCapM();
        res.json(investCap)
    } catch (error) {
        console.error('Error al obtener registros de investigacionCap:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}


export const getInvestigacionCapIdInvC = async (req, res) => {
    try {
        const { id } = req.params
        const investCap = await getInvestigacionCapIdInvM(id);

        if (!investCap) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(investCap)
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


/////////////////
export const posInvestigacionCapC = async (req, res) => {
    try {
        const { accionformacion, institucionresponsable, responsablefirmas, 
                ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, 
                duracion, espaciofisico, niveleducactivoobj, funciondirigido, fechainicio, 
                fechafinal, participantesprog, participantesrecib, direccion, observacion, 
                estado, creadopor, idnivelesacademicos,  cicloacademico} = req.body
        console.log(req.body);


        const userResponse = await getUsuarioIdM(creadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;

        // const NivelResponse= await getNivelAcademicoM(NivelAcademico);
        // if (!NivelResponse || NivelResponse.length === 0 || !NivelResponse[0].id) {
        //     return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        // }
        // const idnivelesacademicos = NivelResponse[0].id;

        const CicloResponse =await getCicloAcademicoM(cicloacademico);
        let idciclosacademicos = null; // Por defecto lo dejamos en null

        if (CicloResponse && CicloResponse.length > 0 && CicloResponse[0].id) {
            idciclosacademicos = CicloResponse[0].id;
        } 
       // const idciclosacademicos = CicloResponse[0].id;



        const investCap = await postInvestigacionCapM(accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico, 
            niveleducactivoobj, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos )
        
        res.json({ message: "Investigacion o Capacitacion agregado", id: investCap.id });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putInvestigacionCapC = async (req, res) => {

    try {
        const { id } = req.params;
        const { accionformacion, institucionresponsable, responsablefirmas, 
            ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, 
            duracion, espaciofisico, niveleducactivoobj, funciondirigido, fechainicio, 
            fechafinal, participantesprog, participantesrecib, direccion, observacion, 
            estado, modificadopor, idnivelesacademicos,  cicloacademico } = req.body

        const userResponse = await getUsuarioIdM(modificadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;

        const CicloResponse =await getCicloAcademicoM(cicloacademico);
        let idciclosacademicos = null; // Por defecto lo dejamos en null

        if (CicloResponse && CicloResponse.length > 0 && CicloResponse[0].id) {
            idciclosacademicos = CicloResponse[0].id;
        } 

        const investCap = await putInvestigacionCapM(accionformacion, institucionresponsable, responsablefirmas, 
                                                ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, 
                                                duracion, espaciofisico, niveleducactivoobj, funciondirigido, fechainicio, 
                                                fechafinal, participantesprog, participantesrecib, direccion, observacion, 
                                                estado, usuario, idnivelesacademicos, idciclosacademicos, id)
        //res.json(investCap)
        res.json({ message: "Investigacion o capacitacion actualizada ", user: investCap });
    } catch (error) {
        console.error('Error al actualizar la investigacion o capaciotacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}

