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
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

import { PDFViewer } from "@react-pdf/renderer";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";

import Swal from "sweetalert2";

import { QRCodeCanvas } from "qrcode.react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Componente para el PDF
import logoDGDP from "../../Components/img/Logo DGDP_FondoB.png";
import logoSE from "../../Components/img/LogoEducacion.png";
import marcaH from "../../Components/img/5 estrellas y H.png";

// Estilos para el PDF

const styles = StyleSheet.create({
  page: {
    position: "relative",
    padding: 30,
    fontFamily: "Helvetica",
  },
  backgroundColumn: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: "100%",
    backgroundColor: color.primary.azul,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: "auto",
  },
  marcaH: {
    position: "absolute",
    padding: 5,
    bottom: 100,
    left: 35,
    width: 80,
    height: 40,
    backgroundColor: color.primary.azul,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 60,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    marginBottom: 15,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  url: {
    fontSize: 10,
    marginTop: 10,
    color: "#666",
  },
});

const FormationPDF = ({ qrUrl }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.backgroundColumn} />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={logoDGDP} />
        <Image style={styles.logo} src={logoSE} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Formulario de Pre Inscripción</Text>

        <View style={styles.qrContainer}>
          <Text style={styles.label}>Código QR</Text>
          <Image
            style={styles.qrImage}
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
              qrUrl
            )}`}
          />
          <Text style={styles.url}>{qrUrl}</Text>
        </View>
      </View>
      <Image style={styles.marcaH} src={marcaH} />
    </Page>
  </Document>
);

const Formacion = () => {
  const { user } = useUser();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [investCapId, setInvestCapId] = useState(null);
  const [errorM, setErrorM] = useState("");
  const [error, setError] = useState("");
  const [isFromLineamientos, setIsFromLineamientos] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const [formData, setFormData] = useState({
    formacion: location.state?.formacion || "",

    tipoactividad: "",
    existeconvenio: "",
    institucionconvenio: "",
    institucionresponsable: "",
    responsablefirmas: "",
    ambitoformacion: "",
    tipoformacion: "",

    modalidad: "",
    plataforma: "",
    duracion: "",
    estado: "",
    funciondirigido: "",
    prebasica: false,
    basica: false,
    media: false,
    primerciclo: false,
    segundociclo: false,
    tercerciclo: false,

    fechainicio: "",
    fechafinal: "",

    participantesprog: "",
    espaciofisico: "",
    direccion: "",
    zona: "",
    socializaron: "",
    observacion: "",

    creadopor: user.id,
    modificadopor: user.id,
  });
  const [fieldErrors, setFieldErrors] = useState({
    fechainicio: false,
    fechafinal: false,
  });

  const navigate = useNavigate();

  // Manejar cambios en campos de texto y selects
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // 1) Manejar checkboxes (Material-UI usa `checked` en lugar de `value`)
    let sanitizedValue =
      type === "checkbox" ? checked : value === null ? "" : value;

    // 2) Validación para "participantesprog" (solo números)
    if (name === "participantesprog") {
      sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");
    }

    setFormData((prevData) => {
      // Base de la nueva data
      let newData = { ...prevData, [name]: sanitizedValue };

      // Limpiar campos según cambio de modalidad
      if (name === "modalidad") {
        if (sanitizedValue === "Virtual") {
          // Limpiar campos de modalidad presencial
          newData.espaciofisico = "";
          newData.direccion = "";
          setFieldErrors((prev) => ({
            ...prev,
            espaciofisico: false,
            direccion: false,
          }));
        } else if (sanitizedValue === "Presencial") {
          // Limpiar campo de plataforma
          newData.plataforma = "";
          setFieldErrors((prev) => ({
            ...prev,
            plataforma: false,
          }));
        } else if (sanitizedValue === "Bimodal") {
          // No limpiar nada para Bimodal ya que necesita ambos
        } else {
          // Limpiar todos los campos relacionados
          newData.plataforma = "";
          newData.espaciofisico = "";
          newData.direccion = "";
          setFieldErrors((prev) => ({
            ...prev,
            plataforma: false,
            espaciofisico: false,
            direccion: false,
          }));
        }
      }

      // Nueva condición: Limpiar ciclos cuando se desmarca "Básica"
      if (name === "basica" && !checked) {
        newData.primerciclo = false;
        newData.segundociclo = false;
        newData.tercerciclo = false;
      }

      // 2) Validación de campo vacío (solo aplica si no es checkbox)
      if (type !== "checkbox") {
        const isEmpty = String(sanitizedValue || "").trim() === "";
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isEmpty,
        }));
      }

      // 3) Validación de fechas (tu lógica original)
      if (name === "fechainicio" || name === "fechafinal") {
        const isValidDate =
          sanitizedValue && !isNaN(new Date(sanitizedValue).getTime());
        newData[name] = isValidDate
          ? new Date(sanitizedValue).toISOString().split("T")[0]
          : "";

        // Validación de rango de fechas
        const { fechainicio, fechafinal } = newData;
        if (
          fechainicio &&
          fechafinal &&
          new Date(fechainicio) > new Date(fechafinal)
        ) {
          setError(
            "La fecha de inicio no puede ser posterior a la fecha de finalización."
          );
          setFieldErrors({ fechainicio: true, fechafinal: true });
        } else {
          setError("Este campo es obligatorio");
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            fechainicio: !fechainicio,
            fechafinal: !fechafinal,
          }));
        }
      }

      // 4) Limpiar campos de convenio (tu lógica original)
      if (name === "tipoactividad" && sanitizedValue === "Interna") {
        newData.institucionconvenio = "";
        newData.existeconvenio = "";
        setFieldErrors((prev) => ({
          ...prev,
          institucionconvenio: false,
          existeconvenio: false,
        }));
      }

      // 5) Validación de minutos (tu lógica original)
      if (name === "minutos") {
        setErrorM(
          Number(sanitizedValue) > 59 ? "Solo se admiten minutos hasta 59." : ""
        );
      }

      // 6) Recalcular duración en HH:MM (si aplica)
      if (name === "horas" || name === "minutos") {
        const horas = Number(newData.horas) || 0;
        const minutos = Number(newData.minutos) || 0;
        newData.duracion = `${horas} hours ${minutos} minutes`;
      }

      return newData;
    });
  };

  // Efecto para capturar el ID si viene del flujo "Guardar"

  useEffect(() => {
    if (location.state?.investCap) {
      setInvestCapId(location.state.investCap);
      setIsFromLineamientos(true);
      // Si viene con título desde lineamientos, actualiza el formData
      if (location.state.formacion) {
        setFormData((prev) => ({
          ...prev,
          formacion: location.state.formacion,
        }));
      }
    }
  }, [location.state]);

  const handleSave = async () => {
    // Lista de campos obligatorios
    const requiredFields = [
      "formacion",
      "tipoactividad",
      "fechainicio",
      "fechafinal",
      "socializaron",
    ];

    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true; // Marcar campo como vacío
      }
    });

    // Verifica que al menos uno de los campos "horas" o "minutos" esté lleno
    if (!formData.horas && !formData.minutos) {
      errors.horas = "Debe llenar al menos uno de los campos: Horas o Minutos";
      errors.minutos =
        "Debe llenar al menos uno de los campos: Horas o Minutos";
    }

    // Si hay campos vacíos, actualizar estado y mostrar alerta
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Swal.fire({
        title: "Campos obligatorios",
        text: "Llenar los campos en rojo",
        icon: "warning",
        timer: 6000,
      });
      return;
    }

    // Verificación de minutos antes de guardar los datos
    if (formData.minutos > 59) {
      Swal.fire({
        title: "Advertencia!",
        text: "Los minutos no pueden ser mayores a 59.",
        icon: "warning",
        timer: 6000,
      });
      return; // Detiene la ejecución si la validación falla
    }
    // Verificación de la fecha antes de guardar los datos
    if (formData.fechainicio && formData.fechafinal) {
      if (new Date(formData.fechainicio) > new Date(formData.fechafinal)) {
        Swal.fire({
          title: "Advertencia!",
          text: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
          icon: "warning",
          timer: 6000,
        });
        return; // No proceder con la solicitud si la validación falla
      }
    }

    // Convierte strings vacíos a null
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        // Si el valor es una cadena vacía, lo convierte en null
        if (value === "") return [key, null];
        // Si el valor es un booleano, lo mantiene igual
        if (typeof value === "boolean") return [key, value];
        return [key, value];
      })
    );

    try {
      let idToUse = investCapId;

      // Si no hay ID (flujo "Omitir"), pedir confirmación
      if (!idToUse) {
        const confirmResult = await Swal.fire({
          title: "Advertencia!",
          text: "La formación se registrará sin lineamientos.",
          icon: "warning",

          showCancelButton: true,
          confirmButtonColor: color.primary.azul,
          cancelButtonColor: color.primary.rojo,
          confirmButtonText: "Sí, Registrar",
          cancelButtonText: "No, cancelar",
          reverseButtons: true,
        });

        // Si el usuario cancela, no continuar
        if (!confirmResult.isConfirmed) {
          return;
        }

        // Si confirma, hacer el POST
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/formacion`,
          cleanedFormData,
          { headers: { "Content-Type": "application/json" } }
        );
        idToUse = response.data.id;
      } else {
        // Actualizar el registro
        const updateResponse = await axios.put(
          `${process.env.REACT_APP_API_URL}/formacion/${idToUse}`,
          cleanedFormData,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // Mostrar mensaje de éxito
      await Swal.fire(
        "¡Guardado!",
        "La formación ha sido registrada",
        "success"
      );
      setIsSaved(true);
      navigate("/Listado_De_Acciones_Formativas");
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire("Error!", "Error al guardar datos", "error");
    }
  };

  function formatDuracionForDisplay(duracion) {
    if (!duracion) return "00 horas 00 minutos";

    const partes = duracion.split(" ");
    const horas = partes[0] || "0";
    const minutos = partes[2] || "0";

    return `${horas.toString().padStart(2, "0")} horas ${minutos
      .toString()
      .padStart(2, "0")} minutos`;
  }

  return (
    <>
      <Dashboard>
        <Paper
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
          elevation={3}
        >
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h4"
                sx={{ color: color.primary.azul, fontWeight: "bold" }}
              >
                Registro de Datos de la Acción Formativa
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
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
                Nombre de la Formación
              </Typography>
              <TextField
                fullWidth
                name="formacion"
                value={formData.formacion}
                onChange={handleChange}
                error={fieldErrors.formacion}
                helperText={
                  fieldErrors.formacion ? "Este campo es obligatorio" : ""
                }
                disabled={isFromLineamientos} // Deshabilita si viene de lineamientos
                InputProps={{
                  readOnly: isFromLineamientos,
                }}
              />
              {isFromLineamientos && (
                <Typography variant="caption" color="info">
                  Este campo fue definido en los lineamientos
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                ¿La Formación Es Interna o Externa?
              </Typography>
              <FormControl fullWidth error={fieldErrors.tipoactividad}>
                <Select
                  name="tipoactividad"
                  value={formData.tipoactividad || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="Interna">Interna</MenuItem>
                  <MenuItem value="Externa">Externa</MenuItem>
                </Select>
                {fieldErrors.tipoactividad && (
                  <FormHelperText style={{ color: "red" }}>
                    Debe seleccionar una opción
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {formData.tipoactividad === "Externa" && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Nombre de la Institución Asociada
                  </Typography>
                  <TextField
                    fullWidth
                    name="institucionconvenio"
                    value={formData.institucionconvenio}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Tiene Convenio la Institución Asociada
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="existeconvenio"
                      value={formData.existeconvenio || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="true">Sí</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                Institución Responsable
              </Typography>
              <TextField
                fullWidth
                name="institucionresponsable"
                value={formData.institucionresponsable}
                onChange={handleChange}
                error={fieldErrors.institucionresponsable}
                helperText={
                  fieldErrors.institucionresponsable
                    ? "Este campo es obligatorio"
                    : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Responsable de Firmas</Typography>
              <TextField
                fullWidth
                name="responsablefirmas"
                value={formData.responsablefirmas}
                onChange={handleChange}
                error={fieldErrors.responsablefirmas}
                helperText={
                  fieldErrors.responsablefirmas
                    ? "Este campo es obligatorio"
                    : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Ámbito de Formación</Typography>
              <TextField
                fullWidth
                name="ambitoformacion"
                value={formData.ambitoformacion}
                onChange={handleChange}
                error={fieldErrors.ambitoformacion}
                helperText={
                  fieldErrors.ambitoformacion ? "Este campo es obligatorio" : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Tipo de Formación</Typography>
              <FormControl fullWidth error={fieldErrors.tipoformacion}>
                <Select
                  name="tipoformacion"
                  value={formData.tipoformacion || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="Taller">Taller</MenuItem>
                  <MenuItem value="Seminario">Seminario</MenuItem>
                  <MenuItem value="Curso">Curso</MenuItem>
                  <MenuItem value="Diplomado">Diplomado</MenuItem>
                </Select>
                {fieldErrors.tipoformacion && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Modalidad</Typography>
              <FormControl fullWidth error={fieldErrors.modalidad}>
                <Select
                  name="modalidad"
                  value={formData.modalidad || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="Virtual">Virtual</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Bimodal">Bimodal</MenuItem>
                </Select>
                {fieldErrors.modalidad && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {(formData.modalidad === "Virtual" ||
              formData.modalidad === "Bimodal") && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Plataforma en la que se Realizará la Actividad
                </Typography>
                <TextField
                  fullWidth
                  name="plataforma"
                  value={formData.plataforma}
                  onChange={handleChange}
                  error={fieldErrors.plataforma}
                  helperText={
                    fieldErrors.plataforma ? "Este campo es obligatorio" : ""
                  }
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Duración</Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    variant="outlined"
                    label="Horas"
                    fullWidth
                    type="number"
                    name="horas"
                    value={formData.horas || ""}
                    onChange={handleChange}
                    error={fieldErrors.horas || fieldErrors.minutos}
                    helperText={fieldErrors.horas || fieldErrors.minutos}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    variant="outlined"
                    label="Minutos"
                    fullWidth
                    type="number"
                    name="minutos"
                    value={formData.minutos || ""}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 59 }} // Limita a 0-59 minutos
                    error={fieldErrors.horas || fieldErrors.minutos}
                    helperText={fieldErrors.horas || fieldErrors.minutos}
                  />
                  {errorM && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errorM}
                    </div>
                  )}
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    variant="outlined"
                    label="Duración"
                    fullWidth
                    name="duracion"
                    value={formatDuracionForDisplay(formData.duracion)} // Muestra "HH horas MM minutos"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Estado</Typography>
              <FormControl fullWidth error={fieldErrors.estado}>
                <Select
                  name="estado"
                  value={formData.estado || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="Planificada">Planificada</MenuItem>
                  <MenuItem value="En curso">En Curso</MenuItem>
                  <MenuItem value="Suspendida">Suspendida</MenuItem>
                  <MenuItem value="Completada">Completada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
                {fieldErrors.estado && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                Cargo al que va Dirigido
              </Typography>
              <TextField
                fullWidth
                name="funciondirigido"
                value={formData.funciondirigido}
                onChange={handleChange}
                error={fieldErrors.funciondirigido}
                helperText={
                  fieldErrors.funciondirigido ? "Este campo es obligatorio" : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Nivel Educativo</Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.prebasica}
                        onChange={handleChange}
                        name="prebasica"
                      />
                    }
                    label="Prebásica"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.basica}
                        onChange={handleChange}
                        name="basica"
                      />
                    }
                    label="Básica"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.media}
                        onChange={handleChange}
                        name="media"
                      />
                    }
                    label="Media"
                  />
                </Grid>
              </Grid>
            </Grid>

            {formData.basica === true && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Ciclo Educativo</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.primerciclo}
                          onChange={handleChange}
                          name="primerciclo"
                        />
                      }
                      label="Primer Ciclo"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.segundociclo}
                          onChange={handleChange}
                          name="segundociclo"
                        />
                      }
                      label="Segundo Ciclo"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.tercerciclo}
                          onChange={handleChange}
                          name="tercerciclo"
                        />
                      }
                      label="Tercer Ciclo"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {/* {formData.media === true && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Grados Académicos 
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp1}
                          onChange={handleChange}
                          name="btp1"
                        />
                      }
                      label="BTP 1"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp2}
                          onChange={handleChange}
                          name="btp2"
                        />
                      }
                      label="BTP 2"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp3}
                          onChange={handleChange}
                          name="btp3"
                        />
                      }
                      label="BTP 3"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch1}
                          onChange={handleChange}
                          name="bch1"
                        />
                      }
                      label="BCH 1"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch2}
                          onChange={handleChange}
                          name="bch2"
                        />
                      }
                      label="BCH 2"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch3}
                          onChange={handleChange}
                          name="bch3"
                        />
                      }
                      label="BCH 3"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )} */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Fecha Inicio</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechainicio"
                value={formData.fechainicio || ""}
                onChange={handleChange}
                error={fieldErrors.fechainicio} // Aquí se activa el error
                helperText={fieldErrors.fechainicio && error} // Muestra el mensaje de error
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Fecha de Finalización</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechafinal"
                value={formData.fechafinal || ""}
                error={fieldErrors.fechafinal} // Aquí se activa el error
                helperText={
                  fieldErrors.funciondirigido ? "Este campo es obligatorio" : ""
                }
                inputProps={{
                  min: formData.fechainicio || "",
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                Cantidad de Participantes Programados
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="participantesprog"
                value={formData.participantesprog || ""}
                onChange={handleChange}
                error={fieldErrors.participantesprog}
                helperText={
                  fieldErrors.participantesprog
                    ? "Este campo es obligatorio"
                    : ""
                }
              />
            </Grid>
            {(formData.modalidad === "Presencial" ||
              formData.modalidad === "Bimodal") && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Espacio Físico</Typography>
                  <TextField
                    fullWidth
                    name="espaciofisico"
                    value={formData.espaciofisico}
                    onChange={handleChange}
                    error={fieldErrors.espaciofisico}
                    helperText={
                      fieldErrors.espaciofisico
                        ? "Este campo es obligatorio"
                        : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Dirección</Typography>
                  <TextField
                    fullWidth
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    error={fieldErrors.direccion}
                    helperText={
                      fieldErrors.direccion ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Zona</Typography>
              <FormControl fullWidth error={fieldErrors.zona}>
                <Select
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                >
                  <MenuItem value="Rural">Rural</MenuItem>
                  <MenuItem value="Urbana">Urbana</MenuItem>
                  <MenuItem value="Ambas">Ambas</MenuItem>
                </Select>
                {fieldErrors.zona && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                ¿Se realizó Convocatoria?
              </Typography>
              <FormControl fullWidth error={fieldErrors.socializaron}>
                <Select
                  name="socializaron"
                  value={formData.socializaron ?? ""}
                  onChange={handleChange}
                >
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
                {fieldErrors.socializaron && (
                  <FormHelperText style={{ color: "red" }}>
                    Debe seleccionar una opción
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Observación</Typography>
              <TextField
                fullWidth
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box
            sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: color.primary.azul, ml: 5 }}
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaved}
            >
              Guardar
            </Button>
          </Box>
        </Paper>
      </Dashboard>
    </>
  );
};

export default Formacion;
