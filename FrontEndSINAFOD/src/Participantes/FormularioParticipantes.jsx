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

} from "@mui/material";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import TablaPacticantes from "./TablaParticipantes";




const FormularParticipantes = () => {
  const location = useLocation();
  const { investCap } = location.state || {};
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [gardo, setGrado] = useState([]);
  const [formData, setFormData] = useState({
    idinvestigacioncap: investCap,
    identificacion: "",
    codigosace: "",
    nombre: "",
    funcion: "",
    sexo: "",
    centroeducativo: "",
    idnivelesacademicos: "",
    idgradosacademicos: null,
    zona: "",
    centrobeneficiarios: "",
    municipioced: "",
    departamentoced: "",
    añosdeservicio: 0,
    codigodered: "",
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
      centroeducativo: "",
      idnivelesacademicos: "",
      idgradosacademicos: "",
      zona: "",
      centrobeneficiarios: "",
      municipioced: "",
      departamentoced: "",
      añosdeservicio: "",
      codigodered: "",
      creadopor: prevState.creadopor,
    }));
  };



  const handleSave = async () => {
    try {


      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/CapacitacionP`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );



      if (response.status === 200) {
        limpiarCampos();
        alert("Datos guardados correctamente");
        setIsSaved(true);

      } else {
        alert("Error en la autenticación. Verifique sus credenciales.");
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      alert("Error al guardar los datos");
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

  // Obtener municipios cuando cambia el departamento seleccionado
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

  const handleRedirect = () => {
    navigate("/dashboard");
  };



  // Obtener NivelEducativo al montar el componente
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

  // Obtener gardo cuando cambia el departamento seleccionado
  useEffect(() => {
    console.log("id de nivel", formData.idnivelesacademicos);

    if (!formData.idnivelesacademicos) return;

    const obtenergardo = async () => {
      try {


        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/gradoAcademicoNivel/${formData.idnivelesacademicos}`
        );
        console.log("gardo", response.data);


        setGrado(response.data);
      } catch (error) {
        console.error("Error al obtener los gardo", error);
      }
    };

    obtenergardo();
  }, [formData.idnivelesacademicos]);


  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={4}
          >
            <Typography variant="h5" sx={{ color: color.primary.azul }}>
              Registro de Participantes
            </Typography>
            <Box>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.azul }}
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Guardar
              </Button>
              <Button
                variant="outlined"
                sx={{
                  marginLeft: 2,
                  borderColor: color.primary.rojo,
                  color: color.primary.rojo,
                }}
                onClick={() => handleRedirect()}
              >
                Cerrar
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/*  <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Id de la investigación</Typography>

              <TextField
                value={investCap || ""}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true, // Hace el campo solo lectura
                }}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Código SACE</Typography>
              <TextField
                fullWidth
                name="codigosace"
                value={formData.codigosace}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Nombre</Typography>
              <TextField
                fullWidth
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Identidad</Typography>
              <TextField
                fullWidth
                name="identificacion"
                value={formData.identificacion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <Typography variant="subtitle1">Sexo</Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  value={formData.sexo}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  name="sexo"
                >
                  <FormControlLabel value="Mujer" control={<Radio />} label="Mujer" />
                  <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" />

                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Función</Typography>
              <TextField
                fullWidth
                name="funcion"
                value={formData.funcion}
                onChange={handleChange}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Años de Servicio
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="añosdeservicio"
                value={formData.añosdeservicio || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Nivel Educativo
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="idnivelesacademicos"
                  value={formData.idnivelesacademicos || ""}
                  onChange={handleChange}
                  fullWidth
                >
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Grado
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="idgradosacademicos"
                  value={formData.idgradosacademicos || ""}
                  onChange={handleChange}
                  fullWidth
                  displayEmpty
                  disabled={!gardo.length} // Deshabilitar si no hay grados cargados
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


            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Centro Eduactivo</Typography>
              <TextField
                fullWidth
                name="centroeducativo"
                value={formData.centroeducativo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <Typography variant="subtitle1">Tipo de Administración</Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  value={formData.tipoadministracion}
                  onChange={(e) => setFormData({ ...formData, tipoadministracion: e.target.value })}
                  name="tipoadministracion"
                  defaultValue="Gubernamental"


                >
                  <FormControlLabel value="Gubernamental" control={<Radio />} label="Gubernamental" />
                  <FormControlLabel value="No Gubernamental" control={<Radio />} label="No Gubernamental" />

                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Centro Beneficiarios</Typography>
              <TextField
                fullWidth
                name="centrobeneficiarios"
                value={formData.centrobeneficiarios}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Zona</Typography>
              <FormControl fullWidth>
                <Select
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                >
                  <MenuItem value="Rural">Rural</MenuItem>
                  <MenuItem value="Urbana">Urbano</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Departamento Centro Educativo
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="departamentoced"
                  value={formData.departamentoced || ""}
                  onChange={handleChange}
                  fullWidth
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Municipio Centro Educativo
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="municipioced"
                  value={formData.municipioced || ""}
                  onChange={handleChange}
                  fullWidth
                  disabled={!municipios.length} // Deshabilitar si no hay municipios cargados
                >
                  {municipios.length > 0 ? (
                    municipios.map((mun) => (
                      <MenuItem key={mun.id} value={mun.municipio}>
                        {mun.municipio}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Seleccione un departamento</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <TablaPacticantes investCap={investCap} isSaved={isSaved} setIsSaved={setIsSaved} />
      </Dashboard>
    </>
  );
};

export default FormularParticipantes;