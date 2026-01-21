import path from "path"; // Importar path para manejar rutas de archivos
import fs from "fs"; // Importar fs para manejar el sistema de archivos
import multer from "multer"; // Importar multer para manejar la subida de archivos
import { pool } from "../db.js"; // Importar la conexión a la base de datos
import {
  getFormacionM,
  getIdFormacionM,
  postFormacionM,
  postLineamientosFormacionM,
  putFormacionM,
  putLineamientosFormacionM,
} from "../models/formacion.models.js"; // Importar los modelos para la formación
 

// ======================================================
// CONFIGURACIÓN DE UPLOAD LOCAL
// ======================================================

const UPLOAD_DIR = path.resolve("uploads/formacion");

// Crear carpeta si no existe
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

export const uploadLineamientosFormacion = upload.fields([
  { name: "criteriosfactibilidadurl", maxCount: 1 },
  { name: "requisitostecnicosurl", maxCount: 1 },
  { name: "criterioseticosurl", maxCount: 1 },
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



//-----------------------------------------------------------------------------------------------------------
// Obtener formacion
export const getFormacionC = async (req, res) => {
  try {
    const formacion = await getFormacionM();
    res.json(formacion);
  } catch (error) {
    console.error("Error al obtener registros de formacion:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};

//-----------------------------------------------------------------------------------------------------------
// Obtener formacion por id
export const getIdFormacionC = async (req, res) => {
  const { id } = req.params;
  try {
    const formacion = await getIdFormacionM(id);

    if (!formacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(formacion);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//-------------------------------------------------------------------------------------------------------------------------
// Crear formacion sin lineamientos

export const postFormacionC = async (req, res) => {
  const {
    formacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    institucionresponsable,
    responsablefirmas,
    ambitoformacion,
    tipoformacion,
    modalidad,
    plataforma,
    duracion,
    estado,
    funciondirigido,
    prebasica,
    basica,
    media,
    primerciclo,
    segundociclo,
    tercerciclo,
    fechainicio,
    fechafinal,
    participantesprog,
    espaciofisico,
    direccion,
    zona,
    socializaron,
    observacion,
    creadopor,
  } = req.body;
  console.log("datos", req.body);

  try {
    const formacionP = await postFormacionM(
      formacion,
      tipoactividad,
      existeconvenio,
      institucionconvenio,
      institucionresponsable,
      responsablefirmas,
      ambitoformacion,
      tipoformacion,
      modalidad,
      plataforma,
      duracion,
      estado,
      funciondirigido,
      prebasica,
      basica,
      media,
      primerciclo,
      segundociclo,
      tercerciclo,
      fechainicio,
      fechafinal,
      participantesprog,
      espaciofisico,
      direccion,
      zona,
      socializaron,
      observacion,
      creadopor
    );

    res.json({
      message: "Formacion agregada exitiosamente",
      id: formacionP.id,
    });
  } catch (error) {
    console.error("Error al insertar", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//-----------------------------------------------------------------------------------------------------------
// Actualizar formacion con lineamientos
// Se actualizan los lineamientos y se suben los archivos correspondientes
export const putFormacionC = async (req, res) => {
  const { id } = req.params;
  const {
    formacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    institucionresponsable,
    responsablefirmas,
    ambitoformacion,
    tipoformacion,
    modalidad,
    plataforma,
    duracion,
    estado,
    funciondirigido,
    prebasica,
    basica,
    media,
    primerciclo,
    segundociclo,
    tercerciclo,
    fechainicio,
    fechafinal,
    participantesprog,
    espaciofisico,
    direccion,
    zona,
    socializaron,
    observacion,
    modificadopor,
  } = req.body;
  try {
    const formacionP = await putFormacionM(
      formacion,
      tipoactividad,
      existeconvenio,
      institucionconvenio,
      institucionresponsable,
      responsablefirmas,
      ambitoformacion,
      tipoformacion,
      modalidad,
      plataforma,
      duracion,
      estado,
      funciondirigido,
      prebasica,
      basica,
      media,
      primerciclo,
      segundociclo,
      tercerciclo,
      fechainicio,
      fechafinal,
      participantesprog,
      espaciofisico,
      direccion,
      zona,
      socializaron,
      observacion,
      modificadopor,
      id
    );

    res.json({
      message: "Formacion actualizada exitosamente ",
      user: formacionP,
    });
  } catch (error) {
    console.error("Error al actualizar la formacion: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//Insertar lineamientos de formacion con archivos
export const postLineamientosFormacionC = async (req, res) => {
  const files = req.files || {};
  const { formacion, criteriosfactibilidad, requisitostecnicos, criterioseticos, creadopor } = req.body;

  try {
    // Validar archivos
    for (const key in files) {
      const file = files[key][0];
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({ error: "Tipo de archivo no permitido" });
      }
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "Archivo excede 10MB" });
      }
    }

    // Insert inicial
    const result = await postLineamientosFormacionM(
      formacion,
      criteriosfactibilidad,
      null,
      requisitostecnicos,
      null,
      criterioseticos,
      null,
      creadopor
    );

    const idformacion = result.id;

    const fileUpdates = {};
    const booleanUpdates = {};

    for (const key in files) {
      const file = files[key][0];
      fileUpdates[key] = `uploads/formacion/${file.filename}`;
      booleanUpdates[key.replace("url", "")] = true;
    }

    await putLineamientosFormacionM(
      formacion,
      booleanUpdates.criteriosfactibilidad || false,
      fileUpdates.criteriosfactibilidadurl || null,
      booleanUpdates.requisitostecnicos || false,
      fileUpdates.requisitostecnicosurl || null,
      booleanUpdates.criterioseticos || false,
      fileUpdates.criterioseticosurl || null,
      creadopor,
      idformacion
    );

    res.json({
      success: true,
      id: idformacion,
      files: fileUpdates,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//-----------------------------------------------------------------------------------------------------------
// Actualizar lineamientos de formacion con archivos

export const putLineamientosFormacionC = async (req, res) => {
  const { id } = req.params;
  const { modificadopor, formacion } = req.body;
  const files = req.files || {};

  try {
    const current = await pool.query(
      "SELECT * FROM formacion WHERE id = $1",
      [id]
    );

    if (!current.rows[0]) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    const currentData = current.rows[0];
    const fileUpdates = {};
    const booleanUpdates = {};

    const fields = [
      "criteriosfactibilidadurl",
      "requisitostecnicosurl",
      "criterioseticosurl",
    ];

    for (const field of fields) {
      // Nuevo archivo
      if (files[field]) {
        const file = files[field][0];
        fileUpdates[field] = `uploads/formacion/${file.filename}`;
        booleanUpdates[field.replace("url", "")] = true;
      }
      // Eliminar archivo
      else if (req.body[field] === "null" && currentData[field]) {
        const oldPath = path.resolve(currentData[field]);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        fileUpdates[field] = null;
        booleanUpdates[field.replace("url", "")] = false;
      }
      // Mantener existente
      else {
        fileUpdates[field] = currentData[field];
        booleanUpdates[field.replace("url", "")] =
          currentData[field] !== null;
      }
    }

    await putLineamientosFormacionM(
      formacion || currentData.formacion,
      booleanUpdates.criteriosfactibilidad,
      fileUpdates.criteriosfactibilidadurl,
      booleanUpdates.requisitostecnicos,
      fileUpdates.requisitostecnicosurl,
      booleanUpdates.criterioseticos,
      fileUpdates.criterioseticosurl,
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


