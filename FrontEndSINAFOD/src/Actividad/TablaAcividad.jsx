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
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleInvestigación = (id) => {
    navigate(`/Actualizar_Investigación/${id}`);
  };

  const handleLineamientosInvesticagicon = (id) => {
    navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`);
  };

  const handleFormacion = (id) => {
    navigate(`/Actualizar_Formación/${id}`);
  };

  const handleLineamientosFormacion = (id) => {
    navigate(`/Actualizar_Lineamientos_De_Formación/${id}`);
  };
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead sx={{ backgroundColor: color.primary.azul }}>
          <TableRow>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              ID
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Nombre de la Acción o Formación
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Formación o Investigación
            </TableCell>

            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Modalidad
            </TableCell>

            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Estado
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Fecha Inicio
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Fecha de Finalización
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Lineamientos
            </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell style={{ width: 160 }} align="center">
                {row.formacioninvest === "Investigación" ? (
                  <>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleInvestigación(row.id)} color="action">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Actualizar Lineamientos">
                      <IconButton onClick={() => handleLineamientosInvesticagicon(row.id)} color="success">
                        <ChecklistIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
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

                <Tooltip title="Ver Detalles">
                  <IconButton onClick={() => handleOpen(row.id)} color="info">
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip>
                <CardDetalles
                  open={open}
                  handleClose={() => setOpen(false)}
                  id={selectedId}
                />
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.id}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.accionformacion}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.formacioninvest}
              </TableCell>

              <TableCell style={{ width: 160 }} align="right">
                {row.modalidad}
              </TableCell>

              <TableCell style={{ width: 160 }} align="right">
                {row.estado}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {new Date(row.fechainicio).toISOString().split("T")[0].split("-").reverse().join("/")}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {new Date(row.fechafinal).toISOString().split("T")[0].split("-").reverse().join("/")}
              </TableCell>


              <TableCell style={{ width: 160 }} align="right">
                {row.estado_lineamientos}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={18}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "Filas por página",
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
