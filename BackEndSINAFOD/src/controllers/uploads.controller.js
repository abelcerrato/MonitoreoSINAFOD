import path from "path";
import fs from "fs";
import multer from "multer";
import mime from 'mime-types';
import admin from 'firebase-admin';
import { bucket } from '../firebase.config.js';


/* // Crear la carpeta uploads si no existe
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
} */


/* // Configuración de almacenamiento con multer
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
 */

//Crear una instancia de upload
// export const upload = multer({ storage });


// Controlador para manejar la subida de documentos
/* export const uploadDocumento = (req, res) => {
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
} */;

/* export const downloadDocumento = (req, res) => {
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
}; */

export const downloadDocumento = async (req, res) => {
  const { filename } = req.params;
  console.log(req.params);
  
  try {
    // Decodificar caracteres especiales en el nombre del archivo
    const decodedFilename = decodeURIComponent(filename);
    
    // Obtener el nombre original sin la fecha (opcional)
    const originalFilename = decodedFilename.split('-').slice(4).join('-');

    // Obtener una referencia al archivo en Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(decodeURIComponent(filename)); // Ajusta la ruta según tu estructura en Firebase

    // Verificar si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: 'El archivo no existe' });
    }

    // Configurar cabeceras para forzar la descarga
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream el archivo al cliente
    file.createReadStream()
      .on('error', (err) => {
        console.error('Error al leer el archivo:', err);
        res.status(500).end();
      })
      .pipe(res);
  } catch (err) {
    console.error('Error al descargar el documento:', err);
    res.status(500).json({ error: 'Error al descargar el documento' });
  }
};

/* export const previewDocumento = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'El archivo no existe' });
  }

  const decodedFilename = decodeURIComponent(filename);
  const mimeType = mime.lookup(decodedFilename) || 'application/octet-stream';

  // Configurar cabeceras apropiadas para visualización
  res.setHeader('Content-Type', mimeType);
  
  // Para PDFs e imágenes permitimos visualización en línea
  if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
    res.setHeader('Content-Disposition', `inline; filename="${decodedFilename}"`);
  } else {
    // Para otros tipos, forzamos descarga
    res.setHeader('Content-Disposition', `attachment; filename="${decodedFilename}"`);
  }

  // Stream el archivo al cliente
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (err) => {
    console.error('Error al leer el archivo:', err);
    res.status(500).end();
  });
  fileStream.pipe(res);
};
 */


export const previewDocumento = async (req, res) => {
  const { filename } = req.params;
  console.log(req.params);
  
  try {
    const file = bucket.file(decodeURIComponent(filename));
    const [exists] = await file.exists();
    
    if (!exists) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // Crear stream de lectura
    const readStream = file.createReadStream();
    
    // Obtener metadatos para el Content-Type
    const [metadata] = await file.getMetadata();
    
    // Configurar headers
    res.setHeader('Content-Type', metadata.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Pipe el stream a la respuesta
    readStream.pipe(res);
    
    // Manejar errores del stream
    readStream.on('error', (error) => {
      console.error('Error al leer el archivo:', error);
      res.status(500).end();
    });

  } catch (error) {
    console.error('Error al obtener el documento:', error);
    res.status(500).json({ 
      error: 'Error al recuperar el documento',
      details: error.message 
    });
  }
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