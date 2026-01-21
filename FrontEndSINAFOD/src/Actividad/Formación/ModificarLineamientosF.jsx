/*
 * Este archivo contiene el código del formulario para actualizar los lineamientos
 * asociados a una acción formativa registrada en el sistema.
 * Permite editar el nombre de la formación, visualizar documentos cargados,
 * reemplazarlos, eliminarlos y descargarlos.
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";

/*
 * Estilo para un input tipo file invisible,
 * usado dentro de botones personalizados.
 */
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ModificarLineamientos = () => {
  const { user } = useUser(); // Datos del usuario logueado
  const { id } = useParams(); // ID del registro a editar
  const navigate = useNavigate();

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    formacion: "",
    criteriosfactibilidadurl: null,
    requisitostecnicosurl: null,
    criterioseticosurl: null,
    formacioninvest: "",
  });

  // Archivos existentes almacenados previamente en el servidor
  const [existingFiles, setExistingFiles] = useState({
    criteriosfactibilidadurl: null,
    requisitostecnicosurl: null,
    criterioseticosurl: null,
  });

  // Vista previa de archivos
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [currentPreviewField, setCurrentPreviewField] = useState(null);

  /*
   * Al cargar el componente, se obtienen los detalles del registro
   * incluyendo el nombre y los archivos previamente subidos.
   */
  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/investformacionC/${id}`,
        );
        const data = response.data[0];

        setFormData({
          ...data,
          formacion: data.formacion,
          fechainicio: data.fechainicio ? data.fechainicio.split("T")[0] : "",
          fechafinal: data.fechafinal ? data.fechafinal.split("T")[0] : "",
        });

        // Asegúrate de que los nombres de los archivos se establezcan correctamente
        setExistingFiles({
          criteriosfactibilidadurl: data.criteriosfactibilidadurl || null,
          requisitostecnicosurl: data.requisitostecnicosurl || null,
          criterioseticosurl: data.criterioseticosurl || null,
        });

        console.log(data);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
    obtenerDetalles();
  }, [id]);

  /* Manejo de cambios de campos de texto */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Manejo de carga de archivos:
   * - Valida formato permitido
   * - Valida tamaño
   * - Actualiza el estado con el nuevo archivo
   * - Limpia el archivo anterior si existía
   */
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Validar tipo de archivo (nueva validación)
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      const fileType = file.type;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Verificar si el tipo o extensión están permitidos
      if (
        !allowedTypes.includes(fileType) &&
        !["pdf", "jpg", "jpeg", "png"].includes(fileExtension)
      ) {
        // Mostrar alerta de error
        Swal.fire({
          title: "Tipo de archivo no permitido",
          text: "Solo se permiten archivos PDF, JPG, JPEG o PNG.",
          icon: "error",
          confirmButtonColor: color.primary.azul,
        });

        // Limpiar el input file
        e.target.value = "";
        return;
      }

      // Validación opcional de tamaño (descomenta si lo necesitas)

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: "Archivo demasiado grande",
          text: `El tamaño máximo permitido es ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
          icon: "error",
          confirmButtonColor: color.primary.azul,
        });
        e.target.value = "";
        return;
      }
    }

    // Actualiza formData con el archivo (esto ya lo tenías)
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Limpiar el archivo existente cuando se selecciona uno nuevo
    setExistingFiles((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  /*
   * Descargar archivo desde el backend.
   * Tiene manejo de nombre real del archivo.
   */
  const handleDownload = async (file) => {
  try {

    const filename = file.split("/").pop();

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/documento/download/formacion/${encodeURIComponent(filename)}`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error al descargar:", error);
    Swal.fire("Error", "No se pudo descargar el archivo", "error");
  }
};

  /*
   * Elimina un archivo subido (existente o nuevo).
   * Confirma antes de borrar.
   */
  const handleDeleteFile = (fieldName) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar este archivo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: color.primary.azul,
      cancelButtonColor: color.primary.rojo,
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "No, Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setExistingFiles((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
        setFormData((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
      }
    });
  };

  /*
   * Envía toda la información:
   * - Nombre de la formación
   * - Archivos nuevos o existentes
   * - Controla que haya al menos 3 archivos cargados
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.formacion) {
      Swal.fire("Error", "El título del proyecto es requerido", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("formacion", formData.formacion);
    formDataToSend.append("modificadopor", user.id);
    formDataToSend.append("formacioninvest", "Formación");

    // Contador de archivos subidos
    let uploadedFilesCount = 0;
    const totalRequiredFiles = 3;
    const fileFields = [
      "criteriosfactibilidadurl",
      "requisitostecnicosurl",
      "criterioseticosurl",
    ];

    fileFields.forEach((field) => {
      if (formData[field]) {
        formDataToSend.append(field, formData[field]);
        uploadedFilesCount++;
      } else if (existingFiles[field]) {
        formDataToSend.append(field, existingFiles[field]);
        uploadedFilesCount++;
      } else {
        formDataToSend.append(field, "null");
      }
    });

    // Verificar si faltan archivos
    if (uploadedFilesCount < totalRequiredFiles) {
      const result = await Swal.fire({
        title: "Lineamientos Incompletos",
        text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos. ¿Deseas continuar con la actualización?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "Sí, Actualizar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        return; // No continuar si el usuario cancela
      }
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/lineamientosformacion/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Swal.fire({
        title: "¡Actualización!",
        text: "Lineamientos actualizados correctamente",
        icon: "success",
        timer: 6000,
        confirmButtonColor: color.primary.azul,
      });

      // navigate(`/Actualizar_Formación/${id}`);
      navigate("/Listado_De_Acciones_Formativas");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire("Error", "Hubo un problema al guardar los datos", "error");
    }
  };

  /*
   * Renderiza cada campo de archivo con:
   * - Subida
   * - Vista previa
   * - Descarga
   * - Eliminación
   */
  const renderFileField = (fieldName, label) => {
    const existingFile = existingFiles[fieldName];
    const newFile = formData[fieldName];

    const getDisplayName = (filePath) => {
      if (!filePath) return "";
      // Obtener solo la última parte de la ruta
      const filename = filePath.split("/").pop();
      // Separar por "-" y quitar el primer segmento (timestamp)
      return filename.split("-").slice(1).join("-");
    };

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>

        {/* Mostrar botón solo si NO hay archivo cargado */}
        {!(existingFile || newFile) && (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2, backgroundColor: color.primary.azul }}
          >
            Seleccionar archivo
            <VisuallyHiddenInput
              type="file"
              name={fieldName}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </Button>
        )}

        {(existingFile || newFile) && (
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
              p: 1,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mr: 2,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: color.primary.azul,
                  },
                }}
                onClick={() =>
                  handlePreview(existingFile || newFile, fieldName)
                }
              >
                {existingFile ? getDisplayName(existingFile) : newFile.name}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Grid>
                  <IconButton
                    onClick={() =>
                      handlePreview(existingFile || newFile, fieldName)
                    }
                    size="small"
                    sx={{ ml: "auto", color: color.primary.azul }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton
                    onClick={() => handleDownload(existingFile)}
                    sx={{ color: color.primary.azul }}
                    size="small"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => {
                      if (existingFile) {
                        handleDeleteFile(fieldName);
                      } else {
                        setFormData((prev) => ({ ...prev, [fieldName]: null }));
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  /*
   * Vista previa de archivos:
   * - PDF dentro de iframe
   * - Imágenes
   * - Otros archivos con opción a descarga
   */
const handlePreview = async (file, fieldName) => {
  setCurrentPreviewField(fieldName);

  try {
    if (file instanceof File) {
      // Archivos nuevos
      if (file.type === "application/pdf") {
        setPreviewContent({ type: "pdf", url: URL.createObjectURL(file) });
      } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) =>
          setPreviewContent({ type: "image", url: e.target.result });
        reader.readAsDataURL(file);
      } else {
        setPreviewContent({ type: "other", name: file.name });
      }
    } else {
      // Archivos ya subidos
      //  Extraer tipo y nombre del archivo
      const filename = file.split("/").pop();

      const fileUrl = `${process.env.REACT_APP_API_URL}/documento/preview/formacion/${encodeURIComponent(filename)}`;

      const ext = filename.split(".").pop().toLowerCase();
      if (ext === "pdf") setPreviewContent({ type: "pdf", url: fileUrl });
      else if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
        setPreviewContent({ type: "image", url: fileUrl });
      else setPreviewContent({ type: "other", name: filename, url: fileUrl });
    }

    setPreviewOpen(true);
  } catch (error) {
    console.error("Error al generar vista previa:", error);
    Swal.fire("Error", "No se pudo generar la vista previa", "error");
  }
};
  return (
    <Dashboard>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Typography
              variant="h4"
              sx={{ color: color.primary.azul, fontWeight: "bold" }}
            >
              Actualizar de Lineamientos para la Acción Formativa
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: color.primary.rojo,
                color: color.primary.rojo,
              }}
              onClick={() => navigate("/Listado_De_Acciones_Formativas")}
            >
              Cerrar
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={5} mt={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1">
              {" "}
              Nombre de la Acción Formativa
            </Typography>
            <TextField
              fullWidth
              name="formacion"
              value={formData.formacion}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}></Grid>

          {renderFileField(
            "criteriosfactibilidadurl",
            "Documento de Cumplimientos de los Criterios de Factibilidad",
          )}

          {renderFileField(
            "requisitostecnicosurl",
            "Documento de Cumplimiento de los Requisitos Técnicos",
          )}
          {renderFileField(
            "criterioseticosurl",
            " Documento de Cumplimientos de los Criterios Éticos",
          )}
        </Grid>

        <Box sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}>
          {/*  <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.rojo }}
                        startIcon={<FastForwardOutlinedIcon />}
                        onClick={() => navigate("/Investigación")}
                    >
                        Omitir
                    </Button> */}
          <Button
            variant="contained"
            sx={{ backgroundColor: color.primary.azul, ml: 5 }}
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </Box>

        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Vista previa - {currentPreviewField}
            <IconButton
              onClick={() => setPreviewOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {previewContent?.type === "pdf" && (
              <iframe
                src={previewContent.url}
                width="100%"
                height="500px"
                style={{ border: "none" }}
                title="Vista previa PDF"
              />
            )}

            {previewContent?.type === "image" && (
              <img
                src={previewContent.url}
                alt="Vista previa"
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            )}

            {previewContent?.type === "other" && (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <DescriptionIcon sx={{ fontSize: 60, color: "primary.main" }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {previewContent.name}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => window.open(previewContent.url, "_blank")}
                >
                  Descargar archivo
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Dashboard>
  );
};

export default ModificarLineamientos;
