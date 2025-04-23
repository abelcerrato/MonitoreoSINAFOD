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
    IconButton,
} from "@mui/material";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';


const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const LineamientosM = () => {
    const { user } = useUser();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        accionformacion: "",
        criteriosfactibilidadurl: null,
        requisitostecnicosurl: null,
        criterioseticosurl: null,
        formacioninvest: "",
    });
    const [existingFiles, setExistingFiles] = useState({
        criteriosfactibilidadurl: null,
        requisitostecnicosurl: null,
        criterioseticosurl: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDetalles = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/investC/${id}`
                );
                const data = response.data[0];

                setFormData({
                    ...data,
                    fechainicio: data.fechainicio ? data.fechainicio.split("T")[0] : "",
                    fechafinal: data.fechafinal ? data.fechafinal.split("T")[0] : "",
                });

                // Asegúrate de que los nombres de los archivos se establezcan correctamente
                setExistingFiles({
                    criteriosfactibilidadurl: data.criteriosfactibilidadurl || null,
                    requisitostecnicosurl: data.requisitostecnicosurl || null,
                    criterioseticosurl: data.criterioseticosurl || null,
                });
            } catch (error) {
                console.error("Error al obtener los datos", error);
            }
        };
        obtenerDetalles();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));

        // Limpiar el archivo existente cuando se selecciona uno nuevo
        setExistingFiles((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

    const handleDownload = async (filename) => {
        try {
            // Codificar el nombre del archivo para la URL
            const encodedFilename = encodeURIComponent(filename);

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/download/${encodedFilename}`,
                {
                    responseType: "blob",
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                }
            );

            // Extraer el nombre original del archivo del Content-Disposition
            const contentDisposition = response.headers["content-disposition"];
            let downloadFilename = filename;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(
                    /filename="?(.+?)"?(;|$)/
                );
                if (filenameMatch && filenameMatch[1]) {
                    downloadFilename = filenameMatch[1];
                }
            }

            // Crear el enlace de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", downloadFilename);
            document.body.appendChild(link);
            link.click();

            // Limpieza
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error("Error al descargar:", error);
            Swal.fire("Error", "No se pudo descargar el archivo", "error");
        }
    };

    const handleDeleteFile = (fieldName) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres eliminar este archivo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: color.primary.azul,
            cancelButtonColor: color.primary.rojo,
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'No, Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setExistingFiles((prev) => ({
                    ...prev,
                    [fieldName]: null,
                }));
                setFormData((prev) => ({
                    ...prev,
                    [fieldName]: null,
                }));
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.accionformacion) {
            Swal.fire("Error", "El título del proyecto es requerido", "error");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("accionformacion", formData.accionformacion);
        formDataToSend.append("modificadopor", user);
        formDataToSend.append("formacioninvest", "Formación");

        // Contador de archivos subidos
        let uploadedFilesCount = 0;
        const totalRequiredFiles = 3;
        const fileFields = [
            "criteriosfactibilidadurl",
            "requisitostecnicosurl",
            "criterioseticosurl",
        ];

        fileFields.forEach((field) => {
            // Si hay un nuevo archivo, lo agregamos
            if (formData[field] instanceof File) {
                formDataToSend.append(field, formData[field]);
                uploadedFilesCount++;
            }
            // Si hay un archivo existente y no se ha subido uno nuevo, lo mantenemos
            else if (existingFiles[field] && !formData[field]) {
                formDataToSend.append(field, existingFiles[field]);
                uploadedFilesCount++;
            }
            // Si no hay ninguno, enviamos "null" como string
            else {
                formDataToSend.append(field, "null");
            }
        });
        // Verificar si faltan archivos
        if (uploadedFilesCount < totalRequiredFiles) {
            const result = await Swal.fire({
                title: 'Lineamientos incompletos',
                text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos. ¿Deseas continuar con la actualización?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: color.primary.azul,
                cancelButtonColor: color.primary.rojo,
                confirmButtonText: 'Sí, Actualizar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            });

            if (!result.isConfirmed) {
                return; // No continuar si el usuario cancela
            }
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/lineamientos/${id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Swal.fire("Éxito", "Lineamientos actualizados correctamente", "success");
            navigate(`/Actualizar_Formación/${id}`);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            Swal.fire("Error", "Hubo un problema al guardar los datos", "error");
        }
    };

    const renderFileField = (fieldName, label) => {
        const existingFile = existingFiles[fieldName];
        const newFile = formData[fieldName];

        // Función para extraer el nombre legible del archivo
        const getDisplayName = (filePath) => {
            if (!filePath) return "";
            const parts = filePath.split("/").pop().split("-");
            // Elimina los primeros 4 elementos (id, día, mes, año)
            return parts.slice(4).join("-");
        };

        return (
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    {label}
                </Typography>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2, backgroundColor: color.primary.azul }}
                >
                    Seleccionar archivo
                    <VisuallyHiddenInput
                        type="file"
                        name={fieldName}
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                </Button>

                {/* Mostrar archivo existente o nuevo */}
                {(existingFile || newFile) && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {existingFile ? getDisplayName(existingFile) : newFile.name}
                        </Typography>

                        {/* Mostrar botón de descarga solo para archivos existentes
            {existingFile && !newFile && (
              <IconButton
                onClick={() => handleDownload(existingFile)}
                color="primary"
                size="small"
              >
                <DownloadIcon />
              </IconButton>
            )}
 */}
                        <IconButton
                            onClick={() => handleDownload(existingFile)}
                            color="primary"
                            size="small"
                        >
                            <DownloadIcon />
                        </IconButton>
                        {/* Botón de eliminar */}
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                                if (existingFile) {
                                    handleDeleteFile(fieldName);
                                } else {
                                    setFormData((prev) => ({ ...prev, [fieldName]: null }));
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Grid>
        );
    };

    return (
        <Dashboard>
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h4" sx={{ color: color.primary.azul }}>
                            Actualizar Lineamientos de Formación
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
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

                <Grid container spacing={5} mt={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1"> Nombre de la Formación</Typography>
                        <TextField
                            fullWidth
                            name="accionformacion"
                            value={formData.accionformacion}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>

                    {renderFileField(
                        "criteriosfactibilidadurl",
                        "Documento de Cumplimientos de los Criterios de Factibilidad"
                    )}

                    {renderFileField(
                        "requisitostecnicosurl",
                        "Documento de Cumplimiento de los Requisitos Técnicos"
                    )}
                    {renderFileField(
                        "criterioseticosurl",
                        " Documento de Cumplimientos de los Criterios Éticos"
                    )}
                </Grid>

                <Box sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}>
                    {/*  <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.rojo }}
                        startIcon={<FastForwardOutlinedIcon />}
                        onClick={() => navigate("/Investigación")}
                    >
                        Omitir
                    </Button> */}
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul, ml: 5 }}
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </Box>
            </Paper>
        </Dashboard>
    );
};

export default LineamientosM;
