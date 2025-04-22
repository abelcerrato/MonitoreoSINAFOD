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
import TablaPacticantes from "../../Participantes/TablaParticipantes";
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



const FormularParticipantes = () => {
    const { user } = useUser();
    const [value, setValue] = React.useState("1");
    const [formData, setFormData] = useState({
        accionformacion: '',
        estadoprotocolo: '',
        presentoprotocolourl: null,
        monitoreoyevaluacionurl: null,
        aplicacionevaluacionurl: null,
        creadopor: user,
    });
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/dashboard");
    };

    const handleChangeValues = (event, newValue) => {
        setValue(newValue);
    };



    // Manejar cambios en campos de texto y selects
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejar cambios en campos de archivo
    const [fileNames, setFileNames] = useState({
        presentoprotocolourl: "",
        monitoreoyevaluacionurl: "",
        aplicacionevaluacionurl: "",
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        // Actualiza formData con el archivo
        setFormData(prev => ({
            ...prev,
            [name]: file,
        }));

        // Actualiza solo el nombre del archivo correspondiente
        setFileNames(prev => ({
            ...prev,
            [name]: file ? file.name : "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        // Agregar campos de texto
        formDataToSend.append('accionformacion', formData.accionformacion);
        formDataToSend.append('estadoprotocolo', formData.estadoprotocolo);
        formDataToSend.append('creadopor', user);
        // Agregar archivos si existen
        if (formData.presentoprotocolourl) {
            formDataToSend.append('presentoprotocolourl', formData.presentoprotocolourl);
        }
        if (formData.monitoreoyevaluacionurl) {
            formDataToSend.append('monitoreoyevaluacionurl', formData.monitoreoyevaluacionurl);
        }
        if (formData.aplicacionevaluacionurl) {
            formDataToSend.append('aplicacionevaluacionurl', formData.aplicacionevaluacionurl);
        }
        console.log("Datos que envio", formDataToSend);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/lineamientos`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log('Respuesta del servidor:', response.data);
            // Mostrar mensaje de éxito o redireccionar
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            // Mostrar mensaje de error
        }
    };
    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h3" sx={{ color: color.primary.azul }}>
                                Registro de Participantes
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
                            <Grid container spacing={5}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        Título del Proyecto
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="accionformacion"
                                        value={formData.accionformacion}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}></Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Documento del Protocolo del Proyecto de Investigación Educativa
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Seleccionar archivo
                                        <VisuallyHiddenInput
                                            type="file"
                                            name="presentoprotocolourl"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {formData.presentoprotocolourl && <span>{formData.presentoprotocolourl.name}</span>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        Estado del Protocolo
                                    </Typography>
                                    <FormControl fullWidth >
                                        <Select
                                            name="estadoprotocolo"
                                            value={formData.estadoprotocolo || ""}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Incompleta">Incompleto</MenuItem>
                                            <MenuItem value="Completa">Completo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Documento de Monitoreo y Evaluación
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Seleccionar archivo
                                        <VisuallyHiddenInput
                                            type="file"
                                            name="monitoreoyevaluacionurl"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {formData.monitoreoyevaluacionurl && <span>{formData.monitoreoyevaluacionurl.name}</span>}


                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Documento de Aplicación de Evaluación
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Seleccionar archivo
                                        <VisuallyHiddenInput
                                            type="file"
                                            name="aplicacionevaluacionurl"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {formData.aplicacionevaluacionurl && <span>{formData.aplicacionevaluacionurl.name}</span>}
                                </Grid>
                            </Grid>
                            <Box sx={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: color.primary.azul }}
                                    startIcon={<SaveIcon />}
                                    onChange={handleChangeValues}
                                >
                                    Omitir
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: color.primary.azul }}
                                    startIcon={<SaveIcon />}
                                    onClick={handleSubmit}
                                >
                                    Guardar
                                </Button>

                            </Box>
                        </TabPanel>

                        {/* Tab 2: Datos del Centro Educativo */}
                        <TabPanel value="2">
                            <Grid container spacing={5} >

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        ¿La Investigación sera Interna o Externa?
                                    </Typography>
                                    <FormControl fullWidth >
                                        <Select
                                            name="tipoacctividad"
                                            value={formData.tipoacctividad || ""}
                                        >
                                            <MenuItem value="Interna">Interna</MenuItem>
                                            <MenuItem value="Externa">Externa</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {formData.tipoacctividad === "Externa" && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                ¿Con que Institucion?
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="institucionconvenio"
                                                value={formData.institucionconvenio}


                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                ¿Tiene Convenio con esa Institución?
                                            </Typography>
                                            <RadioGroup
                                                row
                                                name="existeconvenio"
                                                value={formData.existeconvenio}
                                                onChange={(e) => setFormData({ ...formData, existeconvenio: e.target.value })}
                                            >
                                                <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">
                                        ¿Se Realizo Socialización?
                                    </Typography>
                                    <RadioGroup
                                        row
                                        name="Socialización"
                                        value={formData.Socialización}
                                        onChange={(e) => setFormData({ ...formData, Socialización: e.target.value })}
                                    >
                                        <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <Box sx={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: color.primary.azul }}
                                    startIcon={<SaveIcon />}
                                    onClick={handleSubmit}
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

export default FormularParticipantes;
