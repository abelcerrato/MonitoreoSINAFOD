import { bucket } from '../firebase.config.js';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { pool } from '../db.js'
import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getIdInvestigacionM, getInvestigacionM, postInvestigacionM, postLineamientosInvesatigacionM, putInvestigacionM, putLineamientosInvesatigacionM } from "../models/investigacion.models.js";


//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion
export const getInvestigacionC = async (req, res) => {
    try {
        const invest = await getInvestigacionM();
        res.json(invest)
    } catch (error) {
        console.error('Error al obtener registros de investigacion:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}

//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion por id
export const getIdInvestigacionC = async (req, res) => {
    const { id } = req.params
    try {
        const invest = await getIdInvestigacionM(id);
        if (!invest) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        res.json(invest)
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//-------------------------------------------------------------------------------------------------------------------------
// Crear investigacion sin lineamientos

export const postInvestigacionC = async (req, res) => {
    const { investigacion, tipoactividad, existeconvenio, institucionconvenio,
        presupuesto, duracion, funciondirigido, prebasica, basica, media,
        fechainicio, fechafinal, direccion, socializaron, observacion, creadopor } = req.body
    console.log("datos", req.body);

    try {
        const invest = await postInvestigacionM(investigacion, tipoactividad, existeconvenio, institucionconvenio,
            presupuesto, duracion, funciondirigido, prebasica, basica, media,
            fechainicio, fechafinal, direccion, socializaron, observacion, creadopor
        )

        res.json({ message: "Investigacion  agregada exitosamente", id: invest.id });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//-----------------------------------------------------------------------------------------------------------
// Actualizar investigacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putInvestigacionC = async (req, res) => {
    const { id } = req.params;
    const { investigacion, tipoactividad, existeconvenio, institucionconvenio,
        presupuesto, duracion, funciondirigido, prebasica, basica, media,
        fechainicio, fechafinal, direccion, socializaron, observacion, modificadopor } = req.body
console.log(req.body);

    try {
        const invest = await putInvestigacionM(investigacion, tipoactividad, existeconvenio, institucionconvenio,
            presupuesto, duracion, funciondirigido, prebasica, basica, media,
            fechainicio, fechafinal, direccion, socializaron, observacion, modificadopor, id)
        res.json({ message: "Investigacion actualizada exitosamente", user: invest });
    } catch (error) {
        console.error('Error al actualizar la investigacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}

//-----------------------------------------------------------------------------------------------------------

// Configuración de multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Middleware para manejar la subida de archivos
export const uploadLineamientosInvestigacion = upload.fields([
    { name: 'presentoprotocolourl', maxCount: 1 },
    { name: 'monitoreoyevaluacionurl', maxCount: 1 },
    { name: 'aplicacionevaluacionurl', maxCount: 1 },
    { name: 'divulgacionresultadosurl', maxCount: 1 },
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


//-----------------------------------------------------------------------------------------------------------
// Crear lineamientos de investigacion
export const postLineamientosInvestigacionC = async (req, res) => {
    const {investigacion,  presentoprotocolo, estadoprotocolo,
        monitoreoyevaluacion, aplicacionevaluacion,  divulgacionresultados, creadopor
        
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map((n) => n.toString().padStart(2, '0'))
        .join('-');

    try {

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
        const result = await postLineamientosInvesatigacionM(
            investigacion,
            presentoprotocolo,
            null, // presentoprotocolourl
            estadoprotocolo,
            monitoreoyevaluacion,
            null, // monitoreoyevaluacionurl
            aplicacionevaluacion,
            null, // aplicacionevaluacionurl
            divulgacionresultados,
            null, // divulgacionresultadosurl
            creadopor

        );

        const idInvest = result.id;

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
                        uploader: creadopor,
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
                const filename = `${idInvest}_${date}-${file.originalname}`;

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
        await putLineamientosInvesatigacionM(
            booleanUpdates.presentoprotocolo || false,
            fileUpdates.presentoprotocolourl || null,
            estadoprotocolo,
            booleanUpdates.monitoreoyevaluacion || false,
            fileUpdates.monitoreoyevaluacionurl || null,
            booleanUpdates.aplicacionevaluacion || false,
            fileUpdates.aplicacionevaluacionurl || null,
            booleanUpdates.divulgacionresultados || false,
            fileUpdates.divulgacionresultadosurl || null,
            creadopor,
            idInvest
        );
        res.json({
            success: true,
            message: "Lineamientos actualizados correctamente",
            id: idInvest,
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
// Actualizar lineamientos de investigacion
export const putLineamientosInvestigacionC = async (req, res) => {
    const { id } = req.params;
    const {
        presentoprotocolo,
        estadoprotocolo,
        monitoreoyevaluacion,
        aplicacionevaluacion,
        investigacion,
        modificadopor,
        presentoprotocolourl,
        monitoreoyevaluacionurl,
        aplicacionevaluacionurl,
        divulgacionresultados,
        divulgacionresultadosurl,
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map(n => n.toString().padStart(2, '0'))
        .join('-');

    try {

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
            'SELECT * FROM investigacion WHERE id = $1',
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
                        uploader: modificadopor,
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
            'divulgacionresultadosurl',
            
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
            divulgacionresultados: booleanUpdates.divulgacionresultados ?? currentData.divulgacionresultados,
            divulgacionresultadosurl: fileUpdates.divulgacionresultadosurl ?? null,
            investigacion: investigacion || currentData.investigacion
        };

        // 7. Actualizar en la base de datos
        const updatedData = await putLineamientosInvesatigacionM(
            investigacion,
            updateData.presentoprotocolo,
            updateData.presentoprotocolourl,
            updateData.estadoprotocolo,
            updateData.monitoreoyevaluacion,
            updateData.monitoreoyevaluacionurl,
            updateData.aplicacionevaluacion,
            updateData.aplicacionevaluacionurl,
            updateData.divulgacionresultados,
            updateData.divulgacionresultadosurl,
            modificadopor,
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