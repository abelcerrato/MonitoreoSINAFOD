import { bucket } from '../firebase.config.js';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { pool } from '../db.js'
import { getCicloAcademicoM, getNivelAcademicoM } from "../models/Academico.models.js";
import { getFormacionM, getIdFormacionM, postFormacionM, postLineamientosFormacionM, putFormacionM, putLineamientosFormacionM } from '../models/formacion.models.js';

//-----------------------------------------------------------------------------------------------------------
// Obtener formacion
export const getFormacionC = async (req, res) => {
    try {
        const formacion = await getFormacionM();
        res.json(formacion)
    } catch (error) {
        console.error('Error al obtener registros de formacion:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}

//-----------------------------------------------------------------------------------------------------------
// Obtener formacion por id
export const getIdFormacionC = async (req, res) => {
    const { id } = req.params
    try {

        const formacion = await getIdFormacionM(id);

        if (!formacion) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(formacion)
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//-------------------------------------------------------------------------------------------------------------------------
// Crearformacion sin lineamientos

export const postFormacionC = async (req, res) => {
    const { formacion, tipoactividad, existeconvenio, institucionconvenio, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion,
        modalidad, plataforma, duracion, estado, funciondirigido, prebasica, basica, media, primerciclo, segundociclo, tercerciclo, fechainicio, fechafinal,
        participantesprog, espaciofisico, direccion, zona, socializaron, observacion, creadopor } = req.body
    console.log("datos", req.body);

    try {

        const formacionP = await postFormacionM(formacion, tipoactividad, existeconvenio, institucionconvenio, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion,
            modalidad, plataforma, duracion, estado, funciondirigido, prebasica, basica, media, primerciclo, segundociclo, tercerciclo, fechainicio, fechafinal,
            participantesprog, espaciofisico, direccion, zona, socializaron, observacion, creadopor
        )

        res.json({ message: "Formacion agregada exitiosamente", id: formacionP.id });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//-----------------------------------------------------------------------------------------------------------
// Actualizar formacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putFormacionC = async (req, res) => {
    const { id } = req.params;
    const {formacion, tipoactividad, existeconvenio, institucionconvenio, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, 
                modalidad, plataforma, duracion, estado, funciondirigido, prebasica, basica, media, primerciclo, segundociclo, tercerciclo, fechainicio, fechafinal, 
                participantesprog, espaciofisico, direccion, zona, socializaron, observacion, modificadopor } = req.body
    try {
        const formacionP = await putFormacionM(formacion, tipoactividad, existeconvenio, institucionconvenio, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, 
                modalidad, plataforma, duracion, estado, funciondirigido, prebasica, basica, media, primerciclo, segundociclo, tercerciclo, fechainicio, fechafinal, 
                participantesprog, espaciofisico, direccion, zona, socializaron, observacion, modificadopor, id)

        res.json({ message: "Formacion actualizada exitosamente ", user: formacionP });
    } catch (error) {
        console.error('Error al actualizar la formacion: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}





// Configuración de multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Middleware para manejar la subida de archivos
export const uploadLineamientosFormacion = upload.fields([
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

export const postLineamientosFormacionC = async (req, res) => {
    const {formacion, criteriosfactibilidad, requisitostecnicos,  criterioseticos, creadopor } = req.body;

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
        const result = await postLineamientosFormacionM(
            formacion,
            criteriosfactibilidad,
            null, // criteriosfactibilidadurl
            requisitostecnicos,
            null, // requisitostecnicosurl
            criterioseticos,
            null, // criterioseticosurl
            usuario
        );

        const idformacion = result.id;

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
                const filename = `${idformacion}_${date}-${file.originalname}`;

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
        await putLineamientosFormacionM(
        
            booleanUpdates.criteriosfactibilidad || false,
            fileUpdates.criteriosfactibilidadurl || null,
            booleanUpdates.requisitostecnicos || false,
            fileUpdates.requisitostecnicosurl || null,
            booleanUpdates.criterioseticos || false,
            fileUpdates.criterioseticosurl || null,
            usuario,
            idformacion
        );
        res.json({
            success: true,
            message: "Lineamientos de formacion actualizados correctamente",
            id: idformacion,
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

export const putLineamientosFormacionC = async (req, res) => {
    const { id } = req.params;
    const {
    } = req.body;

    const files = req.files || {};
    const d = new Date();
    const date = [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100]
        .map(n => n.toString().padStart(2, '0'))
        .join('-');

    try {

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
            'SELECT * FROM formacion WHERE id = $1',
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
            formacion: accionformacion || currentData.formacion,
            criteriosfactibilidad: booleanUpdates.criteriosfactibilidad ?? currentData.criteriosfactibilidad,
            criteriosfactibilidadurl: fileUpdates.criteriosfactibilidadurl ?? null,
            requisitostecnicos: booleanUpdates.requisitostecnicos ?? currentData.requisitostecnicos,
            requisitostecnicosurl: fileUpdates.requisitostecnicosurl ?? null,
            criterioseticos: booleanUpdates.criterioseticos ?? currentData.criterioseticos,
            criterioseticosurl: fileUpdates.criterioseticosurl ?? null
        };

        // 7. Actualizar en la base de datos
        const updatedData = await putLineamientosFormacionM(
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
            message: "Lineamientos de formacion actualizados correctamente",
            data: updatedData,
            files: fileUpdates,
            flags: booleanUpdates
        });

    } catch (error) {
        console.error('Error al actualizar lineamientos de la formacion:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};