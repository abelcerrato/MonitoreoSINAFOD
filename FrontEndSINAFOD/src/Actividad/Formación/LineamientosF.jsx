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
  Radio,
  RadioGroup,
  FormControlLabel,
  Tab,
  Tabs,
  FormHelperText,
  IconButton
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import TablaPacticantes from "../../Participantes/TablaParticipantes";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import DeleteIcon from "@mui/icons-material/Delete";


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

const LineamientosF = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    accionformacion: "",
    criteriosfactibilidadurl: null,
    requisitostecnicosurl: null,
    criterioseticosurl: null,
    formacioninvest: "",
  });
  const [errors, setErrors] = useState({
    accionformacion: false,
    criterioseticosurl: false
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

  const handleRemoveFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
    }));

  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Validar tipo de archivo (nueva validación)
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Verificar si el tipo o extensión están permitidos
      if (!allowedTypes.includes(fileType) &&
        !['pdf', 'jpg', 'jpeg', 'png'].includes(fileExtension)) {
        // Mostrar alerta de error
        Swal.fire({
          title: 'Tipo de archivo no permitido',
          text: 'Solo se permiten archivos PDF, JPG, JPEG o PNG.',
          icon: 'error',
          confirmButtonColor: color.primary.azul,
        });

        // Limpiar el input file
        e.target.value = '';
        return;
      }

      // Validación opcional de tamaño (descomenta si lo necesitas)
      /*
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: 'Archivo demasiado grande',
          text: `El tamaño máximo permitido es ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          icon: 'error',
          confirmButtonColor: color.primary.azul,
        });
        e.target.value = '';
        return;
      }
      */
    }

    // Actualiza formData con el archivo (esto ya lo tenías)
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));


  };


  const fileInputRefs = {
    criteriosfactibilidadurl: React.useRef(null),
    requisitostecnicosurl: React.useRef(null),
    criterioseticosurl: React.useRef(null)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear errores
    const newErrors = {
      accionformacion: false,

    };

    let hasError = false;


    // Validación del título del proyecto
    if (!formData.accionformacion) {
      newErrors.accionformacion = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      Swal.fire("Error", "Por favor complete los campos requeridos", "error");
      return;
    }

    const formDataToSend = new FormData();

    // Agregar campos de texto
    formDataToSend.append("accionformacion", formData.accionformacion);

    formDataToSend.append("creadopor", user.id);
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

    // Agregar archivos si existen
    fileFields.forEach(field => {
      if (formData[field]) {
        formDataToSend.append(field, formData[field]);
        uploadedFilesCount++;
      }
    });

    // Verificar si faltan archivos
    if (uploadedFilesCount < totalRequiredFiles) {
      const result = await Swal.fire({
        title: 'Lineamientos incompletos',
        text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos. ¿Deseas continuar con el registro?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: 'Sí, Registar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return; // No continuar si el usuario cancela
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lineamientosformacion`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const investCap = response.data.id;
      navigate("/Formación", {
        state: { investCap, accionformacion: formData.accionformacion },
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire("Error", "Ocurrió un error al guardar los datos", "error");
    }
  };

  return (
    <>
      <Dashboard>
        <Paper
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
          elevation={3}
        >
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography variant="h4" sx={{ color: color.primary.azul }}>
                Registro de Lineamientos para Formación
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
                onClick={() => navigate("/Listado_De_Formaciones")}
              >
                Cerrar
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={5} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                {" "}
                Nombre de la Formación
              </Typography>
              <TextField
                fullWidth
                name="accionformacion"
                value={formData.accionformacion}
                onChange={handleChange}
                error={errors.accionformacion}
                helperText={
                  errors.accionformacion
                    ? "El título del proyecto es requerido"
                    : ""
                }
                FormHelperTextProps={{ style: { color: "red" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: errors.accionformacion ? "red" : "",
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}></Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Documento de Cumplimientos de los Criterios de Factibilidad
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
                  name="criteriosfactibilidadurl"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={fileInputRefs.criteriosfactibilidadurl}
                />
              </Button>
              {formData.criteriosfactibilidadurl && (
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
                  <span>{formData.criteriosfactibilidadurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{ ml: "auto" }}
                    onClick={() => handleRemoveFile("criteriosfactibilidadurl")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Documento de Cumplimiento de los Requisitos Técnicos
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
                  name="requisitostecnicosurl"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={fileInputRefs.requisitostecnicosurl}
                />
              </Button>
              {formData.requisitostecnicosurl && (
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
                  <span>{formData.requisitostecnicosurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{ ml: "auto" }}
                    onClick={() => handleRemoveFile("requisitostecnicosurl")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Documento de Cumplimientos de los Criterios Éticos
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
                  name="criterioseticosurl"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={fileInputRefs.criterioseticosurl}
                />
              </Button>
              {formData.criterioseticosurl && (
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
                  <span>{formData.criterioseticosurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{ ml: "auto" }}
                    onClick={() => handleRemoveFile("criterioseticosurl")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.rojo }}
                startIcon={<FastForwardOutlinedIcon />}
                onClick={() => navigate("/Formación")}
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

export default LineamientosF;
