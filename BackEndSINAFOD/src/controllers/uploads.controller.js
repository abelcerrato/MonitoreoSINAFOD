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

export const downloadDocumento = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo no existe' });
  }

  // Decodificar caracteres especiales en el nombre del archivo
  const decodedFilename = decodeURIComponent(filename);
  
  // Obtener el nombre original sin la fecha (opcional)
  const originalFilename = decodedFilename.split('-').slice(4).join('-');

  // Configurar cabeceras para forzar la descarga
  res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  // Stream el archivo al cliente
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (err) => {
      console.error('Error al leer el archivo:', err);
      res.status(500).end();
  });
  fileStream.pipe(res);
};

export const deleteDocumento = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo no existe' });
  }

  fs.unlink(filePath, (err) => {
      if (err) {
          return res.status(500).json({ error: 'Error al eliminar el archivo' });
      }
      res.json({ success: true, message: 'Archivo eliminado correctamente' });
  });
};