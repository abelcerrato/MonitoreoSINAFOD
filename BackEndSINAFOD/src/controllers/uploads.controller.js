import path from "path";
import fs from "fs";
import multer from "multer";

// Crear la carpeta uploads si no existe
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


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


//Crear una instancia de upload
export const upload = multer({ storage });


// Controlador para manejar la subida de documentos
export const uploadDocumento = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const filesData = req.files.map(file => ({
        path: file.path,
        filename: file.originalname,
    }));

    res.json({
        success: true,
        files: filesData,
    });
};