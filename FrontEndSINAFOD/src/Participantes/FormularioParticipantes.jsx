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
  FormHelperText
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import TablaPacticantes from "./TablaParticipantes";
import Swal from 'sweetalert2';



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
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [gardo, setGrado] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [value, setValue] = React.useState("1");
  const [aldeasP, setAldeaP] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [formData, setFormData] = useState({
    idinvestigacioncap: investCap,
    correo: "",
    identificacion: "",
    codigosace: "",
    nombre: "",
    funcion: "",
    sexo: "",
    añosdeservicio: 0,
    codigodered: "",
    deptoresidencia: "",
    municipioresidencia: "",
    aldearesidencia: null,
    nivelacademicodocente: "",
    gradoacademicodocente: null,

    aldeaced: null,
    centroeducativo: "",
    idnivelesacademicos: "",
    idgradosacademicos: null,
    zona: "",
    municipioced: "",
    departamentoced: "",
    tipoadministracion: "Gubernamental",
    creadopor: user,
  });

  const limpiarCampos = () => {
    setFormData((prevState) => ({
      ...prevState,
      identificacion: "",
      codigosace: "",
      nombre: "",
      funcion: "",
      sexo: "",
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


  const handleChangeValues = (event, newValue) => {
    setValue(newValue);
  };


  const handleSave = async () => {
    const requiredFields = [
      "identificacion",
      "codigosace",
      "nombre",
      "funcion",
      "sexo",
      "añosdeservicio",
      "deptoresidencia",
      "municipioresidencia",
      "nivelacademicodocente",
      /*   "gradoacademicodocente" , */

      "centroeducativo",
      "idnivelesacademicos",
      /*   "idgradosacademicos" , */
      "zona",
      "municipioced",
      "departamentoced",
      "tipoadministracion",
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
      //console.log("formData", formData);   
      const transformedFormData = transformFormData(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/CapacitacionP/${investCap}`,
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
          title: 'Guardado',
          text: 'Datos guardados correctamente',
          icon: 'success',
          timer: 6000,
        });
        setIsSaved(true);

      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al guardar datos',
        icon: 'error',
        timer: 6000,
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamentos`);
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`);
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
  const handleRedirect = () => {
    navigate("/dashboard");
  };


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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamentos`);
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





  {/* Datos académicos  del participante */ }



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



  const obtenerDNI = async (campo) => {
    // Verifica cuál de los campos tiene datos según el parámetro 'campo'
    const filtro = formData[campo] && formData[campo].trim() !== "" ? formData[campo] : null;

    if (!filtro) {
      alert("Por favor, ingrese un valor en el campo seleccionado.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/filtroDocentes/${filtro}`
      );

      if (response.data && response.data.length > 0) {
        const docente = response.data[0];
        setFormData((prev) => ({
          ...prev,
          codigosace: docente.codigosace || "",
          identificacion: docente.identificacion || "",
          codigosace: docente.codigosace || "",
          nombre: docente.nombre || "",
          funcion: docente.funcion || "",
          sexo: docente.sexo || "",
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

        Swal.fire({
          title: 'Participante encontrado',
          text: 'Se encontraron datos del participante',
          icon: 'success',
          timer: 6000,
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      alert("No se encontró ningún registro.");
    }
  };

  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} size={8}>
              <Typography variant="h3" sx={{ color: color.primary.azul }}>
                {formacioninvest === "Investigación"
                  ? "Registro de Investigadores"
                  : "Registro de Participantes"}
              </Typography>
            </Grid>
            <Grid item xs={12} size={4} sx={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}>
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
          <TabContext value={value}>
            <Tabs value={value} onChange={handleChangeValues} variant="scrollable" scrollButtons="auto">
              <Tab label="Datos Generales del Participante" value="1" />
              <Tab label="Datos del Centro Educativo" value="2" />
            </Tabs>

            {/* Tab 1: Datos Generales del Participante */}
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Código SACE</Typography>
                  <Grid spacing={2} container>
                    <Grid item xs={12} size={9}>
                      <TextField
                        fullWidth
                        name="codigosace"
                        value={formData.codigosace}
                        onChange={handleChange}
                        error={fieldErrors.codigosace}
                        helperText={fieldErrors.codigosace ? "Este campo es obligatorio" : ""}
                      />
                    </Grid>
                    <Grid item xs={12} size={3}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul }}
                        onClick={() => obtenerDNI('codigosace')}
                      >
                        Buscar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Identidad</Typography>
                  <Grid spacing={2} container>
                    <Grid item xs={12} size={9}>
                      <TextField
                        fullWidth
                        name="identificacion"
                        value={formData.identificacion}
                        onChange={handleChange}
                        error={fieldErrors.identificacion}
                        helperText={fieldErrors.identificacion ? "Este campo es obligatorio" : ""}
                      />
                    </Grid>
                    <Grid item xs={12} size={3}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul }}
                        onClick={() => obtenerDNI('identificacion')}
                      >
                        Buscar
                      </Button>

                    </Grid>


                  </Grid>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Nombre</Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={fieldErrors.nombre}
                    helperText={fieldErrors.nombre ? "Este campo es obligatorio" : ""}
                  />
                </Grid>
                <Grid item xs={12} size={6}>
                  <FormControl error={fieldErrors.sexo}>
                    <Typography variant="subtitle1">Sexo</Typography>
                    <RadioGroup
                      row
                      name="sexo"
                      value={formData.sexo}
                      onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    >
                      <FormControlLabel value="Mujer" control={<Radio />} label="Mujer" />
                      <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" />
                    </RadioGroup>
                    {fieldErrors.sexo && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Nivel Educativo</Typography>
                  {/* <FormControl fullWidth error={fieldErrors.nivelacademicodocente}>
                    <Select
                      name="nivelacademicodocente"
                      value={formData.nivelacademicodocente || ""}
                      onChange={handleChange}>
                      {NivelEducativoP.length > 0 ? (
                        NivelEducativoP.map((dep) =>
                          <MenuItem key={dep.id} value={dep.id}>
                            {dep.nombre}
                          </MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.nivelacademicodocente && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>*/}
                  <FormControl fullWidth error={fieldErrors.nivelacademicodocente}>
                    <Select
                      name="nivelacademicodocente"
                      value={formData.nivelacademicodocente || ""}
                      onChange={handleChange}>
                      <MenuItem value="3">Media</MenuItem>
                      <MenuItem value="4">Superior</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Grado Académico</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="gradoacademicodocente"
                      value={formData.gradoacademicodocente || ""}
                      onChange={handleChange}
                      disabled={!gardoP.length}
                    >
                      <MenuItem value="" disabled>Seleccione un grado académico</MenuItem>
                      {gardoP.map((mun) => (
                        <MenuItem key={mun.id} value={mun.id}>{mun.grado}</MenuItem>
                      ))}
                    </Select>

                  </FormControl>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Años de Servicio</Typography>
                  <TextField
                    fullWidth
                    name="añosdeservicio"
                    value={formData.añosdeservicio || ""}
                    onChange={handleChange}
                    error={fieldErrors.añosdeservicio}
                    helperText={fieldErrors.añosdeservicio ? "Este campo es obligatorio" : ""}
                  />
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Código de Red al que Pertenece</Typography>
                  <TextField fullWidth name="codigodered" value={formData.codigodered || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Cargo que Desempeña</Typography>
                  <TextField
                    fullWidth
                    name="funcion"
                    value={formData.funcion}
                    onChange={handleChange}
                    error={fieldErrors.funcion}
                    helperText={fieldErrors.funcion ? "Este campo es obligatorio" : ""}
                  />
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Departamento de Residencia</Typography>
                  <FormControl fullWidth error={fieldErrors.deptoresidencia}>
                    <Select
                      name="deptoresidencia"
                      value={formData.deptoresidencia}
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>Seleccione un departamento</MenuItem>
                      {departamentosRE.length > 0 ? (
                        departamentosRE.map((dep) =>
                          <MenuItem key={dep.id} value={dep.id}>
                            {dep.nombre}
                          </MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.deptoresidencia && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Municipio de Residencia</Typography>
                  <FormControl fullWidth error={fieldErrors.municipioresidencia}>
                    <Select
                      id="municipioresidencia"
                      name="municipioresidencia"
                      value={formData.municipioresidencia || ""}
                      onChange={handleChange}
                      disabled={!municipiosRE.length}
                    >
                      <MenuItem value="" disabled>Seleccione un municipio</MenuItem>
                      {municipiosRE.map((municipio) => (
                        <MenuItem key={municipio.id} value={municipio.id}>
                          {municipio.municipio}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.municipioresidencia && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Aldea de Residencia</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldearesidencia"
                      value={formData.aldearesidencia || ""}
                      onChange={handleChange}
                      disabled={!aldeasP.length}
                    >
                      <MenuItem value="" disabled>Seleccione una aldea</MenuItem>
                      {aldeasP.length > 0 ? (
                        aldeasP.map((ald) =>
                          <MenuItem key={ald.id} value={ald.id}>
                            {ald.aldea}
                          </MenuItem>)
                      ) : (
                        <MenuItem disabled>Seleccione una aldea</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Datos del Centro Educativo */}
            <TabPanel value="2">
              <Grid container spacing={2}>


                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Nivel Educativo que Atiende</Typography>
                  <FormControl fullWidth error={fieldErrors.idnivelesacademicos}>
                    <Select
                      name="idnivelesacademicos"
                      value={formData.idnivelesacademicos || ""}
                      onChange={handleChange}>
                      <MenuItem value="" disabled>Seleccione un nivel educativo</MenuItem>
                      {NivelEducativo.length > 0 ? (
                        NivelEducativo.map((dep) => <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.idnivelesacademicos && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Grado Académico que Atiende</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="idgradosacademicos"
                      value={formData.idgradosacademicos || ""}
                      onChange={handleChange}
                      disabled={!gardo.length}
                    >
                      <MenuItem value="" disabled>Seleccione un grado académico</MenuItem>
                      {gardo.map((mun) => (
                        <MenuItem key={mun.id} value={mun.id}>{mun.grado}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Centro Educativo</Typography>
                  <TextField
                    fullWidth
                    name="centroeducativo"
                    value={formData.centroeducativo}
                    onChange={handleChange}
                    error={fieldErrors.centroeducativo}
                    helperText={fieldErrors.centroeducativo ? "Este campo es obligatorio" : ""}
                  />
                </Grid>

                <Grid item xs={12} size={6}>
                  <FormControl fullWidth >
                    <Typography variant="subtitle1">Tipo de Administración</Typography>
                    <RadioGroup
                      row
                      name="tipoadministracion"
                      value={formData.tipoadministracion}
                      onChange={(e) => setFormData({ ...formData, tipoadministracion: e.target.value })}
                    >
                      <FormControlLabel value="Gubernamental" control={<Radio />} label="Gubernamental" />
                      <FormControlLabel value="No Gubernamental" control={<Radio />} label="No Gubernamental" />
                    </RadioGroup>
                    {fieldErrors.tipoadministracion && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Zona Centro Educativo</Typography>
                  <FormControl fullWidth error={fieldErrors.zona}>
                    <Select name="zona" value={formData.zona} onChange={handleChange}>
                      <MenuItem value="Rural">Rural</MenuItem>
                      <MenuItem value="Urbana">Urbana</MenuItem>
                    </Select>
                    {fieldErrors.zona && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Departamento Centro Educativo</Typography>
                  <FormControl fullWidth error={fieldErrors.departamentoced}>
                    <Select
                      name="departamentoced"
                      value={formData.departamentoced || ""}
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>Seleccione un departamento</MenuItem>
                      {departamentos.length > 0 ? (
                        departamentos.map((dep) => <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                    {fieldErrors.departamentoced && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Municipio Centro Educativo</Typography>
                  <FormControl fullWidth error={fieldErrors.municipioced}>
                    <Select
                      id="municipioced"
                      name="municipioced"
                      value={formData.municipioced || ""}
                      onChange={handleChange}
                      disabled={!municipios.length}
                    >
                      <MenuItem value="" disabled>Seleccione un municipio</MenuItem>
                      {municipios.map((municipio) => (
                        <MenuItem key={municipio.id} value={municipio.id}>
                          {municipio.municipio}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.municipioced && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} size={6}>
                  <Typography variant="subtitle1">Aldea Centro Educativo</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldeaced"
                      value={formData.aldeaced || ""}
                      onChange={handleChange}
                      disabled={!aldeas.length}
                    >
                      <MenuItem value="" disabled>Seleccione una aldea</MenuItem>
                      {aldeas.length > 0 ? (
                        aldeas.map((ald) =>
                          <MenuItem key={ald.id} value={ald.id}>
                            {ald.aldea}
                          </MenuItem>)
                      ) : (
                        <MenuItem disabled>Seleccione una aldea</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
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
          </TabContext>


        </Paper>
        <TablaPacticantes investCap={investCap} isSaved={isSaved} setIsSaved={setIsSaved} />
      </Dashboard>
    </>
  );
};

export default FormularParticipantes;
