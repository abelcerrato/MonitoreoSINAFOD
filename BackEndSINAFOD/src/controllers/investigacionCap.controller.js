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
        tipoactividad, existeconvenio, institucionconvenio,
        plataforma, socializaron, costo } = req.body
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


        const investCap = await postInvestigacionCapM(accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
            funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos,
            tipoactividad, existeconvenio, institucionconvenio, plataforma, socializaron, costo
        )

        res.json({ message: "Investigacion o Capacitacion agregado", id: investCap.id });
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
        tipoactividad, existeconvenio, institucionconvenio,
        plataforma, socializaron, costo } = req.body

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
            tipoactividad, existeconvenio, institucionconvenio,
            plataforma, socializaron, costo,
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
    { name: 'aplicacionevaluacionurl', maxCount: 1 },
    { name: 'criteriosfactibilidadurl', maxCount: 1 },
    { name: 'requisitostecnicosurl', maxCount: 1 },
    { name: 'criterioseticosurl', maxCount: 1 }
]);

//-------------------------------------------------------------------------------------------------------------------

// Crear investigacion o capacitacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const postLineamientosC = async (req, res) => {
    const {
        presentoprotocolo, estadoprotocolo,
        monitoreoyevaluacion, aplicacionevaluacion, accionformacion, creadopor,
        formacioninvest, criteriosfactibilidad, criteriosfactibilidadurl,
        requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map(n => n.toString().padStart(2, '0')).join('-');

    try {
        // 1. Validar usuario
        const userResponse = await getUsuarioIdM(creadopor);
        if (!userResponse || userResponse.length === 0 || !userResponse[0].id) {
            return res.status(404).json({ message: "Usuario no encontrado o sin ID válido" });
        }
        const usuario = userResponse[0].id;

        // 2. Insert inicial con valores por defecto
        const result = await postLineamientosM(
            presentoprotocolo,
            null, // presentoprotocolourl
            estadoprotocolo,
            monitoreoyevaluacion,
            null, // monitoreoyevaluacionurl
            aplicacionevaluacion,
            null, // aplicacionevaluacionurl
            accionformacion,
            usuario,
            formacioninvest,
            criteriosfactibilidad,
            null, //criteriosfactibilidadurl,
            requisitostecnicos,
            null, //requisitostecnicosurl,
            criterioseticos,
            null, //criterioseticosurl

        );

        const idInvestCap = result.id;

        // 3. Procesar archivos y preparar actualizaciones
        const fileUpdates = {
            presentoprotocolourl: null,
            monitoreoyevaluacionurl: null,
            aplicacionevaluacionurl: null,
            criteriosfactibilidadurl: null,
            requisitostecnicosurl: null,
            criterioseticosurl: null
        };

        const booleanUpdates = {
            presentoprotocolo: false,
            monitoreoyevaluacion: false,
            aplicacionevaluacion: false,
            criteriosfactibilidad: false,
            requisitostecnicos: false,
            criterioseticos: false
        };

        // Procesar cada archivo
        if (files.presentoprotocolourl && files.presentoprotocolourl[0]) {
            const file = files.presentoprotocolourl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.presentoprotocolourl = filename;
            booleanUpdates.presentoprotocolo = true; // Marcamos como true si hay archivo
        }

        if (files.monitoreoyevaluacionurl && files.monitoreoyevaluacionurl[0]) {
            const file = files.monitoreoyevaluacionurl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.monitoreoyevaluacionurl = filename;
            booleanUpdates.monitoreoyevaluacion = true;
        }

        if (files.aplicacionevaluacionurl && files.aplicacionevaluacionurl[0]) {
            const file = files.aplicacionevaluacionurl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.aplicacionevaluacionurl = filename;
            booleanUpdates.aplicacionevaluacion = true;
        }

        if (files.criteriosfactibilidadurl && files.criteriosfactibilidadurl[0]) {
            const file = files.criteriosfactibilidadurl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.criteriosfactibilidadurl = filename;
            booleanUpdates.criteriosfactibilidad = true;
        }

        if (files.requisitostecnicosurl && files.requisitostecnicosurl[0]) {
            const file = files.requisitostecnicosurl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.requisitostecnicosurl = filename;
            booleanUpdates.requisitostecnicos = true;
        }

        if (files.criterioseticosurl && files.criterioseticosurl[0]) {
            const file = files.criterioseticosurl[0];
            const filename = `${idInvestCap}-${date}-${file.originalname}`;
            const newPath = path.join(file.destination, filename);
            fs.renameSync(file.path, newPath);
            fileUpdates.criterioseticosurl = filename;
            booleanUpdates.criterioseticos = true;
        }



        // 4. Actualizar con las rutas de archivos y los booleanos
        const updatedLineamientos = await putLineamientosM(
            booleanUpdates.presentoprotocolo, // Enviamos true/false según si hay archivo
            fileUpdates.presentoprotocolourl,
            estadoprotocolo,
            booleanUpdates.monitoreoyevaluacion,
            fileUpdates.monitoreoyevaluacionurl,
            booleanUpdates.aplicacionevaluacion,
            fileUpdates.aplicacionevaluacionurl,
            booleanUpdates.criteriosfactibilidad,
            fileUpdates.criteriosfactibilidadurl,
            booleanUpdates.requisitostecnicos,
            fileUpdates.requisitostecnicosurl,
            booleanUpdates.criterioseticos,
            fileUpdates.criterioseticosurl,
            idInvestCap
        );

        res.json({
            success: true,
            message: "Lineamientos actualizados correctamente",
            id: idInvestCap,
            files: fileUpdates,
            flags: booleanUpdates
        });

    } catch (error) {
        console.error("Error en postLineamientosC:", error);
        res.status(500).json({
            success: false,
            error: "Error al procesar los lineamientos",
            details: error.message
        });
    }
};
//-----------------------------------------------------------------------------------------------------------
// Actualizar lineamientos de investigacion o capacitacion
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putLineamientosC = async (req, res) => {
    const { id } = req.params;
    const { presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
        criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl
     } = req.body

    try {

        const investCap = await putLineamientosM(presentoprotocolo, presentoprotocolourl, estadoprotocolo,
            monitoreoyevaluacion, monitoreoyevaluacionurl,
            aplicacionevaluacion, aplicacionevaluacionurl,
            criteriosfactibilidad, criteriosfactibilidadurl,
            requisitostecnicos, requisitostecnicosurl,
            criterioseticos, criterioseticosurl,
            id)
        //res.json(investCap)
        res.json({ message: "Lineamientos de la Investigacion o capacitacion actualizados ", user: investCap });
    } catch (error) {
        console.error('Error al actualizar la investigacion o capaciotacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}


