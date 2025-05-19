import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  IconButton,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import TablaPacticantes from "../../Participantes/TablaParticipantes";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";

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

const LineamientosI = () => {
  const { user } = useUser();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  const [errors, setErrors] = useState({
    investigacion: false,
    estadoprotocolo: false,
  });
  const [formData, setFormData] = useState({
    investigacion: "",
    estadoprotocolo: "",
    presentoprotocolourl: null,
    monitoreoyevaluacionurl: null,
    aplicacionevaluacionurl: null,
    formacioninvest: "",
    creadopor: user.id,
    modificadopor: user.id,
  });
  const navigate = useNavigate();

  // Manejar cambios en campos de texto y selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en campos de archivo
  const [fileNames, setFileNames] = useState({
    presentoprotocolourl: "",
    monitoreoyevaluacionurl: "",
    aplicacionevaluacionurl: "",
  });

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

    // Actualiza solo el nombre del archivo correspondiente (esto ya lo tenías)
    setFileNames((prev) => ({
      ...prev,
      [name]: file ? file.name : "",
    }));
  };

  // Referencias para los inputs de archivo
  const fileInputRefs = {
    presentoprotocolourl: React.useRef(null),
    monitoreoyevaluacionurl: React.useRef(null),
    aplicacionevaluacionurl: React.useRef(null),
  };

  const handleRemoveFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
      ...(fieldName === "presentoprotocolourl" && { estadoprotocolo: "" }),
    }));

    setFileNames((prev) => ({
      ...prev,
      [fieldName]: "",
    }));

    // Resetea el input file
    if (fileInputRefs[fieldName].current) {
      fileInputRefs[fieldName].current.value = "";
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Resetear errores
  //   const newErrors = {
  //     investigacion: false,
  //     estadoprotocolo: false
  //   };

  //   let hasError = false;

  //   // Validar si se cargó un archivo en presentoprotocolourl
  //   /*    if (formData.presentoprotocolourl && !formData.estadoprotocolo) {
  //        newErrors.estadoprotocolo = true;
  //        hasError = true;
  //      }
  //   */
  //   // Validación del título del proyecto
  //   if (!formData.investigacion) {
  //     newErrors.investigacion = true;
  //     hasError = true;
  //   }

  //   setErrors(newErrors);

  //   if (hasError) {
  //     Swal.fire("Error", "Por favor complete los campos requeridos", "error");
  //     return;
  //   }

  //   const formDataToSend = new FormData();

  //   // Agregar campos de texto
  //   formDataToSend.append("investigacion", formData.investigacion);
  //   formDataToSend.append(
  //     "estadoprotocolo",
  //     formData.presentoprotocolourl
  //       ? (formData.estadoprotocolo || "Completo")
  //       : "No se presentó"
  //   );

  //   formDataToSend.append("creadopor", user);
  //   formDataToSend.append("modificadopor", user);
  //   formDataToSend.append("formacioninvest", "Investigación");

  //   // Contador de archivos subidos
  //   let uploadedFilesCount = 0;
  //   const totalRequiredFiles = 3;
  //   const fileFields = [
  //     "presentoprotocolourl",
  //     "monitoreoyevaluacionurl",
  //     "aplicacionevaluacionurl",
  //   ];

  //   // Agregar archivos si existen
  //   fileFields.forEach(field => {
  //     if (formData[field]) {
  //       formDataToSend.append(field, formData[field]);
  //       uploadedFilesCount++;
  //     }
  //   });

  //   // Verificar si faltan archivos
  //   if (uploadedFilesCount < totalRequiredFiles) {
  //     const result = await Swal.fire({
  //       title: 'Lineamientos incompletos',
  //       text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos.`,
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: color.primary.azul,
  //       cancelButtonColor: color.primary.rojo,
  //       confirmButtonText: 'Guardar',
  //       cancelButtonText: 'Cancelar',
  //       reverseButtons: true
  //     });

  //     if (!result.isConfirmed) {
  //       return; // No continuar si el usuario cancela
  //     }
  //   }
  //   console.log("Datos que envio", formData);

  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/lineamientos`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     const investCap = response.data.id;
  //     navigate("/Investigación", {
  //       state: { investCap, investigacion: formData.investigacion },
  //     });
  //   } catch (error) {
  //     console.error("Error al enviar los datos:", error);
  //     Swal.fire("Error", "Ocurrió un error al guardar los datos", "error");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear errores
    const newErrors = {
      investigacion: false,
    };

    let hasError = false;

    // Validación del título del proyecto
    if (!formData.investigacion) {
      newErrors.investigacion = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      Swal.fire("Error", "Por favor complete los campos requeridos", "error");
      return;
    }

    const formDataToSend = new FormData();

    // Agregar campos de texto
    formDataToSend.append("investigacion", formData.investigacion);

    formDataToSend.append("creadopor", user.id);
    formDataToSend.append("modificadopor", user.id);
    formDataToSend.append("formacioninvest", "Investigación");

    // Contador de archivos subidos
    let uploadedFilesCount = 0;
    const totalRequiredFiles = 3;
    const fileFields = [
      "presentoprotocolourl",
      "monitoreoyevaluacionurl",
      "aplicacionevaluacionurl",
    ];

    // Agregar archivos si existen
    fileFields.forEach((field) => {
      if (formData[field]) {
        formDataToSend.append(field, formData[field]);
        uploadedFilesCount++;
      }
    });

    // Verificar si faltan archivos
    if (uploadedFilesCount < totalRequiredFiles) {
      const result = await Swal.fire({
        title: "Lineamientos incompletos",
        text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos. ¿Deseas continuar con el registro?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "Sí, Registar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        return; // No continuar si el usuario cancela
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lineamientosinvestigacion`,
        formDataToSend
      );

      navigate("/Investigación", {
        state: {
          investCap: response.data.id,
          investigacion: formData.investigacion,
        },
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire("Error", "Ocurrió un error al guardar los datos", "error");
    }
  };

  const handlePreview = (fieldName) => {
    const file = formData[fieldName];

    if (!file) return;

    if (file instanceof File) {
      const fileType = file.type.split("/")[0];
      const url = URL.createObjectURL(file);

      if (fileType === "application" && file.name.endsWith(".pdf")) {
        setPreviewContent({ type: "pdf", url });
      } else if (fileType === "image") {
        setPreviewContent({ type: "image", url });
      } else {
        setPreviewContent({ type: "other", name: file.name });
      }
    } else {
      // Si es una URL de un archivo existente
      if (file.endsWith(".pdf")) {
        setPreviewContent({
          type: "pdf",
          url: `${process.env.REACT_APP_API_URL}/${file}`,
        });
      } else if (file.match(/\.(jpg|jpeg|png|gif)$/)) {
        setPreviewContent({
          type: "image",
          url: `${process.env.REACT_APP_API_URL}/${file}`,
        });
      } else {
        setPreviewContent({ type: "other", name: file.split("/").pop() });
      }
    }

    setPreviewOpen(true);
  };
  return (
    <>
      <Dashboard>
        <Paper
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
          elevation={3}
        >
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: color.primary.rojo,
                color: color.primary.rojo,
              }}
              onClick={() => navigate("/dashboard")}
            >
              Cerrar
            </Button>
          </Grid>
          <Paper
            maxWidth="lg"
            sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
            elevation={3}
          >
            <Typography
              variant="h4"
              sx={{
                color: color.primary.azul,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "2rem",
                },
              }}
            >
              Registro de Lineamientos para Investigación
            </Typography>

            <Grid container spacing={5} mt={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Título del Proyecto</Typography>
                <TextField
                  fullWidth
                  name="investigacion"
                  value={formData.investigacion}
                  onChange={handleChange}
                  error={errors.investigacion}
                  helperText={
                    errors.investigacion
                      ? "El título del proyecto es requerido"
                      : ""
                  }
                  FormHelperTextProps={{ style: { color: "red" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: errors.investigacion ? "red" : "",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6">
                  Documento del Protocolo del Proyecto de Investigación
                  Educativa
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2, backgroundColor: color.primary.azul }}
                >
                  Seleccionar archivo
                  <VisuallyHiddenInput
                    type="file"
                    name="presentoprotocolourl"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    ref={fileInputRefs.presentoprotocolourl}
                  />
                </Button>
                {formData.presentoprotocolourl && (
                  <Box
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
                    <Typography variant="body2">
                      {formData.presentoprotocolourl.name}
                    </Typography>
                    <IconButton
                      sx={{ color: color.primary.azul, ml: "auto" }}
                      size="small"
                      onClick={() => handlePreview("presentoprotocolourl")}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleRemoveFile("presentoprotocolourl")}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Modal de vista previa */}
            <Dialog
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                Vista previa del documento
                <IconButton
                  onClick={() => setPreviewOpen(false)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      textAlign: "center",
                    }}
                  >
                    <DescriptionIcon
                      sx={{ fontSize: 60, color: color.primary.azul }}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {previewContent.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      No hay vista previa disponible para este tipo de archivo
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, backgroundColor: color.primary.azul }}
                      onClick={() => window.open(previewContent.url, "_blank")}
                    >
                      Descargar archivo
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
          </Paper>
          <Paper
            maxWidth="lg"
            sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{
                color: color.primary.azul,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "2rem",
                },
              }}
            >
              Monitoreo y Seguimiento de la Investigación
            </Typography>

            <Grid container spacing={5} mt={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Documento de Monitoreo y Evaluación
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2, backgroundColor: color.primary.azul }}
                >
                  Seleccionar archivo
                  <VisuallyHiddenInput
                    type="file"
                    name="monitoreoyevaluacionurl"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    ref={fileInputRefs.monitoreoyevaluacionurl}
                  />
                </Button>
                {formData.monitoreoyevaluacionurl && (
                  <Box
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
                    <Typography variant="body2">
                      {formData.monitoreoyevaluacionurl.name}
                    </Typography>
                    <IconButton
                      sx={{ color: color.primary.azul, ml: "auto" }}
                      size="small"
                      onClick={() => handlePreview("monitoreoyevaluacionurl")}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        handleRemoveFile("monitoreoyevaluacionurl")
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Documento de Aplicación de Investigación
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2, backgroundColor: color.primary.azul }}
                >
                  Seleccionar archivo
                  <VisuallyHiddenInput
                    type="file"
                    name="aplicacionevaluacionurl"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    ref={fileInputRefs.aplicacionevaluacionurl}
                  />
                </Button>

                {formData.aplicacionevaluacionurl && (
                  <Box
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
                    <Typography variant="body2">
                      {formData.aplicacionevaluacionurl.name}
                    </Typography>
                    <IconButton
                      color="primary"
                      sx={{ background: color.primary.azul, ml: "auto" }}
                      onClick={() => handlePreview("aplicacionevaluacionurl")}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        handleRemoveFile("aplicacionevaluacionurl")
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Modal de vista previa */}
            <Dialog
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                Vista previa del documento
                <IconButton
                  onClick={() => setPreviewOpen(false)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      textAlign: "center",
                    }}
                  >
                    <DescriptionIcon
                      sx={{ fontSize: 60, color: color.primary.azul }}
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {previewContent.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      No hay vista previa disponible para este tipo de archivo
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, backgroundColor: color.primary.azul }}
                      onClick={() => window.open(previewContent.url, "_blank")}
                    >
                      Descargar archivo
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
          </Paper>
          <Grid container spacing={2} sx={{ mt: 5 }} justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.rojo }}
                startIcon={<FastForwardOutlinedIcon />}
                onClick={() => navigate("/Investigación")}
              >
                Omitir
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.azul }}
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Dashboard>
    </>
  );
};

export default LineamientosI;
