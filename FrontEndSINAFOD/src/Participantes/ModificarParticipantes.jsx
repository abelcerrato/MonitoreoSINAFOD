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
  const [formData, setFormData] = useState({
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

    idcentroeducativo: "",
    idcentropart: "",

    nombreced: "",
    codigosaceced: "",
    prebasica: false,
    basica: false,
    media: false,
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
    try {
      console.log("Datos que envio parti", formData);

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
          title: "¡Actualización Exitosa!",
          text: "Datos actualizados correctamente",
          icon: "success",
          timer: 6000,
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
                  <Tab label="Datos del Centro Educativo" value="2" />
                </Tabs>
              </>
            )}

            {/* Tab 1: Datos Generales del Participante */}
            <TabPanel value="1">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Código SACE</Typography>
                  <TextField
                    fullWidth
                    name="codigosace"
                    value={formData?.codigosace}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Identidad</Typography>
                  <TextField
                    fullWidth
                    name="identificacion"
                    value={formData?.identificacion}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nombre</Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData?.nombre}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl>
                    <Typography variant="subtitle1">Género</Typography>
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
                        label="Mujer"
                      />
                      <FormControlLabel
                        value="Masculino"
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
                    Correo Electrónico
                  </Typography>
                  <TextField
                    fullWidth
                    name="correo"
                    value={formData?.correo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Teléfono</Typography>
                  <TextField
                    fullWidth
                    name="telefono"
                    value={formData?.telefono}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">Nivel Educativo</Typography>

                  <FormControl fullWidth>
                    <Select
                      name="idnivelacademicos"
                      value={formData?.idnivelacademicos || ""}
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
                    Cargo que Desempeña
                  </Typography>
                  <FormControl fullWidth>
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
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Departamento de Residencia
                  </Typography>
                  <FormControl fullWidth>
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
                    <FormControl fullWidth>
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
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Municipio del Centro Educativo
                    </Typography>
                    <FormControl fullWidth>
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
                      value={formData?.codigosaceced}
                      onChange={handleChange}
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
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Tipo de Centro Educativo*
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
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Jornada que Atiende*
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
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Modalidad que Atiende*
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
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Zona Centro Educativo
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="zona"
                        value={formData?.zona}
                        onChange={handleChange}
                      >
                        <MenuItem value="Rural">Rural</MenuItem>
                        <MenuItem value="Urbana">Urbana</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">Nivel Educativo</Typography>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData?.prebasica}
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
                              checked={formData?.basica}
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
                              checked={formData?.media}
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
                                checked={formData?.primero}
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
                                checked={formData?.segundo}
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
                                checked={formData?.tercero}
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
                                checked={formData?.cuarto}
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
                                checked={formData?.quinto}
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
                                checked={formData?.sexto}
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
                                checked={formData?.septimo}
                                onChange={handleChange}
                                name="septimo"
                              />
                            }
                            label="Séptimo"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData?.octavo}
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
                                checked={formData?.noveno}
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
                        Grados Académicos (Media)
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData?.decimo}
                                onChange={handleChange}
                                name="decimo"
                              />
                            }
                            label="Décimo"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData?.onceavo}
                                onChange={handleChange}
                                name="onceavo"
                              />
                            }
                            label="Undécimo"
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData?.doceavo}
                                onChange={handleChange}
                                name="doceavo"
                              />
                            }
                            label="Duodécimo"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1">
                      Cargo que Desempeña en el Centro Educativo*
                    </Typography>
                    <FormControl fullWidth>
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
