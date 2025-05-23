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

  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentosRE, setDepartamentosRE] = useState([]);
  const [municipiosRE, setMunicipiosRE] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [value, setValue] = React.useState("1");
  const [cargos, setCargos] = useState([]);
  const [aldeasP, setAldeaP] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [formData, setFormData] = useState({
    idinvestigacioncap: "",
    fechanacimiento: "",
    correo: "",
    telefono: "",
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
    modificadopor: user.id,
  });

  const handleChangeValues = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/participante/${id}`
        );

        setFormData(response.data[0]);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetalles();
  }, [id]);

  const handleSave = async () => {
    try {
      console.log("Datos que envio parti", formData);

      const dataToSend = {
        ...formData,

        modificadopor: user.id,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/CapacitacionP/${id}`,

        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Guardado",
          text: "Datos guardados correctamente",
          icon: "success",
          timer: 6000,
        });
        setIsSaved(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire({
        title: "Error!",
        text: "Error al guardar datos",
        icon: "error",
        timer: 6000,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => {
      // Para checkboxes usamos 'checked', para otros campos usamos 'value'
      const newValue = type === "checkbox" ? checked : value;
      let newData = { ...prevData, [name]: newValue };

      // Si el campo cambiado es la fecha de nacimiento, calcular la edad
      if (name === "fechanacimiento" && value) {
        const birthDate = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Ajustar la edad si aún no ha pasado el mes de cumpleaños
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        newData.edad = age.toString();
      }

      // Convertimos el valor a string para evitar errores con `.trim()`
      const valueStr = String(type === "checkbox" ? checked : value || "");

      // Quitar error si el usuario llena un campo vacío (solo para no-checkboxes)
      if (type !== "checkbox") {
        setFormData((prevErrors) => ({
          ...prevErrors,
          [name]: valueStr.trim() === "" ? true : false,
        }));
      }

      // Validación para años de servicio (solo números positivos)
      if (name === "añosdeservicio" && type !== "checkbox") {
        if (!/^\d*$/.test(value)) {
          return prevData; // Si no es un número positivo, no actualiza el estado
        }
      }

      return newData;
    });
  };

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

  // Obtener departamentos al montar el componente
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
        console.log("muni", response.data);
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
        console.log("gardo", response.data);

        setGradoP(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenergardo();
  }, [formData.nivelacademicodocente]);

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
              <Typography variant="h4" sx={{ color: color.primary.azul }}>
                Actualización de Participantes
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
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              value={value}
              onChange={handleChangeValues}
            >
              <Tab label="Datos Generales del Participante" value="1" />
              <Tab label="Datos del Centro Educativo" value="2" />
            </Tabs>

            {/* Tab 1: Datos Generales del Participante */}
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Código SACE</Typography>
                  <TextField
                    fullWidth
                    name="codigosace"
                    value={formData.codigosace}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nombre</Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Identidad</Typography>
                  <TextField
                    fullWidth
                    name="identificacion"
                    value={formData.identificacion}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl>
                    <Typography variant="subtitle1">Genero</Typography>
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
                        label="Mujer"
                      />
                      <FormControlLabel
                        value="Hombre"
                        control={<Radio />}
                        label="Hombre"
                      />
                    </RadioGroup>
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
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nivel Académico</Typography>
                  <FormControl fullWidth>
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
                      name="gradoacademicodocente"
                      value={formData.gradoacademicodocente || ""}
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
                  <FormControl fullWidth>
                    <Select
                      name="idfuncion"
                      value={formData.idfuncion}
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
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Departamento de Residencia
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="deptoresidencia"
                      value={formData.deptoresidencia}
                      onChange={handleChange}
                    >
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
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Municipio de Residencia
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      id="municipioresidencia"
                      name="municipioresidencia"
                      value={formData.municipioresidencia || ""}
                      onChange={handleChange}
                      disabled={!municipiosRE.length}
                    >
                      <MenuItem value="">Seleccione un municipio</MenuItem>
                      {municipiosRE.map((municipio) => (
                        <MenuItem key={municipio.id} value={municipio.id}>
                          {municipio.municipio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Aldea de Residencia
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldearesidencia"
                      value={formData.aldearesidencia}
                      onChange={handleChange}
                      disabled={!aldeasP.length}
                    >
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
            </TabPanel>

            {/* Tab 2: Datos del Centro Educativo */}
            <TabPanel value="2">
              <Grid container spacing={2}>
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
                    <Typography variant="subtitle1">
                      Grados Académicos (Básica)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.primero}
                              onChange={handleChange}
                              name="primero"
                            />
                          }
                          label="Primer"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.segundo}
                              onChange={handleChange}
                              name="segundo"
                            />
                          }
                          label="Segundo"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.tercero}
                              onChange={handleChange}
                              name="tercero"
                            />
                          }
                          label="Tercer"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.cuarto}
                              onChange={handleChange}
                              name="cuarto"
                            />
                          }
                          label="Cuarto"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.quinto}
                              onChange={handleChange}
                              name="quinto"
                            />
                          }
                          label="Quinto"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.sexto}
                              onChange={handleChange}
                              name="sexto"
                            />
                          }
                          label="Sexto"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.séptimo}
                              onChange={handleChange}
                              name="séptimo"
                            />
                          }
                          label="Séptimo"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.octavo}
                              onChange={handleChange}
                              name="octavo"
                            />
                          }
                          label="Octavo"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.noveno}
                              onChange={handleChange}
                              name="noveno"
                            />
                          }
                          label="Noveno"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {formData.media === true && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Grados Académicos ()
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
                          label="Décimo"
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
                          label="Undécimo"
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
                          label="Duodécimo"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Centro Educativo</Typography>
                  <TextField
                    fullWidth
                    name="centroeducativo"
                    value={formData.centroeducativo}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl>
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
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Zona Centro Educativo
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="zona"
                      value={formData.zona}
                      onChange={handleChange}
                    >
                      <MenuItem value="Rural">Rural</MenuItem>
                      <MenuItem value="Urbana">Urbana</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Departamento Centro Educativo
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="iddepartamento"
                      value={formData.iddepartamento || ""}
                      onChange={handleChange}
                    >
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
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Municipio Centro Educativo
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      id="idmunicipio"
                      name="idmunicipio"
                      value={formData.idmunicipio || ""}
                      onChange={handleChange}
                      disabled={!municipios.length}
                    >
                      <MenuItem value="">Seleccione un municipio</MenuItem>
                      {municipios.map((municipio) => (
                        <MenuItem key={municipio.id} value={municipio.id}>
                          {municipio.municipio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Aldea Centro Educativo
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldeaced"
                      value={formData.aldeaced}
                      onChange={handleChange}
                      disabled={!aldeas.length}
                    >
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
          </TabContext>
        </Paper>
      </Dashboard>
    </>
  );
};

export default ModificarParticipante;
