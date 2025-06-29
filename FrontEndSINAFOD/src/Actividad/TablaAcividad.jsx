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
  Dialog, DialogTitle, DialogContent,
  colors
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { color } from "../Components/color";
import CardDetalles from "./CardDetalles";
import ChecklistIcon from '@mui/icons-material/Checklist';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import { QRCodeCanvas } from 'qrcode.react';
import { useUser } from "../Components/UserContext";

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
  const [qrUrl, setQrUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };




  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/investC`) // Cambia esta URL a la de tu API
      .then((response) => {
        setRows(response.data); // Suponiendo que los datos se encuentran en response.data
        //setIsSaved(false); 
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos:", error);
      });
  }, [isSaved]);

  const checkLineamientos = async (id) => {
    const selectedRow = rows.find(row => row.id === id);

    if (selectedRow &&
      (selectedRow.estado_lineamientos === "No Lleno Lineamientos")) {

      await Swal.fire({
        title: '¡Advertencia!',
        html: `Esta <b>${selectedRow.formacioninvest}</b> <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: color.primary.azul,
      });
    } else if (selectedRow &&
      (selectedRow.estado_lineamientos === "Lineamientos Incompletos")) {
      await Swal.fire({
        title: '¡Advertencia!',
        html: `Esta <b>${selectedRow.formacioninvest}</b> tiene sus <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: color.primary.azul,
      });
    }
  };

  const handleInvestigación = async (id) => {
    await checkLineamientos(id);
    navigate(`/Actualizar_Investigación/${id}`);
  };

  const handleLineamientosInvestigacion = async (id) => {
    await checkLineamientos(id);
    navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`);
  };

  const handleFormacion = async (id) => {
    await checkLineamientos(id);
    navigate(`/Actualizar_Formación/${id}`);
  };

  const handleLineamientosFormacion = async (id) => {
    await checkLineamientos(id);
    navigate(`/Actualizar_Lineamientos_De_Formación/${id}`);
  };

  const handleOpenQrModal = (id) => {
    const qrLink = `${process.env.REACT_APP_DOMINIO}/Formulario-De-Participante/${id}`;
    setQrUrl(qrLink);
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find(p => p.idobjeto === idobjeto);
    return permiso?.actualizar === true;
  };

  const columns = [
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => {
        const row = params.row;
        return (
          <>
            {row.formacioninvest === "Investigación" ? (
              
              <>
              {tienePermiso(1) && ( <>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleInvestigación(row.id)} color="action">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                  
                <Tooltip title="Actualizar Lineamientos">
                  <IconButton onClick={() => handleLineamientosInvestigacion(row.id)} color="success">
                    <ChecklistIcon />
                  </IconButton>
                </Tooltip>
                 
              </> 
             )}
         

              </>
            ) : (
              <>
                {tienePermiso(2) && (
                  <>
                   <Tooltip title="Editar">
                  <IconButton onClick={() => handleFormacion(row.id)} color="action">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                  
                <Tooltip title="Actualizar Lineamientos">
                  <IconButton onClick={() => handleLineamientosFormacion(row.id)} color="success">
                    <ChecklistIcon />
                  </IconButton>
                </Tooltip>
                   </>
              )}  
                  <Tooltip title="Generar QR para participantes">
              <IconButton sx={{ color: color.primary.azul }} onClick={() => handleOpenQrModal(row.id)}>
                <QrCodeScannerOutlinedIcon />
              </IconButton>
            </Tooltip>
              </>
            )}
          

            <Tooltip title="Ver Detalles">
              <IconButton onClick={() => handleOpen(row.id)} color="info">
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "accionformacion", headerName: "Nombre de la Acción o Formación", width: 230 },
    { field: "formacioninvest", headerName: "Formación o Investigación", width: 200 },
    { field: "modalidad", headerName: "Modalidad", width: 150 },
    { field: "estado", headerName: "Estado", width: 120 },
    {
      field: "fechainicio",
      headerName: "Fecha Inicio",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return date.toLocaleDateString('es-ES');
      },
    },
    {
      field: "fechafinal",
      headerName: "Fecha de Finalización",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return date.toLocaleDateString('es-ES');
      },
    },

    {
      field: "estado_lineamientos",
      headerName: "Lineamientos",
      width: 260,
    },
  ];

  return (
    <Paper >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        autoHeight

      />

      <CardDetalles open={open} handleClose={() => setOpen(false)} id={selectedId} />
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Escanea este QR</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {qrUrl && (
            <>
              <QRCodeCanvas value={qrUrl} size={200} />
              <p style={{ marginTop: '10px' }}>{qrUrl}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

    </Paper>
  );
}
