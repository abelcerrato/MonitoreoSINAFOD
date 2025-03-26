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
  Tabs
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import Swal from 'sweetalert2';




const ModificarParticipante = () => {
  const { user } = useUser();

  const { id } = useParams();
  console.log("id", user);

  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentosRE, setDepartamentosRE] = useState([]);
  const [municipiosRE, setMunicipiosRE] = useState([]);
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [gardo, setGrado] = useState([]);
  const [aldeas, setAldea] = useState([]);
  const [value, setValue] = React.useState("1");
  const [NivelEducativoP, setNivelEducativoP] = useState([]);
  const [aldeasP, setAldeaP] = useState([]);
  const [gardoP, setGradoP] = useState([]);
  const [formData, setFormData] = useState({
    idinvestigacioncap: "",

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
    tipoadministracion: "Gubernamental",
    creadopor: user,
  });


  const handleChangeValues = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    const obtenerDetalles = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/CapacitacionP/${id}`);

        setFormData(response.data[0]);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetalles();
  }, [id]);


  const handleSave = async () => {
    try {
      console.log("Datos que envio", formData);

      const dataToSend = {
        ...formData,

        modificadopor: user,
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
          title: 'Guardado',
          text: 'Datos guardados correctamente',
          icon: 'success',
          timer: 6000,
        });
        setIsSaved(true);
        handleRedirect();

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "añosdeservicio") {
      // Solo permite números positivos en añosdeservicio
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Para otros campos, no aplicamos la restricción
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Obtener departamentos al montar el componente
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



  const handleRedirect = () => {
    navigate(`/Modificar_Actividad/${formData.idinvestigacioncap}`);
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
        console.log("muni", response.data);

      } catch (error) {
        console.error("Error al obtener los municipios", error);
      }
    };

    obtenerMunicipios();
  }, [formData.deptoresidencia]);





  {/* Nivel academico del participante */ }
  // Obtener NivelEducativo al montar el componente
  useEffect(() => {
    const obtenerNivelEducativo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`);
        setNivelEducativoP(response.data);
      } catch (error) {
        console.error("Error al obtener los NivelEducativo", error);
      }
    };

    obtenerNivelEducativo();
  }, []);


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
        <Paper sx={{ padding: 3, marginBottom: 3 }}>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h2" sx={{ color: color.primary.azul }}>
                Actualización de Participantes
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}>
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Código SACE</Typography>
                  <TextField fullWidth name="codigosace" value={formData.codigosace} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Nombre</Typography>
                  <TextField fullWidth name="nombre" value={formData.nombre} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Identidad</Typography>
                  <TextField fullWidth name="identificacion" value={formData.identificacion} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Nivel Académico</Typography>
                  <FormControl fullWidth>
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
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Años de Servicio</Typography>
                  <TextField fullWidth name="añosdeservicio" value={formData.añosdeservicio || ""} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Código de Red al que Pertenece</Typography>
                  <TextField fullWidth name="codigodered" value={formData.codigodered || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Función</Typography>
                  <TextField fullWidth name="funcion" value={formData.funcion} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Departamento de Residencia</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="deptoresidencia"
                      value={formData.deptoresidencia}
                      onChange={handleChange}
                    >
                      {departamentosRE.length > 0 ? (
                        departamentosRE.map((dep) =>
                          <MenuItem key={dep.id} value={dep.id}>
                            {dep.nombre}
                          </MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Municipio de Residencia</Typography>
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Aldea de Residencia</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldearesidencia"
                      value={formData.aldearesidencia}
                      onChange={handleChange}
                      disabled={!aldeasP.length}>
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


                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Nivel Académico que Atiende</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="idnivelesacademicos"
                      value={formData.idnivelesacademicos || ""}
                      onChange={handleChange}>
                      <MenuItem value="" disabled>Seleccione un nivel académico</MenuItem>
                      {NivelEducativo.length > 0 ? (
                        NivelEducativo.map((dep) => <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Grado Educativo que Atiende</Typography>
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

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Centro Educativo</Typography>
                  <TextField fullWidth name="centroeducativo" value={formData.centroeducativo} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
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
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Zona Centro Educativo</Typography>
                  <FormControl fullWidth>
                    <Select name="zona" value={formData.zona} onChange={handleChange}>
                      <MenuItem value="Rural">Rural</MenuItem>
                      <MenuItem value="Urbana">Urbana</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Departamento Centro Educativo</Typography>
                  <FormControl fullWidth>
                    <Select name="departamentoced" value={formData.departamentoced || ""} onChange={handleChange}>
                      {departamentos.length > 0 ? (
                        departamentos.map((dep) => <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>)
                      ) : (
                        <MenuItem disabled>Cargando...</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Municipio Centro Educativo</Typography>
                  <FormControl fullWidth>
                    <Select
                      id="municipioced"
                      name="municipioced"
                      value={formData.municipioced || ""}
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Aldea Centro Educativo</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="aldeaced"
                      value={formData.aldeaced}
                      onChange={handleChange}
                      disabled={!aldeas.length}>
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

      </Dashboard>
    </>
  );
};

export default ModificarParticipante;
