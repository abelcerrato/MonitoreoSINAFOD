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
  List,
  ListItem,
  ListItemText,
  Modal,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import TablaPacticantes from "./TablaParticipantes";
import Swal from "sweetalert2";

const FormularParticipantes = () => {
  const location = useLocation();
  const [fieldErrors, setFieldErrors] = useState({});
  const { investCap, formacioninvest } = location.state || {};
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentosRE, setDepartamentosRE] = useState([]);
  const [municipiosRE, setMunicipiosRE] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [value, setValue] = React.useState("1");
  const [funcion, setFuncion] = useState([]);
  const [centroseducativos, setCentrosEducativos] = useState([]);
  const [aldeasP, setAldeaP] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [etnia, setEtnia] = useState("");
  const [nivelAtiendeP, setNivelAtiendeP] = useState("");
  const [ciclolAtiendeP, setCicloAtiendeP] = useState("");
  const [formData, setFormData] = useState({
    correo: "",
    telefono: "",
    edad: "",
    fechanacimiento: "",
    identificacion: "",
    codigosace: "",
    nombre: "",
    apellido: "",
    genero: "",
    añosdeservicio: 0,
    codigodered: "",
    deptoresidencia: "",
    municipioresidencia: "",
    aldearesidencia: null,
    idnivelacademicos: "",
    idgradoacademicos: null,
    idfuncion: "",
    caserio: "",
    idetnia: "",
    lugardetrabajo: "",
    tipocentro: "",
    nombreced: "",
    codigosaceced: "",
    idnivelatiende: "",
    idcicloatiende: "",
    modalidad: "",
    datoscorrectos: false,
    autorizadatos: false,
    zona: "",
    idmunicipio: "",
    iddepartamento: "",
    cargo: "",
    idaldea: null,
    tipoadministracion: "Gubernamental",
    creadopor: user.id,
  });

  const limpiarCampos = () => {
    setFormData((prevState) => ({
      ...prevState,
      correo: "",
      telefono: "",
      edad: "",
      fechanacimiento: "",
      identificacion: "",
      codigosace: "",
      nombre: "",
      cargo: "",
      genero: "",
      añosdeservicio: 0,
      codigodered: "",
      deptoresidencia: "",
      municipioresidencia: "",
      aldearesidencia: null,
      idnivelacademicos: "",
      idgradoacademicos: null,
      idfuncion: "",
      caserio: "",
      tipocentro: "",
      lugardetrabajo: "",
      nombreced: "",
      codigosaceced: "",
      prebasica: false,
      basica: false,
      media: false,
      superior: false,
      primero: false,
      segundo: false,
      tercero: false,
      cuarto: false,
      quinto: false,
      sexto: false,
      septimo: false,
      octavo: false,
      noveno: false,
      decimo: false,
      onceavo: false,
      doceavo: false,
      modalidad: "",
      datoscorrectos: false,
      autorizadatos: false,
      zona: "",
      idmunicipio: "",
      iddepartamento: "",
      idaldea: null,
      tipoadministracion: "Gubernamental",
      creadopor: prevState.creadopor,
    }));
  };

  const handleChangeValues = (event, newValue) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    const baseRequiredFields = [
      "identificacion",
      "nombre",
      "apellido",
      "idfuncion",
      "genero",
      "deptoresidencia",
      "municipioresidencia",
      "idnivelacademicos",
      "fechanacimiento",
      "correo",
      "telefono",
    ];

    // Campos condicionales (no obligatorios para investigación)
    const conditionalRequiredFields = [
      "nombreced",
      "codigosaceced",
      "zona",
      "idmunicipio",
      "iddepartamento",
      "tipoadministracion",
    ];

    // Construir lista de campos requeridos según el tipo
    const requiredFields = [
      ...baseRequiredFields,
      ...(formacioninvest !== "investigacion" ? conditionalRequiredFields : []),
    ];
    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true; // Marcar campo como vacío
      }
    });

    // Si hay campos vacíos, actualizar estado y mostrar alerta
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

    const transformFormData = (data) => {
      return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] === "" ? null : data[key];
        return acc;
      }, {});
    };
    try {
      const transformedFormData = transformFormData(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/participante/${formacioninvest}/${investCap}`,
        transformedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        limpiarCampos();
        Swal.fire({
          title: "Guardado",
          text: "Datos guardados correctamente",
          icon: "success",
          timer: 6000,
          confirmButtonColor: color.primary.azul,
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al guardar datos",
        icon: "error",
        timer: 6000,
        confirmButtonColor: color.primary.rojo,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // 1) Manejar checkboxes (Material-UI usa `checked` en lugar de `value`)
    let sanitizedValue =
      type === "checkbox" ? checked : value === null ? "" : value;

    setFormData((prevData) => {
      // Base de la nueva data
      let newData = { ...prevData, [name]: sanitizedValue };

      if (name === "añosdeservicio") {
        if (!/^\d*$/.test(value)) {
          return prevData;
        }
      }

      // Capitalizar nombre y apellido
      if (name === "nombre" || name === "apellido") {
        newData[name] = value
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
      //Validar y formatear teléfono
      if (name === "telefono") {
        // eliminar todo lo que no sea número
        let soloNumeros = value.replace(/\D/g, "");

        // limitar a máximo 8 números
        if (soloNumeros.length > 8) {
          soloNumeros = soloNumeros.slice(0, 8);
        }

        // aplicar formato 0000-0000 si hay más de 4 dígitos
        let telefonoFormateado = soloNumeros;
        if (soloNumeros.length > 4) {
          telefonoFormateado =
            soloNumeros.slice(0, 4) + "-" + soloNumeros.slice(4);
        }

        newData.telefono = telefonoFormateado;

        setFieldErrors((prevErrors) => {
          let newErrors = { ...prevErrors };
          if (soloNumeros.length !== 8) {
            newErrors.telefono = "El teléfono debe tener 8 dígitos.";
          } else {
            newErrors.telefono = "";
          }
          return newErrors;
        });
      }

      //Validar y formatear teléfono
      if (name === "telefono") {
        // eliminar todo lo que no sea número
        let soloNumeros = value.replace(/\D/g, "");

        // limitar a máximo 8 números
        if (soloNumeros.length > 8) {
          soloNumeros = soloNumeros.slice(0, 8);
        }

        // aplicar formato 0000-0000 si hay más de 4 dígitos
        let telefonoFormateado = soloNumeros;
        if (soloNumeros.length > 4) {
          telefonoFormateado =
            soloNumeros.slice(0, 4) + "-" + soloNumeros.slice(4);
        }

        newData.telefono = telefonoFormateado;

        setFieldErrors((prevErrors) => {
          let newErrors = { ...prevErrors };
          if (soloNumeros.length !== 8) {
            newErrors.telefono = "El teléfono debe tener 8 dígitos.";
          } else {
            newErrors.telefono = "";
          }
          return newErrors;
        });
      }

      // Si es fecha de nacimiento, calcular edad
      if (name === "fechanacimiento" && value) {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          newData.edad = age.toString();
        } else {
          // Si la fecha no es válida, limpiamos la edad
          newData.edad = "";
        }
      }
      return newData;
    });
  };


  // Obtener Etnia
  useEffect(() => {
    const obtenerEtnia = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/etnias`
        );
        setEtnia(response.data);
      } catch (error) {
        console.error("Error al obtener los Etnia", error);
      }
    };

    obtenerEtnia();
  }, []);

  // Obtener cargos que desempeña del centro educativo
  useEffect(() => {
    const obteneridfuncion = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cargodes`
        );
        setCargos(response.data);
      } catch (error) {
        console.error("Error al obtener los cargos que desempeña", error);
      }
    };

    obteneridfuncion();
  }, []);

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
    if (!formData.iddepartamento) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/municipios/${formData.iddepartamento}`
        );
        setMunicipios(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.iddepartamento]);

  // Obtener aldea del centro educativo
  useEffect(() => {
    if (!formData.idmunicipio) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/aldeas/${formData.idmunicipio}`
        );
        setAldea(response.data);
      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.idmunicipio]);


  // Obtener nivel academico que atiende el participante
  useEffect(() => {

    const obtenerNivelAtiendeParticipante = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/nivelesAcademicos`
        );
        setNivelAtiendeP(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenerNivelAtiendeParticipante();
  }, []);

  // Obtener ciclo academico que atiende el participante
  useEffect(() => {
    if (!formData.idnivelatiende) return;
    const obtenerCicloAtienteParticipante = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cicloAcademicoNivel/${formData.idnivelatiende}`
        );
        setCicloAtiendeP(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenerCicloAtienteParticipante();
  }, [formData.idnivelatiende]);

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
    if (!formData.idnivelacademicos) return;
    const obtenergardo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/gradoAcademicoNivel/${formData.idnivelacademicos}`
        );
        setGradoP(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenergardo();
  }, [formData.idnivelacademicos]);

  // Obtener cargo que desempeña
  useEffect(() => {
    const obtenerfuncion = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cargodes`
        );
        setFuncion(response.data);
      } catch (error) {
        console.error("Error al obtener los cargos que desempeña", error);
      }
    };

    obtenerfuncion();
  }, []);

  // Obtener centreos educativos del participante
  useEffect(() => {
    const obtenerCentrosEducativos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/centroeducativoiddepto/${formData.iddepartamento}/${formData.idmunicipio}`
        );
        setCentrosEducativos(response.data);
      } catch (error) {
        console.error("Error al obtener los departamentos", error);
      }
    };

    obtenerCentrosEducativos();
  }, [formData.iddepartamento, formData.idmunicipio]);

  const [docentesEncontrados, setDocentesEncontrados] = useState([]);
  const [openSeleccionModal, setOpenSeleccionModal] = useState(false);

  const obtenerDNI = async (campo) => {
    const filtro =
      formData[campo] && formData[campo].trim() !== "" ? formData[campo] : null;

    if (!filtro) {
      Swal.fire({
        title: "Campo vacío",
        text: "Por favor, ingrese un valor en el campo seleccionado.",
        icon: "warning",
        confirmButtonColor: color.primary.rojo,
      });
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/filtroDocentes/${filtro}`
      );
      console.log("ver", response.data);

      if (response.data && response.data.length > 0) {
        if (response.data.length === 1) {
          // Si solo hay un registro, llenar directamente
          llenarFormulario(response.data[0]);
          Swal.fire({
            title:
              formacioninvest === "investigacion"
                ? "Investigador Encontrado"
                : "Participante Encontrado",
            text:
              formacioninvest === "investigacion"
                ? "Se encontraron datos del investigador"
                : "Se encontraron datos del participante",
            icon: "success",
            timer: 6000,
            confirmButtonColor: color.primary.azul,
          });
        } else {
          // Si hay múltiples registros, mostrar modal de selección
          setDocentesEncontrados(response.data);
          setOpenSeleccionModal(true);
        }
      } else {
        Swal.fire({
          title:
            formacioninvest === "investigacion"
              ? "Investigador No Encontrado"
              : "Participante No Encontrado",
          text: "No se encontraron registros",
          icon: "info",
          timer: 6000,
          confirmButtonColor: color.primary.rojo,
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      Swal.fire({
        title: "Error",
        text: "Error al buscar los datos",
        icon: "error",
        timer: 6000,
        confirmButtonColor: color.primary.rojo,
      });
    }
  };

  const llenarFormulario = (docente) => {
    let fechaFormateada = "";
    if (docente.fechanacimiento) {
      try {
        const fechaNacimiento = new Date(docente.fechanacimiento);
        if (!isNaN(fechaNacimiento.getTime())) {
          // Verifica si la fecha es válida
          fechaFormateada = fechaNacimiento.toISOString().split("T")[0];
        }
      } catch (e) {
        console.error("Error al formatear fecha:", e);
      }
    }

    setFormData((prev) => ({
      ...prev,
      /*Datos del participante */
      codigosace: docente.codigosace || "",
      identificacion: docente.identificacion || "",
      nombre: docente.nombre || "",
      apellido: docente.apellido || "",
      genero: docente.genero || "",
      fechanacimiento: fechaFormateada || "",
      añosdeservicio: docente.añosdeservicio || "",
      idetnia: docente.idetnia || "",
      zona: docente.zona || "",
      edad: docente.edad || "",
      correo: docente.correo || "",
      telefono: docente.telefono || "",
      idnivelacademicos: docente.idnivelacademicos || "",
      idgradoacademicos: docente.idgradoacademicos || "",
      codigodered: docente.codigodered || "",
      deptoresidencia: docente.deptoresidencia || "",
      municipioresidencia: docente.municipioresidencia || "",
      aldearesidencia: docente.aldearesidencia || "",
      caserio: docente.caserio || "",
      idfuncion: docente.idfuncion || "",
      lugardetrabajo: docente.lugardetrabajo || "",

      /*Datos del centro educativo */
      idnivelatiende: docente.idnivelatiende || "",
      idcicloatiende: docente.idcicloatiende || "",
      cargo: docente.cargo || "",
      nombreced: docente.nombreced || "",
      codigosaceced: docente.codigosaceced || "",
      tipoadministracion: docente.tipoadministracion || "Gubernamental",
      tipocentro: docente.tipocentro || "",
      jornada: docente.jornada || "",
      modalidad: docente.modalidad || "",
      idmunicipio: docente.idmunicipio || "",
      iddepartamento: docente.iddepartamento || "",
      idaldea: docente.idaldea || "",
      datoscorrectos: docente.datoscorrectos || false,
      autorizadatos: docente.autorizadatos || false,

    }));
  };

  return (
    <>
      <Dashboard>
        <Paper
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
          elevation={3}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: color.primary.azul }}
              >
                {formacioninvest === "investigacion"
                  ? "Registro de Investigadores"
                  : "Registro de Participantes"}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}
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
          </Grid>
          <TabContext value={value}>
            {formacioninvest === "investigacion" ? (
              <Tabs
                value={value}
                onChange={handleChangeValues}
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Datos Generales del Investigadores" value="1" />
              </Tabs>
            ) : (
              <>
                <Tabs
                  value={value}
                  onChange={handleChangeValues}
                  allowScrollButtonsMobile
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Datos Generales del Participante" value="1" />
                  <Tab label="Datos del Centro Educativo" value="2" />
                </Tabs>
              </>
            )}

            {/* Tab 1: Datos Generales del Participante */}
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Código SACE</Typography>
                  <Grid spacing={2} container>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <TextField
                        fullWidth
                        name="codigosace"
                        value={formData.codigosace}
                        onChange={handleChange}
                        error={fieldErrors.codigosace}
                        helperText={
                          fieldErrors.codigosace
                            ? "Este campo es obligatorio"
                            : ""
                        }
                      />
                    </Grid>
                    {/* <Grid size={{ xs: 12, md: 3 }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul }}
                        onClick={() => obtenerDNI("codigosace")}
                      >
                        Buscar
                      </Button>
                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Identidad</Typography>
                  <Grid spacing={2} container>
                    <Grid size={{ xs: 12, md: 9 }}>
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
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul }}
                        onClick={() => obtenerDNI("identificacion")}
                      >
                        Buscar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nombre</Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={fieldErrors.nombre}
                    helperText={
                      fieldErrors.nombre ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Apellido</Typography>
                  <TextField
                    fullWidth
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    error={fieldErrors.apellido}
                    helperText={
                      fieldErrors.apellido ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl error={fieldErrors.genero}>
                    <Typography variant="subtitle1">Género</Typography>
                    <RadioGroup
                      row
                      name="genero"
                      value={formData.genero}
                      onChange={(e) =>
                        setFormData({ ...formData, genero: e.target.value })
                      }
                    >
                      <FormControlLabel
                        value="Femenino"
                        control={<Radio />}
                        label="Femenino"
                      />
                      <FormControlLabel
                        value="Masculino"
                        control={<Radio />}
                        label="Masculino"
                      />
                      <FormControlLabel
                        value="No contestó"
                        control={<Radio />}
                        label="Prefiero no decir"
                      />
                    </RadioGroup>
                    {fieldErrors.genero && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                        error={fieldErrors.fechanacimiento}
                        helperText={
                          fieldErrors.fechanacimiento ? "Este campo es obligatorio" : ""
                        }
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Correo Electrónico
                  </Typography>
                  <TextField
                    fullWidth
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Teléfono</Typography>
                  <TextField
                    fullWidth
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    error={fieldErrors.telefono}
                    helperText={
                      fieldErrors.telefono ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Etnia
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="idetnia"
                      value={formData.idetnia}
                      onChange={handleChange}

                    >
                      <MenuItem value="" disabled>
                        Seleccione una etnia
                      </MenuItem>
                      {etnia.length > 0 ? (
                        etnia.map((et) => (
                          <MenuItem key={et.id} value={et.id}>
                            {et.etnia}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>

                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nivel Educativo</Typography>

                  <FormControl fullWidth error={fieldErrors.idnivelacademicos}>
                    <Select
                      name="idnivelacademicos"
                      value={formData.idnivelacademicos || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="3">Media</MenuItem>
                      <MenuItem value="4">Superior</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Grado Académico</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="idgradoacademicos"
                      value={formData.idgradoacademicos || ""}
                      onChange={handleChange}
                      disabled={!gardoP.length}
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Años de Servicio</Typography>
                  <TextField
                    fullWidth
                    name="añosdeservicio"
                    value={formData.añosdeservicio || ""}
                    onChange={handleChange}

                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Código de Red al que Pertenece
                  </Typography>
                  <TextField
                    fullWidth
                    name="codigodered"
                    value={formData.codigodered || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Cargo que Desempeña
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.idfuncion}>
                    <Select
                      name="idfuncion"
                      value={formData.idfuncion}
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>
                        Seleccione un cargo
                      </MenuItem>
                      {funcion.length > 0 ? (
                        funcion.map((dep) => (
                          <MenuItem key={dep.id} value={dep.id}>
                            {dep.cargo}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.idfuncion && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Departamento de Residencia
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.deptoresidencia}>
                    <Select
                      name="deptoresidencia"
                      value={formData.deptoresidencia}
                      onChange={handleChange}
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Municipio de Residencia
                  </Typography>
                  <FormControl
                    fullWidth
                    error={fieldErrors.municipioresidencia}
                  >
                    <Select
                      id="municipioresidencia"
                      name="municipioresidencia"
                      value={formData.municipioresidencia || ""}
                      onChange={handleChange}
                      disabled={!municipiosRE.length}
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Aldea de Residencia
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldearesidencia"
                      value={formData.aldearesidencia || ""}
                      onChange={handleChange}
                      disabled={!aldeasP.length}
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Caserío</Typography>
                  <TextField
                    fullWidth
                    name="caserio"
                    value={formData.caserio}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Lugar de Trabajo</Typography>
                <TextField
                  fullWidth
                  name="lugardetrabajo"
                  value={formData.lugardetrabajo}
                  onChange={handleChange}

                />
              </Grid>

              {formacioninvest === "investigacion" && (
                <Box
                  sx={{
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
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
              )}
            </TabPanel>
            {/* Tab 2: Datos del Centro Educativo */}

            {formacioninvest !== "investigacion" && (
              <TabPanel value="2">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Departamento del Centro Educativo
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.iddepartamento}>
                      <Select
                        name="iddepartamento"
                        value={formData.iddepartamento || ""}
                        onChange={handleChange}
                      >
                        <MenuItem value="" disabled>
                          Seleccione un departamento
                        </MenuItem>
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
                      {fieldErrors.iddepartamento && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Municipio del Centro Educativo
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.idmunicipio}>
                      <Select
                        id="idmunicipio"
                        name="idmunicipio"
                        value={formData.idmunicipio || ""}
                        onChange={handleChange}
                        disabled={!municipios.length}
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
                      {fieldErrors.idmunicipio && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Aldea del Centro Educativo
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="idaldea"
                        value={formData.idaldea || ""}
                        onChange={handleChange}
                        disabled={!aldeas.length}
                      >
                        <MenuItem value="" disabled>
                          Seleccione una aldea
                        </MenuItem>
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Centro Educativo
                    </Typography>
                    <FormControl fullWidth>
                      <Autocomplete
                        freeSolo
                        options={centroseducativos}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.nombreced
                        }
                        value={formData.nombreced || ""}
                        onChange={(event, newValue) => {
                          if (
                            typeof newValue === "object" &&
                            newValue !== null
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              nombreced: newValue.nombreced,
                              codigosaceced: newValue.codigosace,
                            }));
                          }
                        }}
                        onInputChange={(event, newInputValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            nombreced: newInputValue,
                          }));
                        }}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <div>
                              <strong>{option.nombreced}</strong>
                              <div style={{ fontSize: "0.8rem" }}>
                                {option.departamentoced} - {option.municipioced}{" "}
                                | {option.nivelacademico}
                              </div>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="" />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Código SACE del Centro Educativo
                    </Typography>
                    <TextField
                      fullWidth
                      name="codigosaceced"
                      value={formData.codigosaceced}
                      onChange={handleChange}
                      error={fieldErrors.codigosaceced}
                      helperText={
                        fieldErrors.codigosaceced
                          ? "Este campo es obligatorio"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Tipo de Administración
                      </Typography>
                      <RadioGroup
                        row
                        name="tipoadministracion"
                        value={formData.tipoadministracion}
                        onChange={(e) =>
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
                        />
                        <FormControlLabel
                          value="No Gubernamental"
                          control={<Radio />}
                          label="No Gubernamental"
                        />
                      </RadioGroup>
                      {fieldErrors.tipoadministracion && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.tipocentro}>
                      <Typography variant="subtitle1">
                        Tipo de Centro Educativo
                      </Typography>
                      <Select
                        fullWidth
                        name="tipocentro"
                        value={formData.tipocentro || ""}
                        onChange={handleChange}
                      >
                        <MenuItem value="Unidocente">Unidocente</MenuItem>
                        <MenuItem value="Bidocente">Bidocente</MenuItem>
                        <MenuItem value="Multidocente">Multidocente</MenuItem>
                        <MenuItem value="No es centro educativo">
                          No es centro educativo
                        </MenuItem>
                      </Select>
                      {fieldErrors.tipocentro && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.jornada}>
                      <Typography variant="subtitle1">
                        Jornada que Atiende
                      </Typography>
                      <Select
                        fullWidth
                        name="jornada"
                        value={formData.jornada || ""}
                        onChange={handleChange}
                      >
                        <MenuItem value="Matutina">Matutina</MenuItem>
                        <MenuItem value="Vespertina">Vespertina</MenuItem>
                        <MenuItem value="Nocturna">Nocturna</MenuItem>
                        <MenuItem value="Mixta">Mixta</MenuItem>
                        <MenuItem value="Ninguna">Ninguna</MenuItem>
                      </Select>
                      {fieldErrors.jornada && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.modalidad}>
                      <Typography variant="subtitle1">
                        Modalidad que Atiende
                      </Typography>
                      <Select
                        fullWidth
                        name="modalidad"
                        value={formData.modalidad || ""}
                        onChange={handleChange}
                      >
                        <MenuItem value="Virtual">Virtual</MenuItem>
                        <MenuItem value="Presencial">Presencial</MenuItem>
                        <MenuItem value="Bimodal">Bimodal</MenuItem>
                      </Select>
                      {fieldErrors.modalidad && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Zona Centro Educativo
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.zona}>
                      <Select
                        name="zona"
                        value={formData.zona}
                        onChange={handleChange}
                      >
                        <MenuItem value="Rural">Rural</MenuItem>
                        <MenuItem value="Urbana">Urbana</MenuItem>
                      </Select>
                      {fieldErrors.zona && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle1">Nivel Educativo*</Typography>
                    <FormControl  fullWidth>
                      <Select
                        name="idnivelatiende"
                        value={formData.idnivelatiende || ""}
                        onChange={handleChange}
                    
                      >
                        <MenuItem value="">Seleccione un nivel educativo</MenuItem>
                        {nivelAtiendeP.length > 0 ? (
                          nivelAtiendeP.map((ni) => (
                            <MenuItem key={ni.id} value={ni.id}>
                              {ni.nombre}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Seleccione nivel educativo</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.idnivelatiende === 2 && (
                    <Grid size={{ xs: 12, md: 12 }}>

                      <Typography variant="subtitle1">Ciclo Académico*</Typography>
                      <FormControl fullWidth>
                        <Select
                          name="idcicloatiende"
                          value={formData.idcicloatiende || ""}
                          onChange={handleChange}
                          disabled={!nivelAtiendeP.length}
                        
                        >
                          <MenuItem value="">Seleccione un ciclo académico</MenuItem>
                          {ciclolAtiendeP.length > 0 ? (
                            ciclolAtiendeP.map((ci) => (
                              <MenuItem key={ci.id} value={ci.id}>
                                {ci.ciclo}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>Seleccione ciclo académico</MenuItem>
                          )}
                        </Select>
                      </FormControl>

                    </Grid>
                  )}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Cargo que Desempeña en el Centro Educativo
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.cargo}>
                      <Select
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                      >
                        <MenuItem value="" disabled>
                          Seleccione un cargo
                        </MenuItem>
                        {cargos.length > 0 ? (
                          cargos.map((dep) => (
                            <MenuItem key={dep.id} value={dep.id}>
                              {dep.cargo}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>Cargando...</MenuItem>
                        )}
                      </Select>
                      {fieldErrors.cargo && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
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
              </TabPanel>
            )}
          </TabContext>

          {/* Modal para selección de docente cuando hay múltiples resultados */}
          <Modal
            open={openSeleccionModal}
            onClose={() => setOpenSeleccionModal(false)}
            aria-labelledby="seleccion-docente-modal"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: 800,
                maxHeight: "80vh",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow: "auto",
              }}
            >
              <Typography
                id="seleccion-docente-modal"
                variant="h6"
                component="h2"
                sx={{ mb: 3 }}
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
                      primary={`${docente.nombre || "Sin nombre"} - ${docente.identificacion || "Sin identificación"
                        }`}
                      secondary={
                        <>
                          <Box
                            component="span"
                            display="block"
                            fontWeight="bold"
                          >
                            Centro Educativo:{" "}
                            {docente.nombreced || "No especificado"}
                          </Box>
                          <Box component="span" display="block">
                            Nivel Educativo que Atiende:{" "}
                            {docente.nivelacademico_ced || ""} - Grado Educativo
                            que Atiende: {docente.gradoacademico_ced || ""}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenSeleccionModal(false)}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Modal>
        </Paper>
        <TablaPacticantes
          investCap={investCap}
          isSaved={isSaved}
          setIsSaved={setIsSaved}
          formacioninvest={formacioninvest}
        />
      </Dashboard>
    </>
  );
};

export default FormularParticipantes;
