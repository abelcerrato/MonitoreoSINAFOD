import path from "path";
import fs from "fs";
import multer from "multer";

import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getInvestigacionCapIdInvM, getInvestigacionCapM, postInvestigacionCapM, postLineamientosM, putInvestigacionCapM, putLineamientosM } from "../models/investigacionCap.models.js";
import { getUsuarioIdM } from "../models/user.models.js";

//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion
export const getInvestigacionCapC = async (req, res) => {
    try {
        const investCap = await getInvestigacionCapM();
        res.json(investCap)
    } catch (error) {
        console.error('Error al obtener registros de investigacionCap:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}

//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion por id
export const getInvestigacionCapIdInvC = async (req, res) => {
    const { id } = req.params
    try {

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



//-------------------------------------------------------------------------------------------------------------------------
// Crear investigacion o capacitacion sin lineamientos

export const posInvestigacionCapC = async (req, res) => {
    const { accionformacion, institucionresponsable, responsablefirmas,
        ambitoformacion, tipoformacion, modalidad, formacioninvest, zona,
        duracion, espaciofisico, funciondirigido, fechainicio,
        fechafinal, participantesprog, participantesrecib, direccion, observacion,
        estado, creadopor, idnivelesacademicos, cicloacademico,
        tipoactividad, existeconvenio, institucionconvenio } = req.body
    console.log(req.body);

    try {
        const userResponse = await getUsuarioIdM(creadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;

        const CicloResponse = await getCicloAcademicoM(cicloacademico);
        let idciclosacademicos = null;

        if (CicloResponse && CicloResponse.length > 0 && CicloResponse[0].id) {
            idciclosacademicos = CicloResponse[0].id;
        }


        const result = await postInvestigacionCapM(accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
            funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos,
            tipoactividad, existeconvenio, institucionconvenio)



        res.json({ message: "Investigacion o Capacitacion agregado", id: result.id });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//-----------------------------------------------------------------------------------------------------------
// Actualizar investigacion o capacitacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putInvestigacionCapC = async (req, res) => {
    const { id } = req.params;
    const { accionformacion, institucionresponsable, responsablefirmas,
        ambitoformacion, tipoformacion, modalidad, formacioninvest, zona,
        duracion, espaciofisico, funciondirigido, fechainicio,
        fechafinal, participantesprog, participantesrecib, direccion, observacion,
        estado, modificadopor, idnivelesacademicos, cicloacademico,
        tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo,
        monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl } = req.body

    try {

        const userResponse = await getUsuarioIdM(modificadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;

        const CicloResponse = await getCicloAcademicoM(cicloacademico);
        let idciclosacademicos = null; // Por defecto lo dejamos en null

        if (CicloResponse && CicloResponse.length > 0 && CicloResponse[0].id) {
            idciclosacademicos = CicloResponse[0].id;
        }

        const investCap = await putInvestigacionCapM(accionformacion, institucionresponsable, responsablefirmas,
            ambitoformacion, tipoformacion, modalidad, formacioninvest, zona,
            duracion, espaciofisico, funciondirigido, fechainicio,
            fechafinal, participantesprog, participantesrecib, direccion, observacion,
            estado, usuario, idnivelesacademicos, idciclosacademicos,
            tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo,
            monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
            id)
        //res.json(investCap)
        res.json({ message: "Investigacion o capacitacion actualizada ", user: investCap });
    } catch (error) {
        console.error('Error al actualizar la investigacion o capaciotacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controlador para manejar la subida de documentos
// Crear la carpeta uploads si no existe
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Crear la carpeta uploads si no existe
// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const d = new Date();
        const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
            .map(n => n.toString().padStart(2, '0'))
            .join('-');

        cb(null, `${date}-${file.originalname}`);
    },
});

// Crear una instancia de upload
export const upload = multer({ storage });


// Controlador para manejar la subida de documentos
export const uploadLineamientos = upload.fields([
    { name: 'presentoprotocolourl', maxCount: 1 },
    { name: 'monitoreoyevaluacionurl', maxCount: 1 },
    { name: 'aplicacionevaluacionurl', maxCount: 1 }
]);

//-------------------------------------------------------------------------------------------------------------------

// Crear investigacion o capacitacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const postLineamientosC = async (req, res) => {
    const {
        presentoprotocolo, estadoprotocolo,
        monitoreoyevaluacion, aplicacionevaluacion, accionformacion
    } = req.body;

    const files = req.files || [];
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map(n => n.toString().padStart(2, '0')).join('-');

    let presentoprotocolourl = null;
    let monitoreoyevaluacionurl = null;
    let aplicacionevaluacionurl = null;

    try {
        // Inserción de los lineamientos y obtención del ID
        const result = await postLineamientosM(
            presentoprotocolo, presentoprotocolourl, estadoprotocolo,
            monitoreoyevaluacion, monitoreoyevaluacionurl,
            aplicacionevaluacion, aplicacionevaluacionurl, accionformacion
        );

        const idInvestCap = result.id;  // ID de la investigación obtenida tras la inserción

        // Procesar los archivos
        for (let file of files) {
            const filename = `${idInvestCap}-${date}-${file.originalname}`; // Renombrar el archivo con el id y la fecha
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath); // Renombrar el archivo
            console.log(`Archivo renombrado: ${filename}`);// Aquí se almacena la nueva ruta en la base de datos

            // Asociar el archivo a su respectivo campo
            if (file.fieldname === "presentoprotocolourl") {
                presentoprotocolourl = filename;
            } else if (file.fieldname === "monitoreoyevaluacionurl") {
                monitoreoyevaluacionurl = filename;
            } else if (file.fieldname === "aplicacionevaluacionurl") {
                aplicacionevaluacionurl = filename;
            }
        }

        // Actualizar los lineamientos en la base de datos con los nombres de los archivos
        const lineamientos = await putLineamientosM(
            presentoprotocolo, presentoprotocolourl, estadoprotocolo,
            monitoreoyevaluacion, monitoreoyevaluacionurl,
            aplicacionevaluacion, aplicacionevaluacionurl,
            idInvestCap
        );

        res.json({ message: "Lineamientos actualizados", id: lineamientos.id });
    } catch (error) {
        console.error("Error al subir archivos", error);
        res.status(500).json({ error: "Error al subir archivos" });
    }
};


//-----------------------------------------------------------------------------------------------------------
// Actualizar lineamientos de investigacion o capacitacion
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putLineamientosC = async (req, res) => {
    const { id } = req.params;
    const { presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl } = req.body

    try {

        const investCap = await putLineamientosM(presentoprotocolo, presentoprotocolourl, estadoprotocolo,
            monitoreoyevaluacion, monitoreoyevaluacionurl,
            aplicacionevaluacion, aplicacionevaluacionurl,
            id)
        //res.json(investCap)
        res.json({ message: "Lineamientos de la Investigacion o capacitacion actualizados ", user: investCap });
    } catch (error) {
        console.error('Error al actualizar la investigacion o capaciotacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}


