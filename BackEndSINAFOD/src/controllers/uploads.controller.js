import fs from "fs";
import path from "path";


//-----------------------------------------------
// PREVISUALIZAR ARCHIVO
//----------------------------------------------
export const previewDocumento = (req, res) => {
  const { tipo, filename } = req.params;
console.log("llega",req.params);

  // Ruta completa
  const filePath = path.join(process.cwd(), "uploads", tipo, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  // Determinar Content-Type
  const ext = path.extname(filePath).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".pdf") contentType = "application/pdf";
  else if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext))
    contentType = `image/${ext.replace(".", "")}`;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    console.error("Error al leer el archivo:", err);
    res.status(500).end();
  });
};



//-----------------------------------------------
// DESCARGAR ARCHIVO
//----------------------------------------------
export const downloadDocumento = (req, res) => {
  const { tipo, filename } = req.params;

  const filePath = path.join(process.cwd(), "uploads", tipo, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "El archivo no existe" });
  }

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/octet-stream");

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    console.error("Error al leer el archivo:", err);
    res.status(500).end();
  });
};


//-----------------------------------------------
// ELIMINAR ARCHIVO
//----------------------------------------------
export const deleteDocumento = (req, res) => {
  const { tipo, filename } = req.params;

  if (!["formacion", "investigacion"].includes(tipo)) {
    return res.status(400).json({ error: "Tipo no válido" });
  }

  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.resolve("uploads", tipo, decodedFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "El archivo no existe" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al eliminar el archivo" });
    }

    res.json({
      success: true,
      message: "Archivo eliminado correctamente",
    });
  });
};

