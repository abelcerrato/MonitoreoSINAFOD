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
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import TablaPacticantes from "../../Participantes/TablaParticipantes";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
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
  const [errors, setErrors] = useState({
    accionformacion: false,
    estadoprotocolo: false
  });
  const [formData, setFormData] = useState({
    accionformacion: "",
    estadoprotocolo: "",
    presentoprotocolourl: null,
    monitoreoyevaluacionurl: null,
    aplicacionevaluacionurl: null,
    formacioninvest: "",
  });
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/dashboard");
  };

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

    // Actualiza formData con el archivo
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Actualiza solo el nombre del archivo correspondiente
    setFileNames((prev) => ({
      ...prev,
      [name]: file ? file.name : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear errores
    const newErrors = {
      accionformacion: false,
      estadoprotocolo: false
    };

    let hasError = false;

    // Validar si se cargó un archivo en presentoprotocolourl
    if (formData.presentoprotocolourl && !formData.estadoprotocolo) {
      newErrors.estadoprotocolo = true;
      hasError = true;
    }

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
    formDataToSend.append(
      "estadoprotocolo",
      formData.presentoprotocolourl ? formData.estadoprotocolo : "No se presentó"
    );
    formDataToSend.append("creadopor", user);
    formDataToSend.append("modificadopor", user);
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
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'No, volver atrás',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });

      if (!result.isConfirmed) {
        return; // No continuar si el usuario cancela
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lineamientos`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const investCap = response.data.id;
      navigate("/Investigación", {
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
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" sx={{ color: color.primary.azul }}>
                Registro de Lineamientos para Investigación
              </Typography>
            </Grid>
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
                onClick={() => handleRedirect()}
              >
                Cerrar
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={5} mt={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Título del Proyecto</Typography>
              <TextField
                fullWidth
                name="accionformacion"
                value={formData.accionformacion}
                onChange={handleChange}
                error={errors.accionformacion}
                helperText={errors.accionformacion ? "El título del proyecto es requerido" : ""}
                FormHelperTextProps={{ style: { color: 'red' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.accionformacion ? 'red' : '',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Documento del Protocolo del Proyecto de Investigación Educativa
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
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.presentoprotocolourl && (
                <span>{formData.presentoprotocolourl.name}</span>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Estado del Protocolo</Typography>
              <FormControl fullWidth error={errors.estadoprotocolo}>
                <Select
                  name="estadoprotocolo"
                  value={formData.estadoprotocolo || ""}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.estadoprotocolo ? 'red' : '',
                    },
                  }}
                >
                  <MenuItem value="" disabled>Selecione una opción</MenuItem>
                  <MenuItem value="Incompleto">Incompleto</MenuItem>
                  <MenuItem value="Completo">Completo</MenuItem>
                </Select>
                {errors.estadoprotocolo && (
                  <FormHelperText style={{ color: 'red' }}>
                    Debe seleccionar el estado del protocolo
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.monitoreoyevaluacionurl && (
                <span>{formData.monitoreoyevaluacionurl.name}</span>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Documento de Aplicación de Evaluación
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
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.aplicacionevaluacionurl && (
                <span>{formData.aplicacionevaluacionurl.name}</span>
              )}
            </Grid>
          </Grid>
          <Box
            sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: color.primary.rojo }}
              startIcon={<FastForwardOutlinedIcon />}
              onClick={() => navigate("/Investigación")}
            >
              Omitir
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: color.primary.azul, ml: 5 }}
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </Box>
        </Paper>
      </Dashboard>
    </>
  );
};

export default LineamientosI;
