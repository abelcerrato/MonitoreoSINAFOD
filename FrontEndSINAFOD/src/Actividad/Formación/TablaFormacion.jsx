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
import {
  EditOutlined as EditOutlinedIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { useUser } from "../../Components/UserContext";

export default function TablaActividad(isSaved, setIsSaved) {
  const navigate = useNavigate();
  const { permissions } = useUser();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/formacion`) // Cambia esta URL a la de tu API
      .then((response) => {
        setRows(response.data); // Suponiendo que los datos se encuentran en response.data
        //setIsSaved(false);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos:", error);
      });
  }, [isSaved]);

  const handleEditClick = async (id) => {
    navigate(`/Seguridad/Actualizar_Usuario/${id}`);
  };

  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.actualizar === true;
  };
  const tienePermisoIn = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.insertar === true;
  };

  const columns = [
    ...(tienePermiso(5)
      ? [
          {
            field: "actions",
            headerName: "Acción",
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
              </>
            ),
          },
        ]
      : []),
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre ", width: 230 },
    { field: "modalidad", headerName: "Modalidad", width: 300 },
    { field: "estado", headerName: "Estado", width: 150 },
    {
      field: "fechainicio",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES");
      },
    },
    {
      field: "fechafinal",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES");
      },
    },
    { field: "lineamientos", headerName: "Lineamientos", width: 120 },
  ];

  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: color.primary.azul }}
          >
            Usuarios
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 2,
            }}
          >
            {tienePermisoIn(5) && (
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
                Nuevo
              </Button>
            )}
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
