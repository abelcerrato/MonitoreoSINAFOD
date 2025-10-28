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
  Checkbox,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import Swal from "sweetalert2";

const ModificarParticipante = () => {
  const { user } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const { formacioninvest } = location.state || {};
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
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
    tienecentro: false,
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
    idetnia: "",
    idcentroeducativo: "",
    idcentropart: "",

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
    creadopor: user.id,
  });

  const handleChangeValues = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const obtenerDetallesYCentros = async () => {
      try {
        //Obtener datos del participante
        const responseParticipante = await axios.get(
          `${process.env.REACT_APP_API_URL}/participante/${id}`
        );

        const datosParticipante = responseParticipante.data[0];
        //console.log(responseParticipante.data);

        if (datosParticipante.fechanacimiento) {
          const fecha = new Date(datosParticipante.fechanacimiento);
          datosParticipante.fechanacimiento = fecha.toISOString().split("T")[0];
        }
        datosParticipante.cargo = datosParticipante.idcargo;
        setFormData(datosParticipante); // Si aún necesitas formData para otros campos

        //Extraer iddepartamento e idmunicipio y usarlos directamente
        const { iddepartamento, idmunicipio } = datosParticipante;

        if (iddepartamento && idmunicipio) {
          //Obtener centros educativos usando los datos del participante
          const responseCentros = await axios.get(
            `${process.env.REACT_APP_API_URL}/centroeducativoiddepto/${iddepartamento}/${idmunicipio}`
          );

          setCentrosEducativos(responseCentros.data);
          console.log("Centros educativos:", responseCentros.data);

        }
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetallesYCentros();
  }, [id]);

  //Carga de centros educativos cuando el participante cambia de departamento o municipio; o no traer datos del centro educativo
  useEffect(() => {
    const cargarCentrosEducativos = async () => {
      if (formData.iddepartamento && formData.idmunicipio) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/centroeducativoiddepto/${formData.iddepartamento}/${formData.idmunicipio}`
          );
          setCentrosEducativos(response.data);
          console.log("Centros educativos:", response.data);
        } catch (error) {
          console.error("Error al obtener centros educativos", error);
        }
      }
    };

    cargarCentrosEducativos();
  }, [formData.iddepartamento, formData.idmunicipio]);

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
    ];

    // Construir lista de campos requeridos según el tipo
    const requiredFields = [
      ...baseRequiredFields,
      ...(formacioninvest !== "investigacion" && formData.tienecentro
        ? conditionalRequiredFields
        : []),
    ];
    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true; // Marcar campo como vacío
      }
    });

    // Validación especial para idcicloatiende
    // Solo es obligatorio cuando idnivelatiende es igual a 2
    if (
      formacioninvest !== "investigacion" &&
      formData.tienecentro &&
      formData.idnivelatiende === 2 &&
      !formData.idcicloatiende
    ) {
      errors.idcicloatiende = true;
    }
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

    try {

      const dataToSend = {
        ...formData,

        modificadopor: user.id,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/participante/${id}`,

        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "¡Actualización!",
          text: "Los datos han sido actualizados correctamente",
          icon: "success",
          timer: 6000,
          confirmButtonColor: color.primary.azul,
        });

        navigate("/dashboard");
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
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => {
      let updatedData = { ...prevData };
      // Validación para años de servicio (solo números positivos)
      if (name === "añosdeservicio") {
        if (!/^\d*$/.test(value)) {
          return prevData; // Si no es un número positivo, no actualiza el estado
        }
      }

      // Formatear nombre y apellido a Capital Case
      if (name === "nombre" || name === "apellido") {
        updatedData[name] = value
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return updatedData;
      }

      //  Validar y formatear teléfono (formato 0000-0000)
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

        updatedData.telefono = telefonoFormateado;
        return updatedData;
      }


      // Si es el campo de fecha, validamos el formato
      if (name === "fechanacimiento") {
        // Si el usuario borra el campo, lo limpiamos
        if (!value) {
          updatedData.fechanacimiento = "";
          updatedData.edad = "";
          return updatedData;
        }

        // Convertimos a Date para validar
        const dateObj = new Date(value);

        // Si la fecha es inválida, no actualizamos
        if (isNaN(dateObj.getTime())) {
          return prevData;
        }

        // Formateamos a YYYY-MM-DD (formato que acepta el input date)
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        updatedData.fechanacimiento = formattedDate;

        // Calculamos la edad
        const today = new Date();
        let age = today.getFullYear() - year;
        const monthDiff = today.getMonth() - dateObj.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dateObj.getDate())
        ) {
          age--;
        }

        updatedData.edad = age.toString();
      } else {
        updatedData[name] = newValue;
      }

      return updatedData;
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

  return (
    <>
      <Dashboard>
        <Paper
          maxWidth="lg"
          sx={{ mt: 4, mb: 4, p: 4, overflowX: "auto" }}
          elevation={3}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: color.primary.azul }}
              >
                {formacioninvest === "investigacion"
                  ? "Actualizar de Investigadores"
                  : "Actualizar de Participantes"}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
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
                  {formData.tienecentro && (
                    <Tab label="Datos del Centro Educativo" value="2" />
                  )}
                </Tabs>
              </>
            )}

            {/* Tab 1: Datos Generales del Participante */}
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Código SACE / Identidad</Typography>
                  <TextField
                    fullWidth
                    name="codigosace"
                    value={formData?.codigosace}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Identidad  <span style={{ color: "red" }}> *</span></Typography>
                  <TextField
                    fullWidth
                    name="identificacion"
                    value={formData?.identificacion}
                    onChange={handleChange}
                    error={fieldErrors.identificacion}
                    helperText={
                      fieldErrors.identificacion
                        ? "Este campo es obligatorio"
                        : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nombre  <span style={{ color: "red" }}> *</span></Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData?.nombre}
                    onChange={handleChange}
                    error={fieldErrors.nombre}
                    helperText={
                      fieldErrors.nombre ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Apellido  <span style={{ color: "red" }}> *</span></Typography>
                  <TextField
                    fullWidth
                    name="apellido"
                    value={formData?.apellido}
                    onChange={handleChange}
                    error={fieldErrors.apellido}
                    helperText={
                      fieldErrors.apellido ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl error={fieldErrors.genero}>
                    <Typography variant="subtitle1" error={fieldErrors.genero}>Género  <span style={{ color: "red" }}> *</span></Typography>
                    <RadioGroup
                      row
                      name="genero"
                      value={formData?.genero}
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
                        Fecha de Nacimiento  <span style={{ color: "red" }}> *</span>
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
                        value={formData?.edad || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Correo Electrónico  <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <TextField
                    fullWidth
                    name="correo"
                    value={formData?.correo}
                    onChange={handleChange}
                    error={fieldErrors.correo}
                    helperText={
                      fieldErrors.correo ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Teléfono  <span style={{ color: "red" }}> *</span></Typography>
                  <TextField
                    fullWidth
                    name="telefono"
                    value={formData?.telefono}
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
                  <Typography variant="subtitle1">Nivel Educativo  <span style={{ color: "red" }}> *</span></Typography>

                  <FormControl fullWidth error={fieldErrors.idnivelacademicos}>
                    <Select
                      name="idnivelacademicos"
                      value={formData?.idnivelacademicos || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="3">Media</MenuItem>
                      <MenuItem value="9">Superior</MenuItem>
                    </Select>
                    {fieldErrors.idnivelacademicos && (
                      <FormHelperText>Este campo es obligatorio</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Grado Académico</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="idgradoacademicos"
                      value={formData?.idgradoacademicos || ""}
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
                    value={formData?.añosdeservicio || ""}
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
                    value={formData?.codigodered || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Cargo que Desempeña  <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.idfuncion}>
                    <Select
                      name="idfuncion"
                      value={formData?.idfuncion}
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
                    Departamento de Residencia  <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.deptoresidencia}>
                    <Select
                      name="deptoresidencia"
                      value={formData?.deptoresidencia}
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
                    Municipio de Residencia  <span style={{ color: "red" }}> *</span>
                  </Typography>
                  <FormControl fullWidth error={fieldErrors.municipioresidencia}>
                    <Select
                      id="municipioresidencia"
                      name="municipioresidencia"
                      value={formData?.municipioresidencia || ""}
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
                      value={formData?.aldearesidencia || ""}
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
                    value={formData?.caserio}
                    onChange={handleChange}
                  />
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
                <Grid size={{ xs: 12, md: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.tienecentro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tienecentro: e.target.checked,
                          })
                        }
                      />
                    }
                    label="¿Representa a un Centro Educativo?"
                  />
                </Grid>
              </Grid>
              {(formacioninvest === "investigacion" || !formData.tienecentro) && (
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
                      Departamento del Centro Educativo  <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.iddepartamento}>
                      <Select
                        name="iddepartamento"
                        value={formData?.iddepartamento || ""}
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
                        <FormHelperText>Este campo es obligatorio</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Municipio del Centro Educativo  <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.idmunicipio}>
                      <Select
                        id="idmunicipio"
                        name="idmunicipio"
                        value={formData?.idmunicipio || ""}
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
                        <FormHelperText>Este campo es obligatorio</FormHelperText>
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
                        value={formData?.idaldea || ""}
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
                      Centro Educativo  <span style={{ color: "red" }}> *</span>
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Código SACE del Centro Educativo  <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="codigosaceced"
                      value={formData?.codigosaceced}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.tipoadministracion}>
                      <Typography variant="subtitle1">
                        Tipo de Administración  <span style={{ color: "red" }}> *</span>
                      </Typography>
                      <RadioGroup
                        row
                        name="tipoadministracion"
                        value={formData?.tipoadministracion}
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
                        <FormHelperText error>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.tipocentro}>
                      <Typography variant="subtitle1">
                        Tipo de Centro Educativo  <span style={{ color: "red" }}> *</span>
                      </Typography>
                      <Select
                        fullWidth
                        name="tipocentro"
                        value={formData?.tipocentro || ""}
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
                        <FormHelperText>Este campo es obligatorio</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.jornada}>
                      <Typography variant="subtitle1">
                        Jornada que Atiende  <span style={{ color: "red" }}> *</span>
                      </Typography>
                      <Select
                        fullWidth
                        name="jornada"
                        value={formData?.jornada || ""}
                        onChange={handleChange}
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={fieldErrors.modalidad}>
                      <Typography variant="subtitle1">
                        Modalidad que Atiende  <span style={{ color: "red" }}> *</span>
                      </Typography>
                      <Select
                        fullWidth
                        name="modalidad"
                        value={formData?.modalidad || ""}
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Zona Centro Educativo  <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.zona}>
                      <Select
                        name="zona"
                        value={formData?.zona}
                        onChange={handleChange}
                      >
                        <MenuItem value="Rural">Rural</MenuItem>
                        <MenuItem value="Urbana">Urbana</MenuItem>
                      </Select>
                      {fieldErrors.zona && (
                        <FormHelperText>Este campo es obligatorio</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">Nivel Educativo  <span style={{ color: "red" }}> *</span></Typography>
                    <FormControl fullWidth error={fieldErrors.idnivelatiende}>
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
                      {fieldErrors.idnivelatiende && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {formData.idnivelatiende === 2 && (
                    <Grid size={{ xs: 12, md: 6 }}>

                      <Typography variant="subtitle1">Ciclo Académico  <span style={{ color: "red" }}> *</span></Typography>
                      <FormControl fullWidth error={fieldErrors.idcicloatiende}>
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
                        {fieldErrors.idcicloatiende && (
                          <FormHelperText>
                            Este campo es obligatorio
                          </FormHelperText>
                        )}
                      </FormControl>

                    </Grid>
                  )}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Cargo que Desempeña en el Centro Educativo  <span style={{ color: "red" }}> *</span>
                    </Typography>
                    <FormControl fullWidth error={fieldErrors.cargo}>
                      <Select
                        name="cargo"
                        value={formData?.cargo}
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
                        <FormHelperText>Este campo es obligatorio</FormHelperText>
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
        </Paper>
      </Dashboard>
    </>
  );
};

export default ModificarParticipante;
