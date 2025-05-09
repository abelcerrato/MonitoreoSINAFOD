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
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Tab,
    Tabs,
    FormHelperText
} from "@mui/material";

import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";

import Swal from 'sweetalert2';




const Usuario = () => {
    const { user } = useUser();
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        correo: "",
        idrol: "",
        estado: "Nuevo",
        creadopor: user.id,
    });



    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/Seguridad/Usuarios");
    };



    // Manejar cambios en campos de texto y selects
    const handleChange = (event) => {
        const { name, value } = event.target;
        const sanitizedValue = value === null ? '' : value;

        setFormData(prevData => ({
            ...prevData,
            [name]: sanitizedValue
        }));
    };

    useEffect(() => {
        const obtenerRoles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/roles`);
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener los roles", error);
            }
        };
        obtenerRoles();
    }, []);

    const handleSave = async () => {

        try {



            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/insertarUsuarios`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            // Mostrar mensaje de éxito
            await Swal.fire(
                '¡Guardado!',
                'El usuario ha sido registrado correctamente.',
                'success'
            );


            console.log("Datos que envio", formData);


        } catch (error) {
            console.error("Error al guardar los datos", error);
            Swal.fire('Error!', 'Error al guardar datos', 'error');
        }
    };


    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h4" sx={{ color: color.primary.azul }}>
                            Registro de Usuarios
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
                                onClick={() => handleRedirect()}
                            >
                                Cerrar
                            </Button>

                        </Box>


                    </Box>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={12} size={6}>
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} size={6}>

                            <TextField
                                label="Correo Electrónico"
                                name="correo"
                                value={formData.correo || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} size={6}>
                            <TextField
                                label="Usuario"
                                name="usuario"
                                value={formData.usuario || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} size={6}>

                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                <Select
                                    name="idrol"
                                    value={formData.idrol || ''}
                                    onChange={handleChange}
                                    label="Rol"
                                >
                                    <MenuItem value="">Seleccionar rol</MenuItem>
                                    {roles.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>
                                            {dep.rol}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

export default Usuario;
