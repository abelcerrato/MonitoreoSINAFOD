// routes/uploadRoutes.js
import express from "express";
import { previewDocumento, downloadDocumento, deleteDocumento } from "../controllers/uploads.controller.js";

// upload, uploadDocumento,
const router = express.Router();


// 'documentos' es el nombre del campo en el formulario, 10 es el límite de archivos
// router.post("/upload-documento", upload.array("documentos", 10), uploadDocumento);
router.get('/download/:filename', downloadDocumento);
router.delete('/delete/:filename', deleteDocumento);
router.get('/preview/:filename', previewDocumento);

export default router;
