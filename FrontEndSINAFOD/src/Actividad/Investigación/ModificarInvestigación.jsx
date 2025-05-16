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
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';



const Investigacion = () => {
    const { user } = useUser();

    const { id } = useParams();

    const [NivelEducativo, setNivelEducativo] = useState([]);
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
        creadopor: user.id,
        modificadopor: user.id
    });

    const [fieldErrors, setFieldErrors] = useState({
        fechainicio: false,
        fechafinal: false,
    });


    const navigate = useNavigate();
 

    useEffect(() => {
        const obtenerDetalles = async () => {
            try {

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/investC/${id}`);
                const data = response.data[0];
                const dia = data.duracion?.days || 0;
                const mes = data.duracion?.months || 0;
                const año = data.duracion?.years || 0;

                setFormData({
                    ...data,
                    dia: data.duracion?.days || 0,
                    mes: data.duracion?.months || 0,
                    año: data.duracion?.years || 0,
                    duracion: `${año} years ${mes} months ${dia} days`,
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
            let newData = {
                ...prevData,
                [name]: value,
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

            // Validación de los campos de duración (año, mes, día)
            if (name === "año" || name === "mes" || name === "dia") {
                const inputValue = event.target.value;

                // 1. Validar que solo sean números (bloquear letras/símbolos)
                const isPositiveInteger = /^[0-9]*$/.test(inputValue); // Permite campo vacío ("")
                if (!isPositiveInteger) {
                    return prevData; // No actualiza si hay caracteres inválidos
                }

                // 2. Actualizar el estado con el valor numérico (o "")
                newData[name] = inputValue === "" ? "" : Number(inputValue);

                // 3. Validar rangos (aquí sí detectará meses > 12)
                const año = Number(newData.año) || 0;
                const mes = Number(newData.mes) || 0;
                const dia = Number(newData.dia) || 0;

                const errorAño = isNaN(año) || año < 0;
                const errorMes = isNaN(mes) || mes < 0 || mes > 12;
                const errorDia = isNaN(dia) || dia < 0;

                setFieldErrors((prev) => ({
                    ...prev,
                    año: errorAño,
                    mes: errorMes,
                    dia: errorDia,
                }));

                // 4. Calcular duración solo si no hay errores
                if (!errorAño && !errorMes && !errorDia) {
                    newData.duracion = `${año} years ${mes} months ${dia} days`;
                }
            }
            return newData;
        });
    };



    const translateDuracion = (duracion) => {
        if (!duracion) return "";

        return duracion
            .replace(/years?/g, "años")
            .replace(/months?/g, "meses")
            .replace(/days?/g, "días");
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
            "tipoactividad",
            "socializaron"
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
                timer: 6000,
            });
            return;
        }

        // 2. Validar campos numéricos (año, mes, día)
        const { año, mes, dia } = formData;

        // Verificar si son números válidos y cumplen rangos
        const errorAño = año === null || isNaN(año) || año < 0;
        const errorMes = mes === null || isNaN(mes) || mes < 0 || mes > 12;
        const errorDia = dia === null || isNaN(dia) || dia < 0;

        if (errorAño || errorMes || errorDia) {
            setFieldErrors((prev) => ({
                ...prev,
                año: errorAño,
                mes: errorMes,
                dia: errorDia,
            }));

            Swal.fire({
                title: "Error en duración",
                text: "Revise los campos de año, mes o día. Asegúrese de que sean números válidos y que el mes no sea mayor a 12.",
                icon: "error",
                timer: 6000,
            });
            return; // Detiene el guardado
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
                modificadopor: user.id // Asegúrate de incluir el usuario actual aquí
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
                    <Typography variant="h4" sx={{ color: color.primary.azul }}>
                        Actualizar Datos sobre la Investigación
                    </Typography>

                    <Grid container spacing={1} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Grid>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: color.primary.azul }}
                                startIcon={<Groups2OutlinedIcon />}
                                onClick={() => navigate("/Participantes", { state: { formacioninvest: formData.formacioninvest } })}
                            >
                                Participantes
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: color.primary.azul }}
                                startIcon={<ChecklistIcon />}
                                onClick={() => navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`)}
                            >
                                Lineamientos
                            </Button>
                        </Grid>
                        <Grid>
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
                    <Grid container spacing={5} mt={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">¿La Investigación Es Interna o Externa?</Typography>
                            <FormControl fullWidth error={fieldErrors.tipoactividad} >
                                <Select
                                    name="tipoactividad"
                                    value={formData.tipoactividad}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Interna">Interna</MenuItem>
                                    <MenuItem value="Externa">Externa</MenuItem>
                                </Select>
                                {fieldErrors.tipoactividad && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                            </FormControl>
                        </Grid>
                        {formData.tipoactividad === "Externa" && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle1">Nombre de la Institución Asociada</Typography>
                                    <TextField
                                        fullWidth
                                        name="institucionconvenio"
                                        value={formData.institucionconvenio}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">
                                Presupuesto
                            </Typography>
                            <TextField
                                fullWidth
                                name="costo"
                                value={formData.costo}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">Duración</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        variant="outlined"
                                        label="Años"
                                        fullWidth
                                        type="text"
                                        name="año"
                                        value={formData.año || ""}
                                        onChange={handleChange}
                                        error={fieldErrors.año} // Aquí indicamos que el campo tiene error
                                        helperText={fieldErrors.año ? "Por favor ingresa un número válido para el año." : ""}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        variant="outlined"
                                        label="Meses"
                                        fullWidth
                                        type="text"
                                        name="mes"
                                        value={formData.mes || ""}
                                        onChange={handleChange}
                                        error={fieldErrors.mes} // Aquí indicamos que el campo tiene error
                                        helperText={fieldErrors.mes ? "El mes debe estar entre 0 y 12." : ""}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        variant="outlined"
                                        label="Días"
                                        fullWidth
                                        type="text"
                                        name="dia"
                                        value={formData.dia || ""}
                                        onChange={handleChange}
                                        error={fieldErrors.dia} // Aquí indicamos que el campo tiene error
                                        helperText={fieldErrors.dia ? "Por favor ingresa un número válido para el día." : ""}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <TextField
                                        variant="outlined"
                                        label="(Año-Mes-Día)"
                                        fullWidth
                                        name="duracion"
                                        value={translateDuracion(formData.duracion) || ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">
                                Población Objetivo
                            </Typography>
                            <TextField
                                fullWidth
                                name="funciondirigido"
                                value={formData.funciondirigido}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">Ubicación</Typography>
                            <TextField
                                fullWidth
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                            /* error={fieldErrors.direccion}
                            helperText={fieldErrors.direccion ? "Este campo es obligatorio" : ""} */
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1">¿Se realizó convocatoria?</Typography>
                            <FormControl fullWidth error={fieldErrors.socializaron}>
                                <Select
                                    name="socializaron"
                                    value={formData.socializaron}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="true">Sí</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
                                </Select>
                                {fieldErrors.socializaron && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
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
