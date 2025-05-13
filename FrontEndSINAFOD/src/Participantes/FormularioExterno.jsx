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
    Modal,
    Tabs,
    FormHelperText
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import { useUser } from "../Components/UserContext";
import TablaPacticantes from "./TablaParticipantes";
import Swal from 'sweetalert2';



const FormularioExterno = () => {

    const [fieldErrors, setFieldErrors] = useState({});
    const { id: investCap } = useParams();

    const { user } = useUser();
    const navigate = useNavigate();
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [departamentosRE, setDepartamentosRE] = useState([]);
    const [municipiosRE, setMunicipiosRE] = useState([]);
    const [NivelEducativo, setNivelEducativo] = useState([]);
    const [gardo, setGrado] = useState([]);
    const [aldeas, setAldea] = useState([]);
    const [aldeasP, setAldeaP] = useState([]);
    const [gardoP, setGradoP] = useState([]);
    const [openDNIModal, setOpenDNIModal] = useState(true); // Modal abierto por defecto
    const [tempDNI, setTempDNI] = useState('');
    const [dniError, setDniError] = useState('');
    const [formData, setFormData] = useState({
        idinvestigacioncap: investCap,
        correo: null,
        identificacion: null,
        codigosace: null,
        nombre: null,
        funcion: null,
        sexo: null,
        añosdeservicio: 0,
        codigodered: null,
        deptoresidencia: null,
        municipioresidencia: null,
        aldearesidencia: null,
        nivelacademicodocente: null,
        gradoacademicodocente: null,

        aldeaced: null,
        centroeducativo: null,
        idnivelesacademicos: null,
        idgradosacademicos: null,
        zona: null,
        municipioced: null,
        departamentoced: null,
        tipoadministracion: "Gubernamental",
        creadopor: null,
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
    console.log("investCap:", investCap);

    const handleSave = async () => {
        const requiredFields = [
            "identificacion",
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

        try {
            console.log("formData", formData);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/CapacitacionP/${investCap}`,
                formData,
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
                    timer: 12000,
                });

            }
        } catch (error) {
            console.error("Error al guardar los datos", error);
            Swal.fire({
                title: 'Error!',
                text: 'Error al guardar datos',
                icon: 'error',
                timer: 12000,
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




    useEffect(() => {
        const obtenerDetalles = async () => {
            try {

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/investC/${investCap}`);

                setFormData(response.data[0]);
            } catch (error) {
                console.error("Error al obtener los datos", error);
            }
        };

        obtenerDetalles();
    }, [investCap]);






    const obtenerDNI = async (campo) => {
        // Verifica cuál de los campos tiene datos según el parámetro 'campo'
        const filtro = formData[campo] && formData[campo].trim() !== "" ? formData[campo] : null;


        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/filtroDocentes/${tempDNI}`
            );

            if (response.data && response.data.length > 0) {
                const docente = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    codigosace: docente.codigosace || "",
                    //identificacion: docente.identificacion || "",
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

                console.log("Datos del docente:", docente);

                Swal.fire({
                    title: 'Participante encontrado',
                    text: 'Se encontraron datos del participante',
                    icon: 'success',
                    timer: 6000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'No se encontró ningún registro previo.',
                text: 'Por favor ingrese sus datos',
                icon: 'warning',
                timer: 12000,
            });
            alert("No se encontró ningún registro.");
        }
    };


    useEffect(() => {
        // Mostrar modal al cargar el componente
        setOpenDNIModal(true);
    }, []);



    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',         
                    display: 'flex',
                    justifyContent: 'center',      
                    alignItems: 'center',        
                    backgroundColor: '#f0f2f5'     
                }}
            >

                <Modal
                    open={openDNIModal}
                    onClose={() => { }} // No permitimos cerrar haciendo click fuera
                    aria-labelledby="dni-modal-title"
                    aria-describedby="dni-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "60%",
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}>
                        <Typography id="dni-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Ingreso de Identidad
                        </Typography>

                        <TextField
                            fullWidth
                            label="Número de Identidad (DNI)"
                            value={tempDNI}
                            onChange={(e) => {
                                setTempDNI(e.target.value);
                                // Validación en tiempo real
                                if (!e.target.value) {
                                    setDniError('Debe ingresar su número de identidad');
                                } else if (!/^\d{13}$/.test(e.target.value)) {
                                    setDniError('La identidad debe tener 13 dígitos');
                                } else {
                                    setDniError('');
                                }
                            }}
                            error={!!dniError}
                            helperText={dniError}
                            inputProps={{
                                maxLength: 13
                            }}
                        />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    // Validación final antes de enviar
                                    if (!tempDNI) {
                                        setDniError('Debe ingresar su número de identidad');
                                        return;
                                    }
                                    if (!/^\d{13}$/.test(tempDNI)) {
                                        setDniError('La identidad debe tener 13 dígitos');
                                        return;
                                    }

                                    // Cerrar modal
                                    setOpenDNIModal(false);

                                    // Actualizar el estado del formulario
                                    setFormData(prev => ({ ...prev, identificacion: tempDNI }));

                                    // Llamar a la función para obtener datos
                                    await obtenerDNI(tempDNI);
                                }}
                                disabled={!tempDNI || !!dniError}
                                sx={{ backgroundColor: color.primary.azul }}
                            >
                                Continuar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Paper sx={{ padding: 5, margin: 2, width: "80%" }} elevation={3}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} size={12}>
                            <Typography sx={{
                                color: color.primary.azul,
                                fontWeight: 'bold',
                                fontSize: {
                                    xs: '1.2rem',
                                    sm: '1.5rem',
                                    md: '2rem',
                                    lg: '2.5rem',
                                },
                            }}>
                                Registro de Participantes
                            </Typography>
                            <Typography

                                sx={{
                                    color: color.primary.azul,
                                    fontWeight: 'bold', // Negrita
                                    fontStyle: 'italic', // Cursiva
                                    textAlign: "center",
                                    fontSize: {
                                        xs: '1.2rem',
                                        sm: '1.5rem',
                                        md: '2rem',
                                        lg: '2.5rem',
                                    },
                                }}
                            >
                                {formData.accionformacion}
                            </Typography>

                        </Grid>

                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1" >
                                Por favor, complete la siguiente información, asegúrese de revisar sus respuestas antes de enviarlas.
                                <Typography variant="subtitle1" sx={{ color: color.primary.rojo }}>
                                    Los campos marcados con * son obligatorios.
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1" sx={{ color: color.primary.azul, textAlign: "center" }}>
                                Datos Generales del Participante
                            </Typography>
                        </Grid>

                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Código SACE *</Typography>
                            <TextField
                                fullWidth
                                name="codigosace"
                                value={formData.codigosace}
                                onChange={handleChange}
                                error={fieldErrors.codigosace}
                                helperText={fieldErrors.codigosace ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>

                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Identidad*</Typography>


                            <TextField
                                fullWidth
                                name="identificacion"
                                value={formData.identificacion}
                                onChange={handleChange}
                                error={fieldErrors.identificacion}
                                helperText={fieldErrors.identificacion ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Nombre*</Typography>
                            <TextField
                                fullWidth
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                error={fieldErrors.nombre}
                                helperText={fieldErrors.nombre ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <FormControl error={fieldErrors.sexo}>
                                <Typography variant="subtitle1">Sexo*</Typography>
                                <RadioGroup
                                    row
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                                >
                                    <FormControlLabel value="Femenino" control={<Radio />} label="Mujer" />
                                    <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" />
                                </RadioGroup>
                                {fieldErrors.sexo && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Nivel Educativo*</Typography>

                            <FormControl fullWidth error={fieldErrors.nivelacademicodocente}>
                                <Select
                                    fullWidth
                                    name="nivelacademicodocente"
                                    value={formData.nivelacademicodocente || ""}
                                    onChange={handleChange}>
                                    <MenuItem value="3">Media</MenuItem>
                                    <MenuItem value="4">Superior</MenuItem>
                                </Select>
                                {fieldErrors.nivelacademicodocente && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Grado Académico</Typography>
                            <FormControl fullWidth>
                                <Select
                                    fullWidth
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Años de Servicio*</Typography>
                            <TextField
                                fullWidth
                                name="añosdeservicio"
                                value={formData.añosdeservicio || ""}
                                onChange={handleChange}
                                error={fieldErrors.añosdeservicio}
                                helperText={fieldErrors.añosdeservicio ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Código de Red al que Pertenece</Typography>
                            <TextField fullWidth name="codigodered" value={formData.codigodered || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Cargo que Desempeña*</Typography>
                            <TextField
                                fullWidth
                                name="funcion"
                                value={formData.funcion}
                                onChange={handleChange}
                                error={fieldErrors.funcion}
                                helperText={fieldErrors.funcion ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Departamento de Residencia*</Typography>
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Municipio de Residencia*</Typography>
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
                        <Grid item xs={12} size={12}>
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

                    <Grid container spacing={2}>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1" sx={{ color: color.primary.azul, textAlign: "center", mt: 3 }}>
                                Datos del Centro Educativo Que Representa
                            </Typography>
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Nivel Educativo que Atiende*</Typography>
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Grado Académico que Atiende*</Typography>
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Centro Educativo*</Typography>
                            <TextField
                                fullWidth
                                name="centroeducativo"
                                value={formData.centroeducativo}
                                onChange={handleChange}
                                error={fieldErrors.centroeducativo}
                                helperText={fieldErrors.centroeducativo ? "Este campo es obligatorio" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <FormControl fullWidth >
                                <Typography variant="subtitle1">Tipo de Administración*</Typography>
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Zona Centro Educativo*</Typography>
                            <FormControl fullWidth error={fieldErrors.zona}>
                                <Select name="zona" value={formData.zona} onChange={handleChange}>
                                    <MenuItem value="Rural">Rural</MenuItem>
                                    <MenuItem value="Urbana">Urbana</MenuItem>
                                </Select>
                                {fieldErrors.zona && <FormHelperText>Este campo es obligatorio</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Departamento Centro Educativo*</Typography>
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
                        <Grid item xs={12} size={12}>
                            <Typography variant="subtitle1">Municipio Centro Educativo*</Typography>
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
                        <Grid item xs={12} size={12}>
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


                </Paper>

            </Box>
        </>
    );
};

export default FormularioExterno;
