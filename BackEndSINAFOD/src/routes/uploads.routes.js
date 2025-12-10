import express from "express"; // Importar express
import { previewDocumento, downloadDocumento, deleteDocumento } from "../controllers/uploads.controller.js"; // Importar los controladores para las subidas y descargas de archivos

const router = express.Router(); // Crear una instancia del router de express

router.get('/download/:filename', downloadDocumento); // Ruta para descargar un documento
router.delete('/delete/:filename', deleteDocumento); // Ruta para eliminar un documento
router.get('/preview/:filename', previewDocumento); // Ruta para previsualizar un documento

export default router; // Exportar el enrutador