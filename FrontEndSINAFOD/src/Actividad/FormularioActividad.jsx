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
  FormHelperText
} from "@mui/material";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from '../Components/UserContext';
import TablaActividad from "../Actividad/TablaAcividad";
import Swal from 'sweetalert2';

const FormulariActividad = () => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useUser();
  const [error, setError] = useState("");
  const [NivelEducativo, setNivelEducativo] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [errorM, setErrorM] = useState("");
  const [formData, setFormData] = useState({
    accionformacion: "",
    formacioninvest: "",
    institucionresponsable: "",
    responsablefirmas: "",
    ambitoformacion: "",
    tipoformacion: "",
    modalidad: "",
    duracion: 0,
    espaciofisico: "",
    idnivelesacademicos: "",
    cicloacademico: null,
    funciondirigido: "",
    estado: "",
    fechainicio: "",
    fechafinal: "",
    participantesprog: 0,
    direccion: "",
    zona: "",
    observacion: "",
    creadopor: user,
  });
  const [fieldErrors, setFieldErrors] = useState({
    fechainicio: false,
    fechafinal: false,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Campo cambiado: ${name}, Valor recibido: ${value}`);

    setFormData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Convertimos el valor a string para evitar errores con `.trim()`
      const valueStr = String(value || "");

      // Quitar error si el usuario llena un campo vacío
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: valueStr.trim() === "" ? true : false,
      }));

      // Validación de fechas
      if (name === "fechainicio" || name === "fechafinal") {
        const formattedDate = new Date(value).toISOString().split("T")[0];
        newData[name] = formattedDate;

        if (newData.fechainicio && newData.fechafinal) {
          if (new Date(newData.fechainicio) > new Date(newData.fechafinal)) {
            setError("La fecha de inicio no puede ser posterior a la fecha de finalización.");
            setFieldErrors({ fechainicio: true, fechafinal: true });
          } else {
            setError("");
            setFieldErrors({ fechainicio: false, fechafinal: false });
          }
        }
      }

      // Validación para participantesprog (solo números positivos)
      else if (name === "participantesprog") {
        if (valueStr === "" || /^\d+$/.test(valueStr)) {
          newData[name] = value;
        } else {
          return prevData;
        }
      }

      // Validar minutos
      if (name === "minutos" && Number(value) > 59) {
        setErrorM("Solo se admiten minutos hasta 59.");
      } else {
        setErrorM("");
      }

      // Calcular duración (HH:MM)
      const horas = newData.horas || 0;
      const minutos = newData.minutos || 0;
      newData.duracion = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

      return newData;
    });
  };




  const handleSave = async () => {
    // Lista de campos obligatorios
    const requiredFields = [
      "accionformacion",
      "formacioninvest",
      "institucionresponsable",
      "responsablefirmas",
      "ambitoformacion",
      "tipoformacion",
      "modalidad",
      "estado",
      "funciondirigido",
      "participantesprog",
      "fechainicio",
      "fechafinal",
      "espaciofisico",
      "direccion",
      "zona",
    ];

    // Detectar campos vacíos
    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = true; // Marcar campo como vacío
      }
    });

    // Verifica que al menos uno de los campos "horas" o "minutos" esté lleno
    if (!formData.horas && !formData.minutos) {
      errors.horas = 'Debe llenar al menos uno de los campos: Horas o Minutos';
      errors.minutos = 'Debe llenar al menos uno de los campos: Horas o Minutos';
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

    // Verificación de minutos antes de guardar los datos
    if (formData.minutos > 59) {
      Swal.fire({
        title: 'Advertencia!',
        text: 'Los minutos no pueden ser mayores a 59.',
        icon: 'warning',
        timer: 6000,
      });
      return; // Detiene la ejecución si la validación falla
    }
    // Verificación de la fecha antes de guardar los datos
    if (formData.fechainicio && formData.fechafinal) {
      if (new Date(formData.fechainicio) > new Date(formData.fechafinal)) {
        Swal.fire({
          title: 'Advertencia!',
          text: 'La fecha de inicio no puede ser posterior a la fecha de finalización.',
          icon: 'warning',
          timer: 6000,
        });
        return; // No proceder con la solicitud si la validación falla
      }
    }
    try {
      console.log("Datos que se enviarán:", JSON.stringify(formData, null, 2));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/investC`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta de la API:", response.data);

      if (response.status === 200) {
        const investCap = response.data.id; // Captura el id

        Swal.fire({
          title: 'Guardado!',
          text: 'Datos guardados correctamente',
          icon: 'success',
          timer: 6000,
        });


        setIsSaved(true);
        // Navega a '/Participantes' y pasa el id como parte del state
        navigate("/Participantes", { state: { investCap } });
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
        console.log("Ciclos obtenidos:", response.data);

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



  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>

          <Typography variant="h3" sx={{ color: color.primary.azul }}>
            Registro de Nueva Actividad - Formativa o de Investigación
          </Typography>


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
                error={fieldErrors.accionformacion}
                helperText={fieldErrors.accionformacion ? "Este campo es obligatorio" : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Formación o Investigación
              </Typography>
              <FormControl fullWidth error={fieldErrors.formacioninvest}>
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
                error={fieldErrors.institucionresponsable}
                helperText={fieldErrors.institucionresponsable ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Responsable de Firmas</Typography>
              <TextField
                fullWidth
                name="responsablefirmas"
                value={formData.responsablefirmas}
                onChange={handleChange}
                error={fieldErrors.responsablefirmas}
                helperText={fieldErrors.responsablefirmas ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Ambito de Formación</Typography>
              <TextField
                fullWidth
                name="ambitoformacion"
                value={formData.ambitoformacion}
                onChange={handleChange}
                error={fieldErrors.ambitoformacion}
                helperText={fieldErrors.ambitoformacion ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Tipo de Formación</Typography>
              <FormControl fullWidth error={fieldErrors.tipoformacion}>
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
                {fieldErrors.tipoformacion && <FormHelperText>Este campo es obligatorio</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Modalidad</Typography>
              <FormControl fullWidth error={fieldErrors.modalidad}>
                <Select
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Híbrido">Híbrido</MenuItem>
                </Select>
                {fieldErrors.modalidad && <FormHelperText>Este campo es obligatorio</FormHelperText>}
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
                    error={fieldErrors.horas || fieldErrors.minutos}
                    helperText={fieldErrors.horas || fieldErrors.minutos}
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
                    error={fieldErrors.horas || fieldErrors.minutos}
                    helperText={fieldErrors.horas || fieldErrors.minutos}
                  />
                  {errorM && <div style={{ color: "red", marginTop: "5px" }}>{errorM}</div>}
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
              <Typography variant="subtitle1">Estado</Typography>
              <FormControl fullWidth error={fieldErrors.estado}>
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
                {fieldErrors.estado && <FormHelperText>Este campo es obligatorio</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Cargo a la que va dirigido
              </Typography>
              <TextField
                fullWidth
                name="funciondirigido"
                value={formData.funciondirigido}
                onChange={handleChange}
                error={fieldErrors.funciondirigido}
                helperText={fieldErrors.funciondirigido ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Nivel Educativo
              </Typography>
              <FormControl fullWidth error={fieldErrors.idnivelesacademicos}>
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
                Ciclo Académico
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
                helperText={fieldErrors.funciondirigido ? "Este campo es obligatorio" : ""}
                inputProps={{
                  min: formData.fechainicio || "",
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Cantidad de Participantes Programados
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="participantesprog"
                value={formData.participantesprog || ""}
                onChange={handleChange}
                error={fieldErrors.participantesprog}
                helperText={fieldErrors.participantesprog ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Espacio Físico</Typography>
              <TextField
                fullWidth
                name="espaciofisico"
                value={formData.espaciofisico}
                onChange={handleChange}
                error={fieldErrors.espaciofisico}
                helperText={fieldErrors.espaciofisico ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Dirección</Typography>
              <TextField
                fullWidth
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                error={fieldErrors.direccion}
                helperText={fieldErrors.direccion ? "Este campo es obligatorio" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Zona</Typography>
              <FormControl fullWidth error={fieldErrors.zona}>
                <Select
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                >
                  <MenuItem value="Rural">Rural</MenuItem>
                  <MenuItem value="Urbana">Urbana</MenuItem>
                </Select>
                {fieldErrors.zona && <FormHelperText>Este campo es obligatorio</FormHelperText>}
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
            {/*   <Grid item xs={12} sm={6}>
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
          <Box sx={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
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
        </Paper>
        <TablaActividad isSaved={isSaved} setIsSaved={setIsSaved} />
      </Dashboard>
    </>
  );
};

export default FormulariActividad;
