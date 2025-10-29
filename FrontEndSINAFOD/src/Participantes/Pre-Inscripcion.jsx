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
  Checkbox,
  Card,
  CardContent,
  CardActions,
  Chip,
  Autocomplete,
} from "@mui/material";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

const PreInscripcion = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [docentesEncontrados, setDocentesEncontrados] = useState([]);
  const [openSeleccionModal, setOpenSeleccionModal] = useState(false);
  const [cargos, setCargos] = useState([]);
  const [funcion, setFuncion] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentosRE, setDepartamentosRE] = useState([]);
  const [municipiosRE, setMunicipiosRE] = useState([]);
  const [showFormaciones, setShowFormaciones] = useState(true);
  const [formaciones, setFormaciones] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [aldeasP, setAldeaP] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [centroseducativos, setCentrosEducativos] = useState([]);
  const [openDNIModal, setOpenDNIModal] = useState(true);
  const [tempDNI, setTempDNI] = useState("");
  const [dniError, setDniError] = useState("");
  const [etnia, setEtnia] = useState("");
  const [nivelAtiendeP, setNivelAtiendeP] = useState("");
  const [ciclolAtiendeP, setCicloAtiendeP] = useState("");

  const [formData, setFormData] = useState({
    idinvestigacion: [],
    idformacion: [],
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
    idetnia: "",

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
    idaldea: null,
    tipoadministracion: "",
    creadopor: null,
  });

  const [camposBloqueados, setCamposBloqueados] = useState({
    correo: "",
    telefono: "",
    edad: "",
    fechanacimiento: "",
    identificacion: "",
    codigosace: "",
    nombre: "",
    apellido: "",
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
    idaldea: null,
    tipoadministracion: "",
  });

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

      // Validar y formatear teléfono
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
          telefonoFormateado = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
        }

        // asignar el valor formateado
        newData.telefono = telefonoFormateado;

        // validar longitud
        setFieldErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (soloNumeros.length !== 8) {
            newErrors.telefono = "El teléfono debe tener exactamente 8 dígitos (formato 0000-0000).";
          } else {
            newErrors.telefono = "";
          }
          return newErrors;
        });
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

  // Obtener aldea del participante
  useEffect(() => {
    if (!formData.municipioresidencia) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerMunicipios = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/aldeas/${formData.municipioresidencia}`
        );
        setAldeaP(response.data);
        console.log("aldeas", response.data);
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

  // Obtener gardo cuando cambia el nivel educativo seleccionado
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

  //Get para traer todas las formaciones con estado Planificadas
  useEffect(() => {
    const obtenerFomaciones = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/formacion`
        );

        // Filtrar solo las formaciones con estado "Planificada"
        const formacionesPlanificadas = response.data.filter(
          (formacion) => formacion.estado === "Planificada"
        );

        setFormaciones(formacionesPlanificadas);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerFomaciones();
  }, []);

  // Obtener centros educativos del participante
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

  // Obtener cargos que desempeña del centro educativo
  useEffect(() => {
    const obtenercargo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cargodes`
        );
        setCargos(response.data);
      } catch (error) {
        console.error("Error al obtener los cargos que desempeña", error);
      }
    };

    obtenercargo();
  }, []);

  // Obtener funcion que desempeña
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

  const obtenerDNI = async () => {
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
            confirmButtonColor: color.primary.azul,
          });
          console.log(response.data);
        } else {
          // Si hay múltiples registros
          setDocentesEncontrados(response.data);
          setOpenSeleccionModal(true); // Asegúrate de que esto se ejecute
          console.log(
            "Mostrando modal de selección con",
            response.data.length,
            "registros"
          );
          console.log(response.data);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      Swal.fire({
        title: "No se encontró ningún registro previo.",
        text: "Por favor ingrese sus datos",
        icon: "warning",
        timer: 12000,
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
          // Formato YYYY-MM-DD para inputs de tipo date
          fechaFormateada = fechaNacimiento.toISOString().split("T")[0];
        }
      } catch (e) {
        console.error("Error al formatear fecha:", e);
      }
    }

    setFormData((prev) => ({
      ...prev,

      /* Datos del participante */
      tienecentro: docente.tienecentro || false,
      codigosace: docente.codigosace || "",
      nombre: docente.nombre || "",
      apellido: docente.apellido || "",
      genero: docente.genero || "",
      identificacion: docente.identificacion || "",
      fechanacimiento: fechaFormateada || "",
      edad: docente.edad || "",
      correo: docente.correo || "",
      telefono: docente.telefono || "",
      idnivelacademicos: docente.idnivelacademicos || "",
      idgradoacademicos: docente.idgradoacademicos || "",
      añosdeservicio: docente.añosdeservicio || "",
      codigodered: docente.codigodered || "",
      deptoresidencia: docente.deptoresidencia || "",
      municipioresidencia: docente.municipioresidencia || "",
      aldearesidencia: docente.aldearesidencia || "",
      caserio: docente.caserio || "",
      idfuncion: docente.idfuncion || "",
      lugardetrabajo: docente.lugardetrabajo || "",

      /* Datos del centro educativo */
      idnivelatiende: docente.idnivelatiende || "",
      idcicloatiende: docente.idcicloatiende || "",
      cargo: docente.cargo || "",
      nombreced: docente.nombreced || "",
      codigosaceced: docente.codigosaceced || "",
      tipoadministracion: docente.tipoadministracion || "Gubernamental",
      tipocentro: docente.tipocentro || "",
      jornada: docente.jornada || "",
      modalidad: docente.modalidad || "",
      zona: docente.zona || "",
      idmunicipio: docente.idmunicipio || "",
      iddepartamento: docente.iddepartamento || "",
      idaldea: docente.idaldea || "",

      /* Datos de verificación */
      datoscorrectos: docente.datoscorrectos || false,
      autorizadatos: docente.autorizadatos || false,
    }));
    setCamposBloqueados({
      codigosace: !!docente.codigosace,
      nombre: !!docente.nombre,
      apellido: !!docente.apellido,
      genero: !!docente.genero,
      fechanacimiento: fechaFormateada,
      edad: !!docente.edad,
      identificacion: !!docente.identificacion,
      /*correo: !!docente.correo,
      telefono: !!docente.telefono,
      idnivelacademicos: !!docente.idnivelacademicos,
      idgradoacademicos: !!docente.idgradoacademicos,
      añosdeservicio: !!docente.añosdeservicio,
      codigodered: !!docente.codigodered,
      deptoresidencia: !!docente.deptoresidencia,
      municipioresidencia: !!docente.municipioresidencia,
      aldearesidencia: !!docente.aldearesidencia,
      caserio: !!docente.caserio,
      idfuncion: !!docente.idfuncion,*/

      /*Datos del centro educativo
      prebasica: !!docente.prebasica,
      basica: !!docente.basica,
      media: !!docente.media,
      primero: !!docente.primero,
      segundo: !!docente.segundo,
      tercero: !!docente.tercero,
      cuarto: !!docente.cuarto,
      quinto: !!docente.quinto,
      sexto: !!docente.sexto,
      septimo: !!docente.septimo,
      octavo: !!docente.octavo,
      noveno: !!docente.noveno,
      decimo: !!docente.decimo,
      onceavo: !!docente.onceavo,
      doceavo: !!docente.doceavo,
      cargo: !!docente.cargo,
      nombreced: !!docente.nombreced,
      codigosaceced: !!docente.codigosaceced,
      tipoadministracion: !!docente.tipoadministracion,
      tipocentro: !!docente.tipocentro,
      jornada: !!docente.jornada,
      modalidad: !!docente.modalidad,
      zona: !!docente.zona,
      idmunicipio: !!docente.idmunicipio,
      iddepartamento: !!docente.iddepartamento,
      idaldea: !!docente.idaldea,
 */
    });
  };


  useEffect(() => {
    // Mostrar modal al cargar el componente
    setOpenDNIModal(true);
  }, []);

  const ThankYouView = () => (
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
          ¡Inscripción Realizada!
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

  /*   // 1. Verificar al cargar si ya se envió el formulario
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
 */

  const FormacionesPreview = ({ formaciones, onContinue }) => {
    const [seleccionadas, setSeleccionadas] = useState([]);

    const toggleSeleccion = (id) => {
      setSeleccionadas((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const handleContinue = () => {
      // Llamar a la función onContinue con las formaciones seleccionadas
      onContinue(seleccionadas);
    };

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          padding: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, color: color.primary.azul }}>
          Formaciones Disponibles
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Selecciona una o más formaciones a las que deseas preinscribirte
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: "1200px", mb: 4 }}>
          {formaciones.map((formacion) => (
            <Grid item xs={12} md={6} lg={4} key={formacion.id}>
              <Card
                sx={{
                  width: "300px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: seleccionadas.includes(formacion.id)
                    ? `2px solid ${color.primary.azul}`
                    : "2px solid transparent",
                  cursor: "pointer",
                  transition: "border 0.3s ease",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
                onClick={() => toggleSeleccion(formacion.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Checkbox
                      checked={seleccionadas.includes(formacion.id)}
                      onChange={() => toggleSeleccion(formacion.id)}
                      onClick={(e) => e.stopPropagation()}
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="h5" component="div">
                      {formacion.formacion}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Tipo:</strong> {formacion.tipoformacion}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Modalidad:</strong> {formacion.modalidad}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Duración:</strong> {formacion.duracion.hours}h{" "}
                    {formacion.duracion.minutes}m
                  </Typography>

                  {(formacion.modalidad === "Virtual" ||
                    formacion.modalidad === "Bimodal") &&
                    formacion.plataforma && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Plataforma:</strong> {formacion.plataforma}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Fecha inicio:</strong>{" "}
                    {new Date(formacion.fechainicio).toLocaleDateString()}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Fecha final:</strong>{" "}
                    {new Date(formacion.fechafinal).toLocaleDateString()}
                  </Typography>

                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Estado:</strong>
                    </Typography>
                    <Chip
                      label={formacion.estado}
                      size="small"
                      color={
                        formacion.estado === "Completada"
                          ? "success"
                          : formacion.estado === "En curso"
                            ? "primary"
                            : "default"
                      }
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Dirigido a:</strong> {formacion.funciondirigido}
                  </Typography>

                  {formacion.espaciofisico && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      <strong>Lugar:</strong> {formacion.espaciofisico}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={seleccionadas.length === 0}
          sx={{
            mt: 2,
            mb: 4,
            padding: "10px 30px",
            backgroundColor: color.primary.azul,
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#a0a0a0",
            },
            "&:hover": {
              backgroundColor: color.primary.azulOscuro,
            },
          }}
        >
          Preinscripción ({seleccionadas.length} seleccionadas)
        </Button>
      </Box>
    );
  };

  // Render condicional
  // En tu componente principal, reemplaza el if(showFormaciones) por:
  if (showFormaciones) {
    return (
      <FormacionesPreview
        formaciones={formaciones}
        onContinue={(idsSeleccionados) => {
          setFormData((prev) => ({
            ...prev,
            idformacion: idsSeleccionados,
          }));
          setShowFormaciones(false);
          setOpenDNIModal(true);
        }}
      />
    );
  }

  const handleSave = async () => {
    const requiredFields = [
      "identificacion",
      "nombre",
      "correo",
      "apellido",
      "telefono",
      "fechanacimiento",
      "genero",
      "deptoresidencia",
      "municipioresidencia",
      "idnivelacademicos",
      "idgradoacademicos",
      "idfuncion",
      ...(formData.tienecentro
        ? [ // Si es solo participante → pedir también datos del centro educativo
          "tipocentro",
          "nombreced",
          "modalidad",
          "zona",
          "idmunicipio",
          "iddepartamento",
          "tipoadministracion",
          "jornada",
          "cargo",
          "idnivelatiende",
        ]
        : [] // Si no, solo lo personal
      ),
    ];

    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true;
      }
    });
    
    if (
      formData.tienecentro &&
      formData.idnivelatiende === 2 &&
      !formData.idcicloatiende
    ) {
      errors.idcicloatiende = "Este campo es obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // 🔹 Mapeo de nombres amigables para los campos
      const getFieldLabel = (field) => {
        switch (field) {
          case "identificacion": return "Identificación";
          case "nombre": return "Nombre";
          case "apellido": return "Apellido";
          case "correo": return "Correo electrónico";
          case "telefono": return "Teléfono";
          case "fechanacimiento": return "Fecha de nacimiento";
          case "cargo": return "Cargo que desempeñaen el centro educativo";
          case "genero": return "Género";
          case "deptoresidencia": return "Departamento de residencia";
          case "municipioresidencia": return "Municipio de residencia";
          case "idnivelacademicos": return "Nivel académico";
          case "idgradoacademicos": return "Grado académico";
          case "idfuncion": return "Cargo que desempeña";
          case "tipocentro": return "Tipo de centro";
          case "nombreced": return "Nombre del centro educativo";
          case "modalidad": return "Modalidad";
          case "zona": return "Zona";
          case "idmunicipio": return "Municipio";
          case "iddepartamento": return "Departamento";
          case "tipoadministracion": return "Tipo de administración";
          case "jornada": return "Jornada";
          default: return field;
        }
      };

      // 🔹 Crear lista de campos faltantes
      const camposFaltantes = Object.keys(errors)
        .map((field) => getFieldLabel(field))
        .join(", ");

      Swal.fire({
        title: "Campos obligatorios",
        text: `Faltan por llenar: ${camposFaltantes}`,
        icon: "warning",
        confirmButtonColor: color.primary.rojo,
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Crear copia de los datos
      let dataToSend = { ...formData };

      // 🚫 Si NO es solo participante, limpiar datos de centro educativo
      if (!formData.tienecentro) {
        dataToSend = {
          ...dataToSend,
          prebasica: null,
          basica: null,
          media: null,
          superior: null,
          primero: null,
          segundo: null,
          tercero: null,
          cuarto: null,
          quinto: null,
          sexto: null,
          septimo: null,
          octavo: null,
          noveno: null,
          decimo: null,
          onceavo: null,
          doceavo: null,
          cargo: null,
          nombreced: null,
          codigosaceced: null,
          tipoadministracion: null,
          tipocentro: null,
          jornada: null,
          modalidad: null,
          zona: null,
          idmunicipio: null,
          iddepartamento: null,
          idaldea: null,
        };
      }

      // Convertir strings vacíos a null
      dataToSend = Object.fromEntries(
        Object.entries(dataToSend).map(([key, value]) => [
          key,
          value === "" || (typeof value === "string" && value.trim() === "")
            ? null
            : value,
        ])
      );

      console.log("Datos a enviar:", dataToSend);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/participanteInvFormCed`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setFormSubmitted(true);
        Swal.fire({
          title: "Guardado",
          text: "Datos guardados correctamente",
          icon: "success",
          timer: 12000,
          confirmButtonColor: color.primary.azul,
        });
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al guardar datos",
        icon: "error",
        timer: 12000,
        confirmButtonColor: color.primary.rojo,
      });
    }
  };

  return (
    <>
      {formSubmitted ? (
        <ThankYouView />
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
            onClose={() => { }} // No permitimos cerrar haciendo click fuera
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
                  Registro de Participante
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
                  variant="h4"
                  sx={{ color: color.primary.azul, textAlign: "center", fontWeight: "bold" }}
                >
                  Datos Generales del Participante
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Código SACE / Identidad</Typography>
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
                <Typography variant="subtitle1">Identidad <span style={{ color: "red" }}> *</span></Typography>

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
                <Typography variant="subtitle1">Nombre <span style={{ color: "red" }}> *</span></Typography>
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
                <Typography variant="subtitle1">Apellido <span style={{ color: "red" }}> *</span></Typography>
                <TextField
                  fullWidth
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  error={fieldErrors.apellido}
                  helperText={
                    fieldErrors.apellido ? "Este campo es obligatorio" : ""
                  }
                  InputProps={{
                    readOnly: camposBloqueados.apellido,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl error={fieldErrors.genero}>
                  <Typography variant="subtitle1" error={fieldErrors.genero}>Género <span style={{ color: "red" }}> *</span></Typography>
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
                      label="Femenino"
                      disabled={camposBloqueados.genero}
                    />
                    <FormControlLabel
                      value="Masculino"
                      control={<Radio disabled={camposBloqueados.genero} />}
                      label="Masculino"
                      disabled={camposBloqueados.genero}
                    />
                    <FormControlLabel
                      value="No contestó"
                      control={<Radio disabled={camposBloqueados.genero} />}
                      label="Prefiero no decir"
                      disabled={camposBloqueados.genero}
                    />
                  </RadioGroup>
                  {fieldErrors.genero && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Fecha de Nacimiento <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      Haz clic en el año del calendario para mostrar todos los años.
                    </Typography>
                    <TextField
                      fullWidth
                      name="fechanacimiento"
                      value={formData.fechanacimiento}
                      onChange={handleChange}
                      type="date"
                      InputProps={{
                        readOnly: camposBloqueados.fechanacimiento,
                      }}
                      error={fieldErrors.fechanacimiento}
                      helperText={
                        fieldErrors.fechanacimiento ? "Este campo es obligatorio" : ""
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">Edad</Typography>
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      Se calcula automáticamente al ingresar la fecha de nacimiento.
                    </Typography>
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
                  InputProps={{
                    readOnly: camposBloqueados.correo,
                  }}
                  error={fieldErrors.correo}
                  helperText={
                    fieldErrors.correo ? "Este campo es obligatorio" : ""
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Teléfono</Typography>
                <TextField
                  fullWidth
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: camposBloqueados.telefono,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
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
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl fullWidth error={fieldErrors.idnivelacademicos}>
                  <Typography variant="subtitle1">Nivel Educativo <span style={{ color: "red" }}> *</span></Typography>
                  <Select
                    fullWidth
                    name="idnivelacademicos"
                    value={formData.idnivelacademicos || ""}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.idnivelacademicos,
                    }}
                  >
                    <MenuItem value="3">Media</MenuItem>
                    <MenuItem value="9">Superior</MenuItem>
                  </Select>
                  {fieldErrors.idnivelacademicos && (
                    <FormHelperText>Este campo es obligatorio</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Grado Académico <span style={{ color: "red" }}> *</span></Typography>
                <FormControl
                  fullWidth
                  disabled={camposBloqueados.idgradoacademicos}
                >
                  <Select
                    fullWidth
                    name="idgradoacademicos"
                    value={formData.idgradoacademicos || ""}
                    onChange={handleChange}
                    disabled={!gardoP.length}
                    inputProps={{
                      readOnly: camposBloqueados.idgradoacademicos,
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
                <Typography variant="subtitle1">
                  Cargo que Desempeña<span style={{ color: "red" }}> *</span>
                </Typography>
                <FormControl fullWidth error={fieldErrors.idfuncion}>
                  <Select
                    name="idfuncion"
                    value={formData.idfuncion}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.idfuncion,
                    }}
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
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Años de Servicio</Typography>
                <TextField
                  fullWidth
                  name="añosdeservicio"
                  value={formData.añosdeservicio || ""}
                  onChange={handleChange}


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
                  Departamento de Residencia <span style={{ color: "red" }}> *</span>
                </Typography>
                <FormControl fullWidth error={fieldErrors.deptoresidencia}>
                  <Select
                    name="deptoresidencia"
                    value={formData.deptoresidencia}
                    onChange={handleChange}
                    inputProps={{
                      readOnly: camposBloqueados.deptoresidencia,
                    }}
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
                  Municipio de Residencia <span style={{ color: "red" }}> *</span>
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
              <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle1">Caserío</Typography>
                <TextField
                  fullWidth
                  name="caserio"
                  value={formData.caserio}
                  onChange={handleChange}
                  inputProps={{
                    readOnly: camposBloqueados.caserio,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.soloparticipante}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          soloparticipante: e.target.checked,
                        })
                      }
                    />
                  }
                  label="¿Representa a un Centro Educativo?"
                />
              </Grid>

            </Grid>
            {formData.soloparticipante && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography
                    variant="h4"
                    sx={{ color: color.primary.azul, textAlign: "center", fontWeight: "bold" }}
                  >
                    Datos del Centro Educativo Que Representa
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Departamento del Centro Educativo <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.iddepartamento}>
                    <Select
                      name="iddepartamento"
                      value={formData.iddepartamento || ""}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.iddepartamento,
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
                    {fieldErrors.iddepartamento && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Municipio del Centro Educativo <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.idmunicipio}>
                    <Select
                      id="idmunicipio"
                      name="idmunicipio"
                      value={formData.idmunicipio || ""}
                      onChange={handleChange}
                      disabled={!municipios.length}
                      inputProps={{
                        readOnly: camposBloqueados.idmunicipio,
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
                    {fieldErrors.idmunicipio && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Aldea del Centro Educativo
                  </Typography>
                  <FormControl disabled={camposBloqueados.idaldea} fullWidth>
                    <Select
                      name="idaldea"
                      value={formData.idaldea || ""}
                      onChange={handleChange}
                      disabled={!aldeas.length}
                      inputProps={{
                        readOnly: camposBloqueados.idaldea,
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
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">Centro Educativo <span style={{ color: "red" }}> *</span></Typography>
                  <FormControl fullWidth disabled={camposBloqueados.nombreced}>
                    <Autocomplete
                      freeSolo
                      options={centroseducativos}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.nombreced
                      }
                      value={formData.nombreced || ""}
                      onChange={(event, newValue) => {
                        if (typeof newValue === "object" && newValue !== null) {
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
                              {option.departamentoced} - {option.municipioced} |{" "}
                              {option.nivelacademico}
                            </div>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label=""
                          error={fieldErrors.nombreced}
                          helperText={fieldErrors.nombreced ? "Este campo es obligatorio" : ""}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Código SACE del Centro Educativo  <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="codigosaceced"
                    value={formData.codigosaceced}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: camposBloqueados.codigosaceced,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <FormControl fullWidth error={fieldErrors.tipoadministracion}>
                    <Typography variant="subtitle1">
                      Tipo de Administración <span style={{ color: "red" }}> *</span>
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
                  <FormControl fullWidth error={fieldErrors.tipocentro}>
                    <Typography variant="subtitle1">
                      Tipo de Centro Educativo <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <Select
                      fullWidth
                      name="tipocentro"
                      value={formData.tipocentro || ""}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.tipocentro,
                      }}
                    >
                      <MenuItem value="Unidocente">Unidocente</MenuItem>
                      <MenuItem value="Bidocente">Bidocente</MenuItem>
                      <MenuItem value="Multidocente">Multidocente</MenuItem>
                      <MenuItem value="No es centro educativo">
                        No es centro educativo
                      </MenuItem>
                    </Select>
                    {fieldErrors.tipocentro && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <FormControl fullWidth error={fieldErrors.jornada}>
                    <Typography variant="subtitle1">
                      Jornada que Atiende <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <Select
                      fullWidth
                      name="jornada"
                      value={formData.jornada || ""}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.jornada,
                      }}
                    >
                      <MenuItem value="Matutina">Matutina</MenuItem>
                      <MenuItem value="Vespertina">Vespertina</MenuItem>
                      <MenuItem value="Nocturna">Nocturna</MenuItem>
                      <MenuItem value="Mixta">Mixta</MenuItem>
                      <MenuItem value="Ninguna">Ninguna</MenuItem>
                    </Select>
                    {fieldErrors.jornada && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <FormControl fullWidth error={fieldErrors.modalidad}>
                    <Typography variant="subtitle1">
                      Modalidad que Atiende <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <Select
                      fullWidth
                      name="modalidad"
                      value={formData.modalidad || ""}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.modalidad,
                      }}
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

                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Zona Centro Educativo <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.zona}>
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
                  <Typography variant="subtitle1">Nivel Educativo <span style={{ color: "red" }}> *</span></Typography>
                  <FormControl disabled={camposBloqueados.idnivelatiende} fullWidth error={fieldErrors.idnivelatiende}>
                    <Select
                      name="idnivelatiende"
                      value={formData.idnivelatiende || ""}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.idnivelatiende,
                      }}
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
                    {fieldErrors.idnivelatiende && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {formData.idnivelatiende === 2 && (
                  <Grid size={{ xs: 12, md: 12 }}>

                    <Typography variant="subtitle1">Ciclo Académico <span style={{ color: "red" }}> *</span></Typography>
                    <FormControl disabled={camposBloqueados.idcicloatiende} fullWidth>
                      <Select
                        name="idcicloatiende"
                        value={formData.idcicloatiende || ""}
                        onChange={handleChange}
                        disabled={!nivelAtiendeP.length}
                        inputProps={{
                          readOnly: camposBloqueados.idcicloatiende,
                        }}
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

                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="subtitle1">
                    Cargo que Desempeña en el Centro Educativo <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.cargo}>
                    <Select
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      inputProps={{
                        readOnly: camposBloqueados.cargo,
                      }}
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
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>


              </Grid>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.datoscorrectos}
                      onChange={handleChange}
                      name="datoscorrectos"
                      disabled={camposBloqueados.datoscorrectos}
                    />
                  }
                  label="Declaración que los datos proporcionados son correctos."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.autorizadatos}
                      onChange={handleChange}
                      name="autorizadatos"
                      disabled={camposBloqueados.autorizadatos}
                    />
                  }
                  label="Autorización para el uso de información con fines administrativos y educativos"
                />
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
              onClose={() => { }} // Elimina la función onClose o déjala vacía
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
                        primary={`${docente.nombre || "Sin nombre"} - ${docente.identificacion || "Sin centro educativo"
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
                            {/*  <Box component="span" display="block">
                              Nivel Educativo que Atiende:{" "}
                              {docente.nivelacademico_ced || ""} - Grado
                              Educativo que Atiende:{" "}
                              {docente.gradoacademico_ced || ""}
                            </Box> */}
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

export default PreInscripcion;
