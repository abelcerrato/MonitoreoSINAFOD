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
  Modal,
  List,
  FormHelperText,
  ListItem,
  ListItemText,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import TablaPacticantes from "./TablaParticipantes";
import Swal from "sweetalert2";

const FormularioExterno = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { id: investCap } = useParams();
  const [docentesEncontrados, setDocentesEncontrados] = useState([]);
  const [openSeleccionModal, setOpenSeleccionModal] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentosRE, setDepartamentosRE] = useState([]);
  const [municipiosRE, setMunicipiosRE] = useState([]);
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [gardo, setGrado] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [aldeasP, setAldeaP] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [openDNIModal, setOpenDNIModal] = useState(true);
  const [tempDNI, setTempDNI] = useState("");
  const [dniError, setDniError] = useState("");
  const [formData, setFormData] = useState({
    idinvestigacioncap: investCap,
    correo: "",
    telefono: "",
    fechanacimiento: "",
    identificacion: "",
    codigosace: "",
    nombre: "",
    idfuncion: "",
    genero: "",
    añosdeservicio: 0,
    codigodered: "",
    deptoresidencia: "",
    municipioresidencia: "",
    aldearesidencia: null,
    idnivelacademicos: "",
    idgradoacademicos: null,

    nombreced: "",
    prebasica: false,
    basica: false,
    media: false,
    primero: false,
    segundo: false,
    tercero: false,
    cuarto: false,
    quinto: false,
    sexto: false,
    séptimo: false,
    octavo: false,
    noveno: false,
    btp1: false,
    btp2: false,
    btp3: false,
    bch1: false,
    bch2: false,
    bch3: false,

    zona: "",
    idmunicipio: "",
    iddepartamento: "",
    idaldea: null,
    tipoadministracion: "Gubernamental",
    creadopor: null,
  });
  const [camposBloqueados, setCamposBloqueados] = useState({
    correo: false,
    identificacion: false,
    codigosace: false,
    nombre: false,
    funcion: false,
    genero: false,
    añosdeservicio: 0,
    codigodered: false,
    deptoresidencia: false,
    municipioresidencia: false,
    aldearesidencia: false,
    nivelacademicodocente: false,
    gradoacademicodocente: false,

    aldeaced: false,
    centroeducativo: false,
    idnivelesacademicos: false,
    idgradosacademicos: false,
    zona: false,
    municipioced: false,
    departamentoced: false,
    tipoadministracion: false,
  });
  const limpiarCampos = () => {
    setFormData((prevState) => ({
      ...prevState,
      identificacion: "",
      codigosace: "",
      nombre: "",
      funcion: "",
      genero: "",
      añosdeservicio: 0,
      codigodered: "",
      deptoresidencia: "",
      municipioresidencia: "",
      aldearesidencia: "",
      nivelacademicodocente: "",
      gradoacademicodocente: null,

      aldeaced: "",
      centroeducativo: "",
      idnivelesacademicos: "",
      idgradosacademicos: null,
      zona: "",
      municipioced: "",
      departamentoced: "",
      creadopor: prevState.creadopor,
    }));
  };

  const handleSave = async () => {
    const requiredFields = [
      "identificacion",
      "nombre",
      "funcion",
      "genero",
      "añosdeservicio",
      "deptoresidencia",
      "municipioresidencia",
      "nivelacademicodocente",
      "centroeducativo",
      "idnivelesacademicos",
      "zona",
      "municipioced",
      "departamentoced",
      "tipoadministracion",
    ];

    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Swal.fire({
        title: "Campos obligatorios",
        text: "Llenar los campos en rojo",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Crear una copia del formData y convertir campos vacíos a null
      const dataToSend = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" || (typeof value === "string" && value.trim() === "")
            ? null
            : value,
        ])
      );

      console.log("Datos a enviar:", dataToSend);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/CapacitacionP/${investCap}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        limpiarCampos();
        setFormSubmitted(true);
        Swal.fire({
          title: "Guardado",
          text: "Datos guardados correctamente",
          icon: "success",
          timer: 12000,
        });
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire({
        title: "Error!",
        text: "Error al guardar datos",
        icon: "error",
        timer: 12000,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Convertimos el valor a string para evitar errores con `.trim()`
      const valueStr = String(value || "");

      // Quitar error si el usuario llena un campo vacío
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: valueStr.trim() === "" ? true : false,
      }));

      // Validación para años de servicio (solo números positivos)
      if (name === "añosdeservicio") {
        if (!/^\d*$/.test(value)) {
          return prevData; // Si no es un número positivo, no actualiza el estado
        }
      }

      return newData;
    });
  };

  // Obtener departamentos del centro educativo
  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/departamentos`
        );
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error al obtener los departamentos", error);
      }
    };

    obtenerDepartamentos();
  }, []);

  // Obtener municipios del centro educativo
  useEffect(() => {
    if (!formData.departamentoced) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/municipios/${formData.departamentoced}`
        );
        setMunicipios(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.departamentoced]);

  // Obtener aldea del centro educativo
  useEffect(() => {
    if (!formData.municipioced) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/aldeas/${formData.municipioced}`
        );
        setAldea(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.municipioced]);

  // Obtener NivelEducativo al que atiende
  useEffect(() => {
    const obtenerNivelEducativo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/nivelesAcademicos`
        );
        setNivelEducativo(response.data);
      } catch (error) {
        console.error("Error al obtener los NivelEducativo", error);
      }
    };

    obtenerNivelEducativo();
  }, []);

  // Obtener gardo al que atiende
  useEffect(() => {
    if (!formData.idnivelesacademicos) return;

    const obtenergardo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/gradoAcademicoNivel/${formData.idnivelesacademicos}`
        );

        setGrado(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenergardo();
  }, [formData.idnivelesacademicos]);

  // Obtener aldea del participante
  useEffect(() => {
    if (!formData.municipioresidencia) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/aldeas/${formData.municipioresidencia}`
        );
        setAldeaP(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.municipioresidencia]);

  // Obtener departamentos del participante
  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/departamentos`
        );
        setDepartamentosRE(response.data);
      } catch (error) {
        console.error("Error al obtener los departamentos", error);
      }
    };

    obtenerDepartamentos();
  }, []);

  // Obtener municipios del participante
  useEffect(() => {
    if (!formData.deptoresidencia) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/municipios/${formData.deptoresidencia}`
        );
        setMunicipiosRE(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.deptoresidencia]);

  // Obtener gardo cuando cambia el departamento seleccionado
  useEffect(() => {
    if (!formData.nivelacademicodocente) return;
    const obtenergardo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/gradoAcademicoNivel/${formData.nivelacademicodocente}`
        );
        setGradoP(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenergardo();
  }, [formData.nivelacademicodocente]);

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/investC/${investCap}`
        );

        setFormData(response.data[0]);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetalles();
  }, [investCap]);

  const obtenerDNI = async (campo) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/filtroDocentes/${tempDNI}`
      );

      if (response.data && response.data.length > 0) {
        if (response.data.length === 1) {
          // Si solo hay un registro
          llenarFormulario(response.data[0]);
          Swal.fire({
            title: "Participante encontrado",
            text: "Se encontraron datos del participante",
            icon: "success",
            timer: 6000,
          });
        } else {
          // Si hay múltiples registros
          setDocentesEncontrados(response.data);
          setOpenSeleccionModal(true); // Asegúrate de que esto se ejecute
          console.log(
            "Mostrando modal de selección con",
            response.data.length,
            "registros"
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      Swal.fire({
        title: "No se encontró ningún registro previo.",
        text: "Por favor ingrese sus datos",
        icon: "warning",
        timer: 12000,
      });
    }
  };

  const llenarFormulario = (docente) => {
    setFormData((prev) => ({
      ...prev,
      codigosace: docente.codigosace || "",
      //identificacion: docente.identificacion || "",
      nombre: docente.nombre || "",
      funcion: docente.funcion || "",
      genero: docente.genero || "",
      añosdeservicio: docente.añosdeservicio || "",
      codigodered: docente.codigodered || "",
      deptoresidencia: docente.iddeptoresidencia || "",
      municipioresidencia: docente.idmuniresidencia || "",
      aldearesidencia: docente.idaldearesidencia || "",
      nivelacademicodocente: docente.idnivelacademicodocente || "",
      gradoacademicodocente: docente.idgradoacademicodocente || "",

      centroeducativo: docente.centroeducativo || "",
      idnivelesacademicos: docente.idnivelesacademicos || "",
      idgradosacademicos: docente.idgradosacademicos || "",
      zona: docente.zona || "",
      municipioced: docente.municipioced || "",
      departamentoced: docente.departamentoced || "",
      aldeaced: docente.aldeaced || "",
      tipoadministracion: docente.tipoadministracion || "Gubernamental",
    }));

    setCamposBloqueados({
      codigosace: !!docente.codigosace,
      identificacion: !!docente.identificacion,
      nombre: !!docente.nombre,
      funcion: !!docente.funcion,
      genero: !!docente.genero,
      añosdeservicio: !!docente.añosdeservicio,

      codigodered: !!docente.codigodered,
      deptoresidencia: !!docente.iddeptoresidencia,
      municipioresidencia: !!docente.idmuniresidencia,
      aldearesidencia: !!docente.idaldearesidencia,
      nivelacademicodocente: !!docente.nivelacademicodocente,
      gradoacademicodocente: !!docente.gradoacademicodocente,

      centroeducativo: !!docente.centroeducativo,
      idnivelesacademicos: !!docente.idnivelesacademicos,
      idgradosacademicos: !!docente.idgradosacademicos,
      zona: !!docente.zona,
      municipioced: !!docente.municipioced,
      departamentoced: !!docente.departamentoced,
      aldeaced: !!docente.aldeaced,
      tipoadministracion: !!docente.tipoadministracion,
    });
  };

  useEffect(() => {
    // Mostrar modal al cargar el componente
    setOpenDNIModal(true);
  }, []);

  const ThankYouView = ({ accionFormacion }) => (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Paper sx={{ padding: 5, maxWidth: 600 }} elevation={3}>
        <Typography variant="h4" sx={{ color: color.primary.azul, mb: 3 }}>
          ¡Gracias por participar!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {accionFormacion}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Agradecemos tu participación en esta actividad. Tus datos han sido
          registrados exitosamente.
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: color.primary.azul }}
          onClick={() => window.close()} // Cierra la pestaña/ventana
        >
          Cerrar
        </Button>
      </Paper>
    </Box>
  );

  // 1. Verificar al cargar si ya se envió el formulario
  useEffect(() => {
    if (localStorage.getItem(`formSubmitted_${investCap}`)) {
      setFormSubmitted(true);
    }
  }, [investCap]);

  // 2. Bloquear navegación hacia atrás después de enviar
  useEffect(() => {
    if (formSubmitted) {
      localStorage.setItem(`formSubmitted_${investCap}`, "true");
      window.history.replaceState(null, "", window.location.href);
      window.onpopstate = () => window.history.go(1);
    }
  }, [formSubmitted, investCap]);

  return (
    <>
      {formSubmitted ? (
        <ThankYouView accionFormacion={formData.accionformacion} />
      ) : (
        <Box
          sx={{
            minHeight: "100vh", // para ocupar toda la altura de la ventana
            display: "flex",
            justifyContent: "center", // centra horizontalmente
            alignItems: "center", // centra verticalmente
            backgroundColor: "#f0f2f5", // opcional: color de fondo
          }}
        >
          <Modal
            open={openDNIModal}
            onClose={() => {}} // No permitimos cerrar haciendo click fuera
            aria-labelledby="dni-modal-title"
            aria-describedby="dni-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography
                id="dni-modal-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Ingreso de Identidad
              </Typography>

              <TextField
                fullWidth
                label="Número de Identidad (DNI)"
                value={tempDNI}
                onChange={(e) => {
                  setTempDNI(e.target.value);
                  // Validación en tiempo real
                  if (!e.target.value) {
                    setDniError("Debe ingresar su número de identidad");
                  } else if (!/^\d{13}$/.test(e.target.value)) {
                    setDniError("La identidad debe tener 13 dígitos");
                  } else {
                    setDniError("");
                  }
                }}
                error={!!dniError}
                helperText={dniError}
                inputProps={{
                  maxLength: 13,
                }}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    // Validación final antes de enviar
                    if (!tempDNI) {
                      setDniError("Debe ingresar su número de identidad");
                      return;
                    }
                    if (!/^\d{13}$/.test(tempDNI)) {
                      setDniError("La identidad debe tener 13 dígitos");
                      return;
                    }

                    // Cerrar modal
                    setOpenDNIModal(false);

                    // Actualizar el estado del formulario
                    setFormData((prev) => ({
                      ...prev,
                      identificacion: tempDNI,
                    }));

                    // Llamar a la función para obtener datos
                    await obtenerDNI(tempDNI);
                  }}
                  disabled={!tempDNI || !!dniError}
                  sx={{ backgroundColor: color.primary.azul }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          </Modal>

          <Paper sx={{ padding: 5, margin: 2, width: "80%" }} elevation={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography
                  sx={{
                    color: color.primary.azul,
                    fontWeight: "bold",
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "2rem",
                      lg: "2.5rem",
                    },
                  }}
                >
                  Registro de Participantes
                </Typography>
                <Typography
                  sx={{
                    color: color.primary.azul,
                    fontWeight: "bold", // Negrita
                    fontStyle: "italic", // Cursiva
                    textAlign: "center",
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "2rem",
                      lg: "2.5rem",
                    },
                  }}
                >
                  {formData.accionformacion}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Por favor, complete la siguiente información, asegúrese de
                  revisar sus respuestas antes de enviarlas.
                  <Typography
                    variant="subtitle1"
                    sx={{ color: color.primary.rojo }}
                  >
                    Los campos marcados con * son obligatorios.
                  </Typography>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: color.primary.azul, textAlign: "center" }}
                >
                  Datos Generales del Participante
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Código SACE *</Typography>
                <TextField
                  fullWidth
                  name="codigosace"
                  value={formData.codigosace}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: camposBloqueados.codigosace,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Identidad*</Typography>

                <TextField
                  fullWidth
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  error={fieldErrors.identificacion}
                  helperText={
                    fieldErrors.identificacion
                      ? "Este campo es obligatorio"
                      : ""
                  }
                  InputProps={{
                    readOnly: camposBloqueados.identificacion,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Nombre*</Typography>
                <TextField
                  fullWidth
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={fieldErrors.nombre}
                  helperText={
                    fieldErrors.nombre ? "Este campo es obligatorio" : ""
                  }
                  InputProps={{
                    readOnly: camposBloqueados.nombre,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl error={fieldErrors.genero}>
                  <Typography variant="subtitle1">Genero*</Typography>
                  <RadioGroup
                    row
                    name="genero"
                    value={formData.genero}
                    onChange={(e) =>
                      !camposBloqueados.genero &&
                      setFormData({ ...formData, genero: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="Femenino"
                      control={<Radio disabled={camposBloqueados.genero} />}
                      label="Mujer"
                      disabled={camposBloqueados.genero}
                    />
                    <FormControlLabel
                      value="Masculino"
                      control={<Radio disabled={camposBloqueados.genero} />}
                      label="Hombre"
                      disabled={camposBloqueados.genero}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Fecha de Nacimiento
                    </Typography>
                    <TextField
                      fullWidth
                      name="fechanacimiento"
                      value={formData.fechanacimiento}
                      onChange={handleChange}
                      type="date"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">Edad</Typography>
                    <TextField
                      fullWidth
                      name="edad"
                      value={formData.edad || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Correo Electrónico</Typography>
                <TextField
                  fullWidth
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Teléfono</Typography>
                <TextField
                  fullWidth
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl
                  fullWidth
                  error={fieldErrors.nivelacademicodocente}
                  disabled={camposBloqueados.nivelacademicodocente}
                >
                  <Typography variant="subtitle1">Nivel Educativo*</Typography>
                  <Select
                    fullWidth
                    name="nivelacademicodocente"
                    value={formData.nivelacademicodocente || ""}
                    onChange={handleChange}
                    disabled={camposBloqueados.nivelacademicodocente}
                  >
                    <MenuItem value="3">Media</MenuItem>
                    <MenuItem value="4">Superior</MenuItem>
                  </Select>
                  {fieldErrors.nivelacademicodocente && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Grado Académico</Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.gradoacademicodocente}
                >
                  <Select
                    fullWidth
                    name="gradoacademicodocente"
                    value={formData.gradoacademicodocente || ""}
                    onChange={handleChange}
                    disabled={!gardoP.length}
                    inputProps={{
                      readOnly: camposBloqueados.gradoacademicodocente,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un grado académico
                    </MenuItem>
                    {gardoP.map((mun) => (
                      <MenuItem key={mun.id} value={mun.id}>
                        {mun.grado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Años de Servicio*</Typography>
                <TextField
                  fullWidth
                  name="añosdeservicio"
                  value={formData.añosdeservicio || ""}
                  onChange={handleChange}
                  error={fieldErrors.añosdeservicio}
                  helperText={
                    fieldErrors.añosdeservicio
                      ? "Este campo es obligatorio"
                      : ""
                  }
                  InputProps={{
                    readOnly: camposBloqueados.añosdeservicio,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Código de Red al que Pertenece
                </Typography>
                <TextField
                  fullWidth
                  name="codigodered"
                  value={formData.codigodered || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: camposBloqueados.codigodered,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Cargo que Desempeña*
                </Typography>
                <TextField
                  fullWidth
                  name="funcion"
                  value={formData.funcion}
                  onChange={handleChange}
                  error={fieldErrors.funcion}
                  helperText={
                    fieldErrors.funcion ? "Este campo es obligatorio" : ""
                  }
                  InputProps={{
                    readOnly: camposBloqueados.funcion,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Departamento de Residencia*
                </Typography>
                <FormControl
                  disabled={camposBloqueados.deptoresidencia}
                  fullWidth
                  error={fieldErrors.deptoresidencia}
                >
                  <Select
                    name="deptoresidencia"
                    value={formData.deptoresidencia}
                    onChange={handleChange}
                    disabled={camposBloqueados.deptoresidencia}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un departamento
                    </MenuItem>
                    {departamentosRE.length > 0 ? (
                      departamentosRE.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Cargando...</MenuItem>
                    )}
                  </Select>
                  {fieldErrors.deptoresidencia && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Municipio de Residencia*
                </Typography>
                <FormControl
                  disabled={camposBloqueados.municipioresidencia}
                  fullWidth
                  error={fieldErrors.municipioresidencia}
                >
                  <Select
                    id="municipioresidencia"
                    name="municipioresidencia"
                    value={formData.municipioresidencia || ""}
                    onChange={handleChange}
                    disabled={!municipiosRE.length}
                    inputProps={{
                      readOnly: camposBloqueados.municipioresidencia,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un municipio
                    </MenuItem>
                    {municipiosRE.map((municipio) => (
                      <MenuItem key={municipio.id} value={municipio.id}>
                        {municipio.municipio}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.municipioresidencia && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Aldea de Residencia</Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.aldearesidencia}
                >
                  <Select
                    name="aldearesidencia"
                    value={formData.aldearesidencia || ""}
                    onChange={handleChange}
                    disabled={!aldeasP.length}
                    inputProps={{
                      readOnly: camposBloqueados.aldearesidencia,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione una aldea
                    </MenuItem>
                    {aldeasP.length > 0 ? (
                      aldeasP.map((ald) => (
                        <MenuItem key={ald.id} value={ald.id}>
                          {ald.aldea}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Seleccione una aldea</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: color.primary.azul, textAlign: "center", mt: 3 }}
                >
                  Datos del Centro Educativo Que Representa
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Nivel Educativo que Atiende*
                </Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.idnivelesacademicos}
                  error={fieldErrors.idnivelesacademicos}
                >
                  <Select
                    name="idnivelesacademicos"
                    value={formData.idnivelesacademicos || ""}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.idnivelesacademicos,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un nivel educativo
                    </MenuItem>
                    {NivelEducativo.length > 0 ? (
                      NivelEducativo.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Cargando...</MenuItem>
                    )}
                  </Select>
                  {fieldErrors.idnivelesacademicos && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Grado Académico que Atiende*
                </Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.idgradosacademicos}
                >
                  <Select
                    name="idgradosacademicos"
                    value={formData.idgradosacademicos || ""}
                    onChange={handleChange}
                    disabled={!gardo.length}
                    inputProps={{
                      readOnly: camposBloqueados.idgradosacademicos,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un grado académico
                    </MenuItem>
                    {gardo.map((mun) => (
                      <MenuItem key={mun.id} value={mun.id}>
                        {mun.grado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Centro Educativo*</Typography>
                <TextField
                  fullWidth
                  name="centroeducativo"
                  value={formData.centroeducativo}
                  onChange={handleChange}
                  error={fieldErrors.centroeducativo}
                  helperText={
                    fieldErrors.centroeducativo
                      ? "Este campo es obligatorio"
                      : ""
                  }
                  inputProps={{
                    readOnly: camposBloqueados.centroeducativo,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1">
                    Tipo de Administración*
                  </Typography>
                  <RadioGroup
                    row
                    name="tipoadministracion"
                    value={formData.tipoadministracion}
                    onChange={(e) =>
                      !camposBloqueados.tipoadministracion &&
                      setFormData({
                        ...formData,
                        tipoadministracion: e.target.value,
                      })
                    }
                  >
                    <FormControlLabel
                      value="Gubernamental"
                      control={<Radio />}
                      label="Gubernamental"
                      disabled={camposBloqueados.tipoadministracion}
                    />
                    <FormControlLabel
                      value="No Gubernamental"
                      control={<Radio />}
                      label="No Gubernamental"
                      disabled={camposBloqueados.tipoadministracion}
                    />
                  </RadioGroup>
                  {fieldErrors.tipoadministracion && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Zona Centro Educativo*
                </Typography>
                <FormControl
                  disabled={camposBloqueados.zona}
                  fullWidth
                  error={fieldErrors.zona}
                >
                  <Select
                    name="zona"
                    value={formData.zona}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.zona,
                    }}
                  >
                    <MenuItem value="Rural">Rural</MenuItem>
                    <MenuItem value="Urbana">Urbana</MenuItem>
                  </Select>
                  {fieldErrors.zona && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Departamento Centro Educativo*
                </Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.departamentoced}
                  error={fieldErrors.departamentoced}
                >
                  <Select
                    name="departamentoced"
                    value={formData.departamentoced || ""}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.departamentoced,
                    }}
                  >
                    <MenuItem value="">Seleccione un departamento</MenuItem>
                    {departamentos.length > 0 ? (
                      departamentos.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Cargando...</MenuItem>
                    )}
                  </Select>
                  {fieldErrors.departamentoced && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Municipio Centro Educativo*
                </Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.municipioced}
                  error={fieldErrors.municipioced}
                >
                  <Select
                    id="municipioced"
                    name="municipioced"
                    value={formData.municipioced || ""}
                    onChange={handleChange}
                    disabled={!municipios.length}
                    inputProps={{
                      readOnly: camposBloqueados.municipioced,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccione un municipio
                    </MenuItem>
                    {municipios.map((municipio) => (
                      <MenuItem key={municipio.id} value={municipio.id}>
                        {municipio.municipio}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.municipioced && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">
                  Aldea Centro Educativo
                </Typography>
                <FormControl disabled={camposBloqueados.aldeaced} fullWidth>
                  <Select
                    name="aldeaced"
                    value={formData.aldeaced || ""}
                    onChange={handleChange}
                    disabled={!aldeas.length}
                    inputProps={{
                      readOnly: camposBloqueados.aldeaced,
                    }}
                  >
                    <MenuItem value="">Seleccione una aldea</MenuItem>
                    {aldeas.length > 0 ? (
                      aldeas.map((ald) => (
                        <MenuItem key={ald.id} value={ald.id}>
                          {ald.aldea}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Seleccione una aldea</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box
              sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.azul }}
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Guardar
              </Button>
            </Box>
            <Modal
              open={openSeleccionModal}
              onClose={() => {}} // Elimina la función onClose o déjala vacía
              aria-labelledby="seleccion-docente-title"
              disableBackdropClick // Esta prop evita que se cierre al hacer clic en el backdrop
              disableEscapeKeyDown // Esta prop evita que se cierre con la tecla ESC
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60%",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography
                  id="seleccion-docente-title"
                  variant="h6"
                  component="h2"
                  sx={{ mb: 2 }}
                >
                  Se encontraron múltiples registros
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Por favor seleccione el registro correcto:
                </Typography>

                <List>
                  {docentesEncontrados.map((docente, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => {
                        llenarFormulario(docente);
                        setOpenSeleccionModal(false);
                      }}
                      sx={{
                        borderBottom: "1px solid #eee",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${docente.nombre || "Sin nombre"} - ${
                          docente.centroeducativo || "Sin centro educativo"
                        }`}
                        secondary={
                          <>
                            <Box
                              component="span"
                              display="block"
                              fontWeight="bold"
                            >
                              Centro Educativo:{" "}
                              {docente.centroeducativo || "No especificado"}
                            </Box>
                            <Box component="span" display="block">
                              Nivel Educativo que Atiende:{" "}
                              {docente.nombrenivelced || ""} - Grado Educativo
                              que Atiende: {docente.nombregradoced || ""}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenSeleccionModal(false)}
                    sx={{ mr: 2 }}
                  >
                    Cancelar
                  </Button>
                </Box> */}
              </Box>
            </Modal>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default FormularioExterno;
