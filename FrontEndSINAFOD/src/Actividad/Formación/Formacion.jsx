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
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";

import Swal from 'sweetalert2';




const Investigacion = () => {
    const { user } = useUser();
    const location = useLocation();
    const [investCapId, setInvestCapId] = useState(null);
    const [NivelEducativo, setNivelEducativo] = useState([]);
    const [errorM, setErrorM] = useState("");
    const [error, setError] = useState("");
    const [ciclos, setCiclos] = useState([]);
    const [isFromLineamientos, setIsFromLineamientos] = useState(false);
    const [formData, setFormData] = useState({
        accionformacion: location.state?.accionformacion || '',
        formacioninvest: "Formación",
        tipoactividad: "",
        existeconvenio: null,
        institucionconvenio: "",
        duracion: 0,
        funciondirigido: "",
        fechainicio: "",
        fechafinal: "",
        direccion: "",
        socializaron: null,
        zona: "",
        observacion: "",
        creadopor: user,
        modificadopor: user,
        institucionresponsable: "",
        responsablefirmas: "",
        ambitoformacion: "",
        tipoformacion: "",
        modalidad: "",
        duracion: 0,
        espaciofisico: "",
        idnivelesacademicos: "",
        cicloacademico: null,
        estado: "",
        participantesprog: 0,
        plataforma: ""
    });

    const [fieldErrors, setFieldErrors] = useState({
        fechainicio: false,
        fechafinal: false,
    });


    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/dashboard");
    };



    // Manejar cambios en campos de texto y selects
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => {
            // 1) Base de la nueva data
            let newData = { ...prevData, [name]: value };

            // 2) Validación de campo vacío
            const isEmpty = String(value || "").trim() === "";
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [name]: isEmpty,
            }));

            // 3) Validación de fechas
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
            
            // 4) Limpiar campos de convenio cuando pasamos a Interna
            if (name === "tipoactividad" && value === "Interna") {
                newData.institucionconvenio = "";
                newData.existeconvenio = "";
                // También limpiamos errores si los tuvieras
                setFieldErrors((prev) => ({
                    ...prev,
                    institucionconvenio: false,
                    existeconvenio: false,
                }));
            }

            // 5) Validación de minutos
            if (name === "minutos") {
                if (Number(value) > 59) {
                    setErrorM("Solo se admiten minutos hasta 59.");
                } else {
                    setErrorM("");
                }
            }

            // 6) Recalcular duración en HH:MM
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



    // Efecto para capturar el ID si viene del flujo "Guardar"

    useEffect(() => {
        if (location.state?.investCap) {
            setInvestCapId(location.state.investCap);
            setIsFromLineamientos(true);
            // Si viene con título desde lineamientos, actualiza el formData
            if (location.state.accionformacion) {
                setFormData(prev => ({
                    ...prev,
                    accionformacion: location.state.accionformacion
                }));
            }
        }
    }, [location.state]);

    const handleSave = async () => {
        // Lista de campos obligatorios
        const requiredFields = [
            "accionformacion",
            "tipoactividad",
            "fechainicio",
            "fechafinal",
            "socializaron"
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

        // Convierte strings vacíos a null
        const cleanedFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => {
                // Si el valor es una cadena vacía, lo convierte en null
                if (value === "") return [key, null];
                return [key, value];
            })
        );

        try {
            let idToUse = investCapId;

            // Si no hay ID (flujo "Omitir"), pedir confirmación
            if (!idToUse) {
                const confirmResult = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: "La investigación se registrará sin lineamientos. ¿Deseas continuar?",
                    icon: 'warning',

                    showCancelButton: true,
                confirmButtonColor: color.primary.azul,
                cancelButtonColor: color.primary.rojo,
                confirmButtonText: 'Sí, Registrar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
                });


                // Si el usuario cancela, no continuar
                if (!confirmResult.isConfirmed) {
                    return;
                }

                // Si confirma, hacer el POST
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/investC`,
                    cleanedFormData,
                    { headers: { "Content-Type": "application/json" } }
                );
                idToUse = response.data.id;
            }

            // Actualizar el registro
            const updateResponse = await axios.put(
                `${process.env.REACT_APP_API_URL}/investC/${idToUse}`,
                cleanedFormData,
                { headers: { "Content-Type": "application/json" } }
            );

            // Mostrar mensaje de éxito
            await Swal.fire(
                '¡Guardado!',
                'La investigación ha sido registrada',
                'success'
            );


            console.log("Datos que envio", formData);

            // Redirigir a Participantes con el ID
            navigate("/Participantes", { state: { investCap: idToUse } });

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
                            Registro de Datos sobre la Formación
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "-45px" }}>
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
                                Nombre de la Formación
                            </Typography>
                            <TextField
                                fullWidth
                                name="accionformacion"
                                value={formData.accionformacion}
                                onChange={handleChange}
                                error={fieldErrors.accionformacion}
                                helperText={fieldErrors.accionformacion ? "Este campo es obligatorio" : ""}
                                disabled={isFromLineamientos} // Deshabilita si viene de lineamientos
                                InputProps={{
                                    readOnly: isFromLineamientos,
                                }}
                            />
                            {isFromLineamientos && (
                                <Typography variant="caption" color="info">
                                    Este campo fue definido en los lineamientos
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">¿La Investigación Es Interna o Externa?</Typography>
                            <FormControl fullWidth error={fieldErrors.tipoactividad}>
                                <Select
                                    name="tipoactividad"
                                    value={formData.tipoactividad}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Interna">Interna</MenuItem>
                                    <MenuItem value="Externa">Externa</MenuItem>
                                </Select>
                                {fieldErrors.tipoactividad && (
                                    <FormHelperText style={{ color: 'red' }}>
                                        Debe seleccionar una opción
                                    </FormHelperText>
                                )}
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
                        {(formData.modalidad === "Online" || formData.modalidad === "Híbrido") && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">Plataforma en la que se Relizara la Actividad</Typography>
                                <TextField
                                    fullWidth
                                    name="plataforma"
                                    value={formData.plataforma}
                                    onChange={handleChange}
                                    error={fieldErrors.plataforma}
                                    helperText={fieldErrors.plataforma ? "Este campo es obligatorio" : ""}
                                />
                            </Grid>
                        )}
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
                            <Typography variant="subtitle1">¿Se realizó socialización?</Typography>
                            <FormControl fullWidth error={fieldErrors.socializaron}>
                                <Select name="socializaron" value={formData.socializaron} onChange={handleChange}>
                                    <MenuItem value="true">Sí</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
                                </Select>
                                {fieldErrors.socializaron && (
                                    <FormHelperText style={{ color: 'red' }}>
                                        Debe seleccionar una opción
                                    </FormHelperText>
                                )}
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
