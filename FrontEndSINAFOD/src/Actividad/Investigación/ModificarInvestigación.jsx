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
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import ChecklistIcon from '@mui/icons-material/Checklist';
import Swal from 'sweetalert2';




const Investigacion = () => {
    const { user } = useUser();

    const { id } = useParams();

    const [NivelEducativo, setNivelEducativo] = useState([]);
    const [errorM, setErrorM] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        accionformacion: '',
        formacioninvest: "",
        tipoactividad: "",
        existeconvenio: null,
        institucionconvenio: "",
        costo: "",
        duracion: 0,
        idnivelesacademicos: "",
        funciondirigido: "",
        fechainicio: "",
        fechafinal: "",
        direccion: "",
        socializaron: null,
        zona: "",
        observacion: "",
        creadopor: user,
        modificadopor: user
    });

    const [fieldErrors, setFieldErrors] = useState({
        fechainicio: false,
        fechafinal: false,
    });


    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/dashboard");
    };


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

                console.log(response.data);

            } catch (error) {
                console.error("Error al obtener los datos", error);
            }
        };

        obtenerDetalles();
    }, [id]);


    // Manejar cambios en campos de texto y selects
    const handleChange = (event) => {
        const { name, value } = event.target;
      
        setFormData((prevData) => {
          // Construimos la nueva data base
          let newData = { 
            ...prevData, 
            [name]: value 
          };
      
          // Validación rápida de errores de campo vacío
          const isEmpty = String(value || "").trim() === "";
          setFieldErrors((prev) => ({
            ...prev,
            [name]: isEmpty,
          }));
      
          // Si cambiamos a "Interna", limpiamos los campos de convenio
          if (name === "tipoactividad" && value === "Interna") {
            newData.institucionconvenio = "";
            newData.existeconvenio = "";
            setFieldErrors((prev) => ({
              ...prev,
              institucionconvenio: false,
              existeconvenio: false,
            }));
          }
      
          // Validación de fechas
          if (name === "fechainicio" || name === "fechafinal") {
            const isValidDate = value && !isNaN(new Date(value).getTime());
        
            if (isValidDate) {
                newData[name] = new Date(value).toISOString().split("T")[0];
            } else {
                newData[name] = "";
            }
        
            const { fechainicio, fechafinal } = newData;
        
            if (fechainicio && fechafinal && new Date(fechainicio) > new Date(fechafinal)) {
                setError("La fecha de inicio no puede ser posterior a la fecha de finalización.");
                setFieldErrors({ fechainicio: true, fechafinal: true });
            } else {
                setError("Este campo es obligatorio");
                setFieldErrors((prevErrors) => ({
                    ...prevErrors,
                    fechainicio: !fechainicio,
                    fechafinal: !fechafinal,
                }));
            }
        }
        
      
          // Validación de minutos
          if (name === "minutos") {
            if (Number(value) > 59) {
              setErrorM("Solo se admiten minutos hasta 59.");
            } else {
              setErrorM("");
            }
          }
      
          // Recalcular duración en HH:MM
          const horas = Number(newData.horas) || 0;
          const minutos = Number(newData.minutos) || 0;
          newData.duracion = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
      
          return newData;
        });
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




    const handleSave = async () => {
        // Lista de campos obligatorios
        const requiredFields = [
            "accionformacion",
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
                timer: 6000,
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

        // Verificar los campos booleanos
        const { presentoprotocolo, monitoreoyevaluacion, aplicacionevaluacion } = formData;
        const trueCount = [presentoprotocolo, monitoreoyevaluacion, aplicacionevaluacion]
            .filter(value => value === true).length;

        if (trueCount < 3) {
            const result = await Swal.fire({
                title: 'Confirmación',
                text: `¿Está seguro de actualizar esta investigación con solo ${trueCount} de los 3 lineamientos requeridos?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: color.primary.azul,
                cancelButtonColor: color.primary.rojo,
                confirmButtonText: 'Sí, Actualizar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            });

            if (!result.isConfirmed) {
                return; // No proceder si el usuario cancela
            }
        }


        // Convierte strings vacíos a null y actualiza el campo modificadopor
        const cleanedFormData = Object.fromEntries(
            Object.entries({
                ...formData,
                modificadopor: user // Asegúrate de incluir el usuario actual aquí
            }).map(([key, value]) => {
                // Si el valor es una cadena vacía, lo convierte en null
                if (value === "") return [key, null];
                return [key, value];
            })
        );

        try {
            // Actualizar el registro
            const updateResponse = await axios.put(
                `${process.env.REACT_APP_API_URL}/investC/${id}`,
                cleanedFormData,
                { headers: { "Content-Type": "application/json" } }
            );

            // Mostrar mensaje de éxito
            await Swal.fire(
                'Actualización!',
                'La investigación ha sido actualizada',
                'success'
            );

            console.log("Datos que envio", formData);

            // Redirigir a Participantes con el ID
            // navigate("/Participantes", { state: { investCap: id } });
            navigate("/dashboard")
        } catch (error) {
            console.error("Error al guardar los datos", error);
            Swal.fire('Error!', 'Error al guardar datos', 'error');
        }
    };

    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    <Box alignItems="center" justifyContent="space-between">

                        <Typography variant="h3" sx={{ color: color.primary.azul }}>
                            Actualizar Datos sobre la Investigación
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "-45px" }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: color.primary.azul, mr: 3 }}
                                startIcon={<ChecklistIcon />}
                                onClick={() => navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`)}
                            >
                                Lineamientos
                            </Button>
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
                        </Box>

                    </Box>

                    <Grid container spacing={5} mt={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                Título del Proyecto
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
                            <Typography variant="subtitle1">¿La Investigación Es Interna o Externa?</Typography>
                            <FormControl fullWidth >
                                <Select
                                    name="tipoactividad"
                                    value={formData.tipoactividad}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Interna">Interna</MenuItem>
                                    <MenuItem value="Externa">Externa</MenuItem>
                                </Select>

                            </FormControl>
                        </Grid>
                        {formData.tipoactividad === "Externa" && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">Nombre de la Institución Asociada</Typography>
                                    <TextField
                                        fullWidth
                                        name="institucionconvenio"
                                        value={formData.institucionconvenio}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">Se Tiene Convenio la Institución Asociada</Typography>
                                    <FormControl fullWidth >
                                        <Select
                                            name="existeconvenio"
                                            value={formData.existeconvenio}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="true">Sí</MenuItem>
                                            <MenuItem value="false">No</MenuItem>
                                        </Select>

                                    </FormControl>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                Costo
                            </Typography>
                            <TextField
                                fullWidth
                                name="costo"
                                value={formData.costo}
                                onChange={handleChange}
                            />
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
                            <Typography variant="subtitle1">
                                Población a la que va dirigido
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
                            <FormControl fullWidth > {/**error={fieldErrors.idnivelesacademicos} */}
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
                            <Typography variant="subtitle1">Dirección</Typography>
                            <TextField
                                fullWidth
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                            /* error={fieldErrors.direccion}
                            helperText={fieldErrors.direccion ? "Este campo es obligatorio" : ""} */
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Zona</Typography>
                            <FormControl fullWidth> {/*error={fieldErrors.zona} */}
                                <Select
                                    name="zona"
                                    value={formData.zona}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Rural">Rural</MenuItem>
                                    <MenuItem value="Urbana">Urbana</MenuItem>
                                </Select>
                                {/*  {fieldErrors.zona && <FormHelperText>Este campo es obligatorio</FormHelperText>} */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">¿Se realizó socialización?</Typography>
                            <FormControl fullWidth >
                                <Select name="socializaron" value={formData.socializaron} onChange={handleChange}>
                                    <MenuItem value="true">Sí</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
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
                    </Grid>
                    <Box sx={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>


                        <Button
                            variant="contained"
                            sx={{ backgroundColor: color.primary.azul, ml: 5 }}
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>

                    </Box>






                </Paper>

            </Dashboard>
        </>
    );
};

export default Investigacion;
