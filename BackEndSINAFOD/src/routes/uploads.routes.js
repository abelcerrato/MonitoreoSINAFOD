// routes/uploadRoutes.js
import express from "express";
import { upload, uploadDocumento } from "../controllers/uploads.controller.js";

const router = express.Router();

router.post("/upload-documento", upload.single("documento"), uploadDocumento);

export default router;
