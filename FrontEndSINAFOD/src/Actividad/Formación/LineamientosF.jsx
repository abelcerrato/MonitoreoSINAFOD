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

const LineamientosI = () => {
  const { user } = useUser();
  const { id } = useParams();
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
  const [fileNames, setFileNames] = useState({
    criteriosfactibilidadurl: "",
    requisitostecnicosurl: "",
    criterioseticosurl: "",
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

  const handleRemoveFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
    }));

    setFileNames(prev => ({
      ...prev,
      [fieldName]: ""
    }));
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    setFileNames((prev) => ({
      ...prev,
      [name]: file ? file.name : "",
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

    formDataToSend.append("creadopor", user);
    formDataToSend.append("modificadopor", user);
    formDataToSend.append("formacioninvest", "Investigación");

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
        `${process.env.REACT_APP_API_URL}/lineamientos`,
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
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" sx={{ color: color.primary.azul }}>
                Registro de Lineamientos para Formación
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
              <Typography variant="subtitle1">   Nombre de la Formación</Typography>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{formData.criteriosfactibilidadurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile('criteriosfactibilidadurl')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{formData.requisitostecnicosurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile('requisitostecnicosurl')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{formData.criterioseticosurl.name}</span>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile('criterioseticosurl')}
                  >
                    <DeleteIcon />
                  </IconButton>

                </Box>
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
              onClick={() => navigate("/Formación")}
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
