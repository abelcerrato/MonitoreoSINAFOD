import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Typography,
    Paper,
    Box,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import Dashboard from "../../Dashboard/dashboard";
import { color } from "../../Components/color";
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { DataGrid } from '@mui/x-data-grid';






export default function TablaActividad(isSaved, setIsSaved) {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });


    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);


    const handleRedirect = () => {
        navigate("/dashboard");
    };


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/usuarios`) // Cambia esta URL a la de tu API
            .then((response) => {
                setRows(response.data); // Suponiendo que los datos se encuentran en response.data
                //setIsSaved(false); 
            })
            .catch((error) => {
                console.error("Hubo un error al obtener los datos:", error);
            });
    }, [isSaved]);



    const handleResetearContra = async (usuario) => {
        try {

            const response = await axios.put(`${process.env.REACT_APP_API_URL}/resetearContra/${usuario}`);

            Swal.fire({
                title: "Contraseña Restablecida",
                text: "La contraseña ha sido restablecida exitosamente a Temporal1*.",
                icon: "success",
                timer: 6000,
            });
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);

        }
    };

    const handleEditClick = async (id) => {
        navigate(`/Seguridad/Actualizar_Usuario/${id}`);
    };
    const columns = [
        {
            field: 'actions',
            headerName: 'Acción',
            renderCell: (params) => (
                <>
                    <Tooltip title="Editar" arrow>
                        <IconButton
                            onClick={() => handleEditClick(params.id)}
                            sx={{ color: color.primary.azul }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Restablecer Contraseña" arrow>
                        <IconButton
                            onClick={() => handleResetearContra(params.row.usuario)}
                            sx={{ color: color.primary.azul }}
                        >
                            <VpnKeyOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                </>

            ),
        },
        { field: "id", headerName: "ID", width: 90 },
        { field: "nombre", headerName: "Nombre ", width: 230 },
        { field: "correo", headerName: "Correo Electrónico", width: 300 },
        { field: "usuario", headerName: "Usuario", width: 150 },
        { field: "estado", headerName: "Estado", width: 120 },


    ];

    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>

                    <Typography variant="h4" sx={{ color: color.primary.azul }}>
                        Usuarios
                    </Typography>

                    <Box
                        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
                    >

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/Seguridad/Registrar_Usuario")}
                            startIcon={<AddIcon />}
                            sx={{

                                backgroundColor: color.primary.azul,
                                marginLeft: 2,
                            }}
                        >
                            Crear Usuario
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: color.primary.rojo,
                                color: color.primary.rojo,
                                marginLeft: 2,
                            }}
                            onClick={() => handleRedirect()}
                        >
                            Cerrar
                        </Button>
                    </Box>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        autoHeight

                    />


                </Paper>

            </Dashboard>
        </>
    );
}
