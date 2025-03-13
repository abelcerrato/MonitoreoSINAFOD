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
  InputLabel,
  Box,
} from "@mui/material";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";

import TablaParticipantes from "../Participantes/TablaParticipantes";

const FormulariActividad = () => {
  const { id } = useParams();


  const navigate = useNavigate();
  const { user } = useUser();
  const [error, setError] = useState("");
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [formData, setFormData] = useState({
    accionformacion: "",
    formacioninvest: "",
    institucionresponsable: "",
    responsablefirmas: "",
    ambitoformacion: "",
    tipoformacion: "",
    modalidad: "",
    duracion: "",
    espaciofisico: "",


    idnivelesacademicos: "",
    cicloacademico: null,
    funciondirigido: "",
    estado: "",
    fechainicio: "",
    fechafinal: "",
    participantesprog: 0,
    participantesrecib: 0,
    direccion: "",
    zona: "",
    observacion: "",
  });


  const [fieldErrors, setFieldErrors] = useState({
    fechainicio: false,
    fechafinal: false,
  });

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/investC/${id}`);
        const data = response.data[0];
        const horas = data.duracion?.hours || 0;
        const minutos = data.duracion?.minutes || 0;

        setFormData({
          ...data,
          horas: data.duracion?.hours || 0,
          minutos: data.duracion?.minutes || 0,
          duracion: `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`,
          fechainicio: data.fechainicio ? data.fechainicio.split("T")[0] : "",
          fechafinal: data.fechafinal ? data.fechafinal.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetalles();
  }, [id]);




  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(`Campo cambiado: ${name}, Valor recibido: ${value}`);

    setFormData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Validación de fechas
      if (name === "fechainicio" || name === "fechafinal") {
        const formattedDate = new Date(value).toISOString().split("T")[0];

        newData[name] = formattedDate;
        if (newData.fechainicio && newData.fechafinal) {
          if (new Date(newData.fechainicio) > new Date(newData.fechafinal)) {
            setError("La fecha de inicio no puede ser posterior a la fecha de finalización.");
            setFieldErrors({
              fechainicio: true,
              fechafinal: true,
            });
          } else {
            setError("");
            setFieldErrors({
              fechainicio: false,
              fechafinal: false,
            });
          }
        }
      }

      // Validación para añosdeservicio y participantesprog (solo números positivos)
      else if (name === "participantesprog") {
        if (value === "" || /^\d+$/.test(value)) {
          // Permite borrar (valor vacío) o solo números positivos
          newData[name] = value;
        } else {
          return prevData; // No actualiza el estado si el valor no es válido
        }
      }


      // Validación de horas y minutos para la duración
      else if (name === "horas" || name === "minutos") {
        const horas = newData.horas || "00";
        const minutos = newData.minutos || "00";
        newData.duracion = `${String(horas).padStart(2, "0")}:${String(
          minutos
        ).padStart(2, "0")}`;
      }
      return newData;
    });
  };





  const handleSave = async () => {

    // Verificación de la fecha antes de guardar los datos
    if (formData.fechainicio && formData.fechafinal) {
      if (new Date(formData.fechainicio) > new Date(formData.fechafinal)) {
        alert(
          "La fecha de inicio no puede ser posterior a la fecha de finalización."
        );
        return; // No proceder con la solicitud si la validación falla
      }
    }
    try {
      // Creamos un nuevo objeto excluyendo "horas" y "minutos"
      const { horas, minutos, ...rest } = formData;

      // Construimos el string "HH:MM" para duracion
      const dataToSend = {
        ...rest,
        duracion: `${String(horas || "00").padStart(2, "0")}:${String(minutos || "00").padStart(2, "0")}`,
        modificadopor: user,
      };


      const response = await axios.put(

        `${process.env.REACT_APP_API_URL}/investC/${id}`,
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );


      if (response.status === 200) {
        alert("Datos guardados correctamente");
        /*  navigate("/Participantes", { state: { investCap: id } });
  */
      } else {
        alert("Error al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos", error);
      alert("Error al guardar los datos");
    }
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

  // Obtener ciclos cuando cambia el departamento seleccionado
  useEffect(() => {
    if (!formData.idnivelesacademicos) return; // Si no hay departamento seleccionado, no hacer la petición

    const obtenerciclos = async () => {
      try {


        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cicloAcademicoNivel/${formData.idnivelesacademicos}`
        );


        setCiclos(response.data);
      } catch (error) {
        console.error("Error al obtener los ciclos", error);
      }
    };

    obtenerciclos();
  }, [formData.idnivelesacademicos]);


  const handleRedirect = () => {
    navigate("/dashboard");
  };

  const handleRedirectP = () => {
    navigate("/Participantes", { state: { investCap: id } });
  };


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
              Actualización de Actividad - Formativa o de Investigación
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
                variant="contained"
                sx={{ backgroundColor: color.primary.gris, marginLeft: 2 }}
                startIcon={<AddIcon />}
                onClick={handleRedirectP}
              >
                Participante
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Nombre de la Acción o Formación
              </Typography>
              <TextField
                fullWidth
                name="accionformacion"
                value={formData.accionformacion}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Formación o Investigación
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="formacioninvest"
                  value={formData.formacioninvest}
                  onChange={handleChange}
                >
                  <MenuItem value="Formacion">Formación</MenuItem>
                  <MenuItem value="Investigacion">Investigación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Institución Responsable
              </Typography>
              <TextField
                fullWidth
                name="institucionresponsable"
                value={formData.institucionresponsable}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Responsable de Firmas</Typography>
              <TextField
                fullWidth
                name="responsablefirmas"
                value={formData.responsablefirmas}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Ambito de Formación</Typography>
              <TextField
                fullWidth
                name="ambitoformacion"
                value={formData.ambitoformacion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Tipo de Formación</Typography>
              <FormControl fullWidth>
                <Select
                  name="tipoformacion"
                  value={formData.tipoformacion}
                  onChange={handleChange}
                >
                  <MenuItem value="Taller">Taller</MenuItem>
                  <MenuItem value="Seminario">Seminario</MenuItem>
                  <MenuItem value="Curso">Curso</MenuItem>
                  <MenuItem value="Diplomado">Diplomado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Modalidad</Typography>
              <FormControl fullWidth>
                <Select
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Híbrido">Híbrido</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Duración</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    label="Horas"
                    fullWidth
                    type="number"
                    name="horas"
                    value={formData.horas || ""}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 23 }} // Limita a 0-23 horas
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    label="Minutos"
                    fullWidth
                    type="number"
                    name="minutos"
                    value={formData.minutos || ""}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 59 }} // Limita a 0-59 minutos
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    label="(HH:MM)"
                    fullWidth
                    name="duracion"
                    value={formData.duracion || ""}
                    InputProps={{
                      readOnly: true, // Hace el campo solo lectura
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Espacio Físico</Typography>
              <TextField
                fullWidth
                name="espaciofisico"
                value={formData.espaciofisico}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Estado</Typography>
              <FormControl fullWidth>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <MenuItem value="Planificada">Planificada</MenuItem>
                  <MenuItem value="En Curso">En Curso</MenuItem>
                  <MenuItem value="Suspendida">Suspendida</MenuItem>
                  <MenuItem value="Completada">Completada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Cargo que Desempeña
              </Typography>
              <TextField
                fullWidth
                name="funciondirigido"
                value={formData.funciondirigido}
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
                Ciclo
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="cicloacademico"
                  value={formData.cicloacademico || null}
                  onChange={handleChange}
                  fullWidth
                  disabled={!ciclos.length} // Deshabilitar si no hay ciclos cargados
                >
                  {ciclos.length > 0 ? (
                    ciclos.map((mun) => (
                      <MenuItem key={mun.id} value={mun.ciclo}>
                        {mun.ciclo}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Seleccione un ciclo</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Participantes Programados
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="participantesprog"
                value={formData.participantesprog || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Fecha de Finalización</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechafinal"
                value={formData.fechafinal || ""}
                error={fieldErrors.fechafinal} // Aquí se activa el error

                inputProps={{
                  min: formData.fechainicio || "",
                }}
                onChange={handleChange}
              />
            </Grid>




            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Dirección</Typography>
              <TextField
                fullWidth
                name="direccion"
                value={formData.direccion}
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
              <Typography variant="subtitle1">Observación</Typography>
              <TextField
                fullWidth
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
              />
            </Grid>
            {/*  <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Usuario</Typography>
              <TextField
                value={user || ""}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true, // Hace el campo solo lectura
                }}
              />
            </Grid> */}
          </Grid>
        </Paper>
        <TablaParticipantes investCap={id} />
      </Dashboard>
    </>
  );
};

export default FormulariActividad;
