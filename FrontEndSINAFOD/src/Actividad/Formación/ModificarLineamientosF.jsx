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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';

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

const ModificarLineamientos = () => {
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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);
    const [currentPreviewField, setCurrentPreviewField] = useState(null);
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

        // Validar tipo de archivo (nueva validación)
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const fileType = file.type;
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Verificar si el tipo o extensión están permitidos
            if (!allowedTypes.includes(fileType) &&
                !['pdf', 'jpg', 'jpeg', 'png'].includes(fileExtension)) {
                // Mostrar alerta de error
                Swal.fire({
                    title: 'Tipo de archivo no permitido',
                    text: 'Solo se permiten archivos PDF, JPG, JPEG o PNG.',
                    icon: 'error',
                    confirmButtonColor: color.primary.azul,
                });

                // Limpiar el input file
                e.target.value = '';
                return;
            }

            // Validación opcional de tamaño (descomenta si lo necesitas)
            /*
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
              Swal.fire({
                title: 'Archivo demasiado grande',
                text: `El tamaño máximo permitido es ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                icon: 'error',
                confirmButtonColor: color.primary.azul,
              });
              e.target.value = '';
              return;
            }
            */
        }

        // Actualiza formData con el archivo (esto ya lo tenías)
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

    /*   const handleDownload = async (filename) => {
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
      }; */

    const handleDownload = async (filename) => {
        try {
            // 1. Codificar el nombre del archivo para la URL
            const encodedFilename = encodeURIComponent(filename);

            // 2. Hacer la petición al backend
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/download/${encodedFilename}`,
                {
                    responseType: "blob", // Mantenemos blob para compatibilidad
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                }
            );

            // 3. Extraer el nombre original del archivo
            const contentDisposition = response.headers["content-disposition"];
            let downloadFilename = filename.split('-').slice(4).join('-'); // Nombre original

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
                if (filenameMatch && filenameMatch[1]) {
                    downloadFilename = filenameMatch[1];
                }
            }

            // 4. Crear el enlace de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", downloadFilename);
            document.body.appendChild(link);
            link.click();

            // 5. Limpieza
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
        formDataToSend.append("modificadopor", user.id);
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
            if (formData[field]) {
                formDataToSend.append(field, formData[field]);
                uploadedFilesCount++;
            } else if (existingFiles[field]) {
                formDataToSend.append(field, existingFiles[field]);
                uploadedFilesCount++;
            } else {
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
            // navigate(`/Actualizar_Formación/${id}`);
            navigate("/dashboard")
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            Swal.fire("Error", "Hubo un problema al guardar los datos", "error");
        }
    };


    const renderFileField = (fieldName, label) => {
        const existingFile = existingFiles[fieldName];
        const newFile = formData[fieldName];

        const getDisplayName = (filePath) => {
            if (!filePath) return "";
            return filePath.split("/").pop().split("-").slice(3).join("-");
        };


        return (
            <Grid item xs={12} size={6}>
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
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                </Button>

                {(existingFile || newFile) && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mr: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: color.primary.azul
                                }
                            }}
                            onClick={() => handlePreview(existingFile || newFile, fieldName)}
                        >
                            {existingFile ? getDisplayName(existingFile) : newFile.name}
                        </Typography>

                        <IconButton
                            onClick={() => handlePreview(existingFile || newFile, fieldName)}

                            size="small"
                            sx={{ ml: 'auto', color: color.primary.azul }}
                        >
                            <VisibilityIcon />
                        </IconButton>

                        <IconButton
                            onClick={() => handleDownload(existingFile)}
                            sx={{ color: color.primary.azul }}
                            size="small"
                        >
                            <DownloadIcon />
                        </IconButton>

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

    /*  const handlePreview = async (file, fieldName) => {
         setCurrentPreviewField(fieldName);
         try {
             if (file instanceof File) {
                 // Procesamiento para archivos nuevos (sin cambios)
                 if (file.type === "application/pdf") {
                     const fileUrl = URL.createObjectURL(file);
                     setPreviewContent({
                         type: 'pdf',
                         url: fileUrl
                     });
                 } else if (file.type.includes("image/")) {
                     const reader = new FileReader();
                     reader.onload = (e) => {
                         setPreviewContent({
                             type: 'image',
                             url: e.target.result
                         });
                     };
                     reader.readAsDataURL(file);
                 } else {
                     setPreviewContent({
                         type: 'other',
                         name: file.name
                     });
                 }
             } else {
                 // Procesamiento para archivos existentes (corregido)
                 let fileUrl;
 
                 // Primero decodifica el URI para manejar caracteres especiales
                 const decodedFileName = decodeURIComponent(file);
 
                 // Elimina espacios adicionales y caracteres problemáticos
                 const cleanedFileName = decodedFileName.trim();
 
                 // Verifica si la URL ya es completa (empieza con http)
                 if (cleanedFileName.startsWith('http')) {
                     fileUrl = cleanedFileName;
                 } else {
                     // Construye la URL correctamente
                     fileUrl = `${process.env.REACT_APP_API_URL}/preview/${encodeURIComponent(cleanedFileName)}`
                 }
 
                 // Determina el tipo de archivo
                 if (cleanedFileName.toLowerCase().endsWith('.pdf')) {
                     setPreviewContent({
                         type: 'pdf',
                         url: fileUrl
                     });
                 } else if (cleanedFileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
                     setPreviewContent({
                         type: 'image',
                         url: fileUrl
                     });
                 } else {
                     setPreviewContent({
                         type: 'other',
                         name: cleanedFileName.split('/').pop() || cleanedFileName
                     });
                 }
             }
             setPreviewOpen(true);
         } catch (error) {
             console.error("Error al generar vista previa:", error);
             Swal.fire("Error", "No se pudo generar la vista previa", "error");
         }
     }; */


    const handlePreview = async (file, fieldName) => {
        setCurrentPreviewField(fieldName);

        try {
            if (file instanceof File) {
                // 1. Procesamiento para archivos nuevos (sin cambios)
                if (file.type === "application/pdf") {
                    const fileUrl = URL.createObjectURL(file);
                    setPreviewContent({
                        type: 'pdf',
                        url: fileUrl
                    });
                } else if (file.type.includes("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviewContent({
                            type: 'image',
                            url: e.target.result
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    setPreviewContent({
                        type: 'other',
                        name: file.name
                    });
                }
            } else {
                // 2. Procesamiento para archivos existentes en Firebase Storage
                let fileUrl;
                const decodedFileName = decodeURIComponent(file);
                const cleanedFileName = decodedFileName.trim();


                fileUrl = `${process.env.REACT_APP_API_URL}/preview/${encodeURIComponent(cleanedFileName)}`;

                console.log(cleanedFileName);

                // Determinar el tipo de contenido
                const fileExtension = cleanedFileName.split('.').pop().toLowerCase();

                if (fileExtension === 'pdf') {
                    setPreviewContent({
                        type: 'pdf',
                        url: fileUrl
                    });
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    setPreviewContent({
                        type: 'image',
                        url: fileUrl
                    });
                } else {
                    setPreviewContent({
                        type: 'other',
                        name: cleanedFileName.split('/').pop() || cleanedFileName,
                        url: fileUrl // Incluimos la URL para descarga
                    });
                }
            }

            setPreviewOpen(true);
        } catch (error) {
            console.error("Error al generar vista previa:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo generar la vista previa",
                icon: "error",
                confirmButtonColor: color.primary.azul
            });
        }
    };


    return (
        <Dashboard>
            <Paper sx={{ padding: 3, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" sx={{ color: color.primary.azul }}>
                        Actualizar Lineamientos de Formación
                    </Typography>

                    <Box
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
                    </Box>
                </Box>

                <Grid container spacing={5} mt={2}>
                    <Grid item xs={12} size={6}>
                        <Typography variant="subtitle1"> Nombre de la Formación</Typography>
                        <TextField
                            fullWidth
                            name="accionformacion"
                            value={formData.accionformacion}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} size={6}></Grid>

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

                {/* Modal de vista previa 
                <Dialog
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Vista previa del documento
                        <IconButton
                            onClick={() => setPreviewOpen(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {previewContent?.type === 'pdf' && (
                            <iframe
                                src={previewContent.url}
                                width="100%"
                                height="500px"
                                style={{ border: 'none' }}
                                title="Vista previa PDF"
                            />
                        )}
                        {previewContent?.type === 'image' && (
                            <img
                                src={previewContent.url}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', margin: '0 auto' }}
                            />
                        )}
                        {previewContent?.type === 'other' && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '200px',
                                textAlign: 'center'
                            }}>
                                <DescriptionIcon sx={{ fontSize: 60, color: color.primary.azul }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {previewContent.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    No hay vista previa disponible para este tipo de archivo
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, backgroundColor: color.primary.azul }}
                                    onClick={() => handleDownload(
                                        existingFiles[currentPreviewField] ||
                                        (formData[currentPreviewField] instanceof File ?
                                            formData[currentPreviewField].name :
                                            formData[currentPreviewField])
                                    )}
                                >
                                    Descargar archivo
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>*/}
                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        Vista previa - {currentPreviewField}
                        <IconButton onClick={() => setPreviewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {previewContent?.type === 'pdf' && (
                            <iframe
                                src={previewContent.url}
                                width="100%"
                                height="500px"
                                style={{ border: 'none' }}
                                title="Vista previa PDF"
                            />
                        )}

                        {previewContent?.type === 'image' && (
                            <img
                                src={previewContent.url}
                                alt="Vista previa"
                                style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', margin: '0 auto' }}
                            />
                        )}

                        {previewContent?.type === 'other' && (
                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {previewContent.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                    onClick={() => window.open(previewContent.url, '_blank')}
                                >
                                    Descargar archivo
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Paper>
        </Dashboard>
    );
};

export default ModificarLineamientos;
