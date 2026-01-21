import path from "path"; // Importar path para manejar rutas de archivos
import fs from "fs"; // Importar fs para manejar el sistema de archivos
import multer from "multer"; // Importar multer para manejar la subida de archivos
import { pool } from "../db.js"; // Importar la conexión a la base de datos
import {
  getIdInvestigacionM,
  getInvestigacionM,
  postInvestigacionM,
  postLineamientosInvesatigacionM,
  putInvestigacionM,
  putLineamientosInvesatigacionM,
} from "../models/investigacion.models.js"; // Importar los modelos para la investigación


// ======================================================
// CONFIGURACIÓN DE UPLOAD LOCAL
// ======================================================

const UPLOAD_DIR = path.resolve("uploads/investigacion");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

export const uploadLineamientosInvestigacion = upload.fields([
  { name: "presentoprotocolourl", maxCount: 1 },
  { name: "monitoreoyevaluacionurl", maxCount: 1 },
  { name: "aplicacionevaluacionurl", maxCount: 1 },
  { name: "divulgacionresultadosurl", maxCount: 1 },
]);

// ======================================================
// VALIDACIONES
// ======================================================

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ======================================================
// INVESTIGACION
// ======================================================



//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion
export const getInvestigacionC = async (req, res) => {
  try {
    const invest = await getInvestigacionM();
    res.json(invest);
  } catch (error) {
    console.error("Error al obtener registros de investigacion:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};

//-----------------------------------------------------------------------------------------------------------
// Obtener investigacion o capacitacion por id
export const getIdInvestigacionC = async (req, res) => {
  const { id } = req.params;
  try {
    const invest = await getIdInvestigacionM(id);
    if (!invest) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    res.json(invest);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//-------------------------------------------------------------------------------------------------------------------------
// Crear investigacion sin lineamientos
export const postInvestigacionC = async (req, res) => {
  const {
    investigacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    presupuesto,
    duracion,
    funciondirigido,
    prebasica,
    basica,
    media,
    fechainicio,
    fechafinal,
    direccion,
    socializaron,
    observacion,
    creadopor,
    tipomoneda,
  } = req.body;
  console.log("datos", req.body);

  try {
    const invest = await postInvestigacionM(
      investigacion,
      tipoactividad,
      existeconvenio,
      institucionconvenio,
      presupuesto,
      duracion,
      funciondirigido,
      prebasica,
      basica,
      media,
      fechainicio,
      fechafinal,
      direccion,
      socializaron,
      observacion,
      creadopor,
      tipomoneda
    );

    res.json({
      message: "Investigacion  agregada exitosamente",
      id: invest.id,
    });
  } catch (error) {
    console.error("Error al insertar", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//-----------------------------------------------------------------------------------------------------------
// Actualizar investigacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putInvestigacionC = async (req, res) => {
  const { id } = req.params;
  const {
    investigacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    presupuesto,
    duracion,
    funciondirigido,
    prebasica,
    basica,
    media,
    fechainicio,
    fechafinal,
    direccion,
    socializaron,
    observacion,
    modificadopor,
    tipomoneda,
  } = req.body;
  console.log(req.body);

  try {
    const invest = await putInvestigacionM(
      investigacion,
      tipoactividad,
      existeconvenio,
      institucionconvenio,
      presupuesto,
      duracion,
      funciondirigido,
      prebasica,
      basica,
      media,
      fechainicio,
      fechafinal,
      direccion,
      socializaron,
      observacion,
      modificadopor,
      tipomoneda,
      id
    );
    res.json({
      message: "Investigacion actualizada exitosamente",
      user: invest,
    });
  } catch (error) {
    console.error("Error al actualizar la investigacion: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//-----------------------------------------------------------------------------------------------------------

// Crear lineamientos de investigacion

export const postLineamientosInvestigacionC = async (req, res) => {
  const files = req.files || {};
  const {
    investigacion,
    presentoprotocolo,
    estadoprotocolo,
    monitoreoyevaluacion,
    aplicacionevaluacion,
    divulgacionresultados,
    creadopor,
  } = req.body;

  try {
    for (const key in files) {
      const file = files[key][0];
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({ error: "Tipo de archivo no permitido" });
      }
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "Archivo excede 10MB" });
      }
    }

    const result = await postLineamientosInvesatigacionM(
      investigacion,
      presentoprotocolo,
      null,
      estadoprotocolo,
      monitoreoyevaluacion,
      null,
      aplicacionevaluacion,
      null,
      divulgacionresultados,
      null,
      creadopor
    );

    const idInvest = result.id;
    const fileUpdates = {};
    const booleanUpdates = {};

    for (const key in files) {
      const file = files[key][0];
      fileUpdates[key] = `uploads/investigacion/${file.filename}`;
      booleanUpdates[key.replace("url", "")] = true;
    }

    await putLineamientosInvesatigacionM(
      investigacion,
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
      id: idInvest,
      files: fileUpdates,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//-----------------------------------------------------------------------------------------------------------
// Actualizar lineamientos de investigacion
export const putLineamientosInvestigacionC = async (req, res) => {
  const { id } = req.params;
  const { investigacion, modificadopor } = req.body;
  const files = req.files || {};

  try {
    const current = await pool.query(
      "SELECT * FROM investigacion WHERE id = $1",
      [id]
    );

    if (!current.rows[0]) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    const currentData = current.rows[0];
    const fileUpdates = {};
    const booleanUpdates = {};

    const fields = [
      "presentoprotocolourl",
      "monitoreoyevaluacionurl",
      "aplicacionevaluacionurl",
      "divulgacionresultadosurl",
    ];

    for (const field of fields) {
      if (files[field]) {
        const file = files[field][0];
        fileUpdates[field] = `uploads/investigacion/${file.filename}`;
        booleanUpdates[field.replace("url", "")] = true;
      } else if (req.body[field] === "null" && currentData[field]) {
        const oldPath = path.resolve(currentData[field]);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        fileUpdates[field] = null;
        booleanUpdates[field.replace("url", "")] = false;
      } else {
        fileUpdates[field] = currentData[field];
        booleanUpdates[field.replace("url", "")] =
          currentData[field] !== null;
      }
    }

    await putLineamientosInvesatigacionM(
      investigacion || currentData.investigacion,
      booleanUpdates.presentoprotocolo,
      fileUpdates.presentoprotocolourl,
      req.body.estadoprotocolo || currentData.estadoprotocolo,
      booleanUpdates.monitoreoyevaluacion,
      fileUpdates.monitoreoyevaluacionurl,
      booleanUpdates.aplicacionevaluacion,
      fileUpdates.aplicacionevaluacionurl,
      booleanUpdates.divulgacionresultados,
      fileUpdates.divulgacionresultadosurl,
      modificadopor,
      id
    );

    res.json({
      success: true,
      files: fileUpdates,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
