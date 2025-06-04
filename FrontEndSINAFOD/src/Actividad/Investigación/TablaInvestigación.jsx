import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { color } from "../../Components/color";
import CardDetalles from "../CardDetalles";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "../../Components/UserContext";
import { Add as AddIcon } from "@mui/icons-material";
import Dashboard from "../../Dashboard/dashboard";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function TablaActividad(isSaved, setIsSaved) {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const { permissions } = useUser();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/investigacion`) // Cambia esta URL a la de tu API
      .then((response) => {
        setRows(response.data); // Suponiendo que los datos se encuentran en response.data
        //setIsSaved(false);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos:", error);
      });
  }, [isSaved]);

  const checkLineamientos = async (id) => {
    const selectedRow = rows.find((row) => row.id === id);

    if (
      selectedRow &&
      selectedRow.estado_lineamientos === "No Lleno Lineamientos"
    ) {
      const result = await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>investigación</b> <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        return false; 
      }
    } else if (
      selectedRow &&
      selectedRow.estado_lineamientos === "Lineamientos Incompletos"
    ) {
      const result = await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>investigación</b> tiene sus <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (!result.isConfirmed) {
        return false; 
      }
    }

    return true; // Indica que se puede continuar
  };

  const handleinvestigacion = async (id) => {
    const puedeContinuar = await checkLineamientos(id);
    if (puedeContinuar) {
      navigate(`/Actualizar_Investigación/${id}`);
    }
  };

  const handleLineamientosinvestigacion = async (id) => {
    const puedeContinuar = await checkLineamientos(id);
    if (puedeContinuar) {
      navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`);
    }
  };
  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.actualizar === true;
  };

  const columns = [
    ...(tienePermiso(1)
      ? [
          {
            field: "actions",
            headerName: "Acción",
            width: 190,
            renderCell: (params) => (
              <>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => handleinvestigacion(params.id)}
                    color="action"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Actualizar Lineamientos">
                  <IconButton
                    onClick={() => handleLineamientosinvestigacion(params.id)}
                    color="success"
                  >
                    <ChecklistIcon />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Ver Detalles">
                  <IconButton
                    onClick={() => handleOpen(params.id)}
                    color="info"
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip> */}
              </>
            ),
          },
        ]
      : []),
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "investigacion",
      headerName: "Nombre de la Investigación",
      width: 230,
    },
    {
      field: "fechainicio",
      headerName: "Fecha Inicio",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES");
      },
    },
    {
      field: "fechafinal",
      headerName: "Fecha de Finalización",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES");
      },
    },

    {
      field: "estado_lineamientos",
      headerName: "Lineamientos",
      width: 260,
    },
  ];

  return (
    <Dashboard>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", color: color.primary.azul }}
          >
            Investigaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/Lineamientos_De_Investigación")}
            sx={{
              color: color.primary.contrastText,
              backgroundColor: color.primary.azul,
              "&:hover": {
                backgroundColor: color.dark,
              },
            }}
          >
            Nuevo
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

        <CardDetalles
          open={open}
          handleClose={() => setOpen(false)}
          id={selectedId}
        />
      </Paper>
    </Dashboard>
  );
}
