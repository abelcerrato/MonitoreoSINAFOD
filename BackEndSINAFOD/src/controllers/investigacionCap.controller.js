import { bucket } from '../firebase.config.js';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { pool } from '../db.js'
import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getInvestigacionCapIdInvM, getInvestigacionCapM, postInvestigacionCapM, postLineamientosM, putInvestigacionCapM, putLineamientosM } from "../models/investigacionCap.models.js";
import { getUsuarioIdM } from "../models/ms_usuarios.models.js";

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
        const usuario = creadopor // Usar el creadopor o modificadopor según lo que esté disponible

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

        const usuario = modificadopor // Usar el creadopor o modificadopor según lo que esté disponible

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




// Configuración de multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Middleware para manejar la subida de archivos
export const uploadLineamientos = upload.fields([
    { name: 'presentoprotocolourl', maxCount: 1 },
    { name: 'monitoreoyevaluacionurl', maxCount: 1 },
    { name: 'aplicacionevaluacionurl', maxCount: 1 },
    { name: 'criteriosfactibilidadurl', maxCount: 1 },
    { name: 'requisitostecnicosurl', maxCount: 1 },
    { name: 'criterioseticosurl', maxCount: 1 },
]);


// Configuración de tipos de archivo permitidos
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Tamaño máximo de archivo (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const postLineamientosC = async (req, res) => {
    const {
        presentoprotocolo,
        estadoprotocolo,
        monitoreoyevaluacion,
        aplicacionevaluacion,
        accionformacion,
        creadopor,
        formacioninvest,
        criteriosfactibilidad,
        requisitostecnicos,
        criterioseticos,
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map((n) => n.toString().padStart(2, '0'))
        .join('-');

    try {

        const usuario = creadopor;

        // 2. Validar archivos
        for (const fieldName in files) {
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];

                if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                    return res.status(400).json({
                        success: false,
                        error: `Tipo de archivo no permitido para ${fieldName}: ${file.mimetype}`,
                        allowedTypes: ALLOWED_MIME_TYPES
                    });
                }

                if (file.size > MAX_FILE_SIZE) {
                    return res.status(400).json({
                        success: false,
                        error: `Archivo demasiado grande para ${fieldName}: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                    });
                }
            }
        }

        // 3. Inserción inicial en BD
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
            null, // criteriosfactibilidadurl
            requisitostecnicos,
            null, // requisitostecnicosurl
            criterioseticos,
            null // criterioseticosurl
        );

        const idInvestCap = result.id;

        // 4. Subir archivos a Firebase
        const fileUpdates = {};
        const booleanUpdates = {};

        const uploadFileToFirebase = async (fileBuffer, filename, mimeType) => {
            const file = bucket.file(filename);
            const token = uuidv4();

            await file.save(fileBuffer, {
                metadata: {
                    contentType: mimeType,
                    metadata: {
                        firebaseStorageDownloadTokens: token,
                        uploader: usuario,
                        uploadDate: new Date().toISOString()
                    },
                },
            });

            // return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}?alt=media&token=${token}`;
            return filename;
        };

        const uploadPromises = [];
        for (const fieldName in files) {
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];
                const filename = `${idInvestCap}_${date}-${file.originalname}`;

                uploadPromises.push(
                    uploadFileToFirebase(file.buffer, filename, file.mimetype)
                        .then(url => {
                            fileUpdates[fieldName] = url;
                            booleanUpdates[fieldName.replace('url', '')] = true;
                        })
                );
            }
        }

        await Promise.all(uploadPromises);

        // 5. Actualizar BD con URLs
        await putLineamientosM(
            booleanUpdates.presentoprotocolo || false,
            fileUpdates.presentoprotocolourl || null,
            estadoprotocolo,
            booleanUpdates.monitoreoyevaluacion || false,
            fileUpdates.monitoreoyevaluacionurl || null,
            booleanUpdates.aplicacionevaluacion || false,
            fileUpdates.aplicacionevaluacionurl || null,
            booleanUpdates.criteriosfactibilidad || false,
            fileUpdates.criteriosfactibilidadurl || null,
            booleanUpdates.requisitostecnicos || false,
            fileUpdates.requisitostecnicosurl || null,
            booleanUpdates.criterioseticos || false,
            fileUpdates.criterioseticosurl || null,
            usuario,
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
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
//-----------------------------------------------------------------------------------------------------------



export const putLineamientosC = async (req, res) => {
    const { id } = req.params;
    const {
        presentoprotocolo,
        estadoprotocolo,
        monitoreoyevaluacion,
        aplicacionevaluacion,
        accionformacion,
        modificadopor,
        formacioninvest,
        criteriosfactibilidad,
        requisitostecnicos,
        criterioseticos,
        // Estos campos vienen como strings 'null' desde el frontend
        presentoprotocolourl,
        monitoreoyevaluacionurl,
        aplicacionevaluacionurl,
        criteriosfactibilidadurl,
        requisitostecnicosurl,
        criterioseticosurl
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map(n => n.toString().padStart(2, '0'))
        .join('-');

    try {
        // 1. Validar usuario (tu código actual está bien)

        const usuario = modificadopor;

        // 2. Validar archivos (tu código actual está bien)
        for (const fieldName in files) {
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];

                if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                    return res.status(400).json({
                        success: false,
                        error: `Tipo de archivo no permitido para ${fieldName}: ${file.mimetype}`,
                        allowedTypes: ALLOWED_MIME_TYPES
                    });
                }

                if (file.size > MAX_FILE_SIZE) {
                    return res.status(400).json({
                        success: false,
                        error: `Archivo demasiado grande para ${fieldName}: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                    });
                }
            }
        }

        // 3. Obtener datos actuales
        const currentDataResponse = await pool.query(
            'SELECT * FROM investigacioncap WHERE id = $1',
            [id]
        );
        const currentData = currentDataResponse.rows[0];

        if (!currentData) {
            return res.status(404).json({
                success: false,
                message: "Registro no encontrado"
            });
        }

        // 4. Función para subir archivos (tu código actual está bien)
        const uploadFileToFirebase = async (fileBuffer, filename, mimeType) => {
            const file = bucket.file(filename);
            const token = uuidv4();

            await file.save(fileBuffer, {
                metadata: {
                    contentType: mimeType,
                    metadata: {
                        firebaseStorageDownloadTokens: token,
                        uploader: usuario,
                        uploadDate: new Date().toISOString()
                    },
                },
            });

            return filename;
        };

        // 5. Procesar archivos nuevos y solicitudes de eliminación
        const fileUpdates = {};
        const booleanUpdates = {};
        const uploadPromises = [];

        // Campos de archivos que pueden ser actualizados
        const fileFields = [
            'presentoprotocolourl',
            'monitoreoyevaluacionurl',
            'aplicacionevaluacionurl',
            'criteriosfactibilidadurl',
            'requisitostecnicosurl',
            'criterioseticosurl'
        ];

        // Procesar cada campo de archivo
        fileFields.forEach(fieldName => {
            const fieldValue = req.body[fieldName];

            // Caso 1: Se subió un nuevo archivo
            if (files[fieldName]?.[0]) {
                const file = files[fieldName][0];
                const filename = `${id}_${date}-${file.originalname}`;

                uploadPromises.push(
                    uploadFileToFirebase(file.buffer, filename, file.mimetype)
                        .then(url => {
                            fileUpdates[fieldName] = url;
                            booleanUpdates[fieldName.replace('url', '')] = true;
                        })
                );
            }
            // Caso 2: Se solicitó eliminar el archivo (valor 'null' como string)
            else if (fieldValue === 'null') {
                fileUpdates[fieldName] = null;
                booleanUpdates[fieldName.replace('url', '')] = false;
            }
            // Caso 3: Mantener el archivo existente
            else if (currentData[fieldName]) {
                fileUpdates[fieldName] = currentData[fieldName];
                booleanUpdates[fieldName.replace('url', '')] = true;
            }
            // Caso 4: No hay archivo existente ni nuevo
            else {
                fileUpdates[fieldName] = null;
                booleanUpdates[fieldName.replace('url', '')] = false;
            }
        });

        await Promise.all(uploadPromises);

        // 6. Preparar datos finales para actualización
        const updateData = {
            presentoprotocolo: booleanUpdates.presentoprotocolo ?? currentData.presentoprotocolo,
            presentoprotocolourl: fileUpdates.presentoprotocolourl ?? null,
            estadoprotocolo: estadoprotocolo || currentData.estadoprotocolo,
            monitoreoyevaluacion: booleanUpdates.monitoreoyevaluacion ?? currentData.monitoreoyevaluacion,
            monitoreoyevaluacionurl: fileUpdates.monitoreoyevaluacionurl ?? null,
            aplicacionevaluacion: booleanUpdates.aplicacionevaluacion ?? currentData.aplicacionevaluacion,
            aplicacionevaluacionurl: fileUpdates.aplicacionevaluacionurl ?? null,
            accionformacion: accionformacion || currentData.accionformacion,
            formacioninvest: formacioninvest || currentData.formacioninvest,
            criteriosfactibilidad: booleanUpdates.criteriosfactibilidad ?? currentData.criteriosfactibilidad,
            criteriosfactibilidadurl: fileUpdates.criteriosfactibilidadurl ?? null,
            requisitostecnicos: booleanUpdates.requisitostecnicos ?? currentData.requisitostecnicos,
            requisitostecnicosurl: fileUpdates.requisitostecnicosurl ?? null,
            criterioseticos: booleanUpdates.criterioseticos ?? currentData.criterioseticos,
            criterioseticosurl: fileUpdates.criterioseticosurl ?? null
        };

        // 7. Actualizar en la base de datos
        const updatedData = await putLineamientosM(
            updateData.presentoprotocolo,
            updateData.presentoprotocolourl,
            updateData.estadoprotocolo,
            updateData.monitoreoyevaluacion,
            updateData.monitoreoyevaluacionurl,
            updateData.aplicacionevaluacion,
            updateData.aplicacionevaluacionurl,
            updateData.criteriosfactibilidad,
            updateData.criteriosfactibilidadurl,
            updateData.requisitostecnicos,
            updateData.requisitostecnicosurl,
            updateData.criterioseticos,
            updateData.criterioseticosurl,
            usuario,
            id
        );

        res.json({
            success: true,
            message: "Lineamientos actualizados correctamente",
            data: updatedData,
            files: fileUpdates,
            flags: booleanUpdates
        });

    } catch (error) {
        console.error('Error al actualizar lineamientos:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};