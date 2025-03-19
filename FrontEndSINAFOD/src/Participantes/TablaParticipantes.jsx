import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  Typography,
  Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { color } from "../Components/color";

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

export default function TablaPacticantes({ investCap, isSaved, setIsSaved }) {
  const navigate = useNavigate();
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


    // Obtener los datos de los participantes después de guardar
    axios

      .get(`${process.env.REACT_APP_API_URL}/CapacitacionInvest/${investCap}`)
      .then((response) => {
        setRows(response.data);  // Actualizar las filas con los nuevos datos
        setIsSaved(false);
        console.log("parr", response.data);

      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, [isSaved, investCap]);


  const handleEdit = (id) => {
    navigate(`/Modificar_Participante/${id}`); // Redirige a la página de edición con el ID
  };


  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" sx={{ color: color.primary.azul, textAlign: "center" }}>  Participantes </Typography>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead sx={{ backgroundColor: color.primary.azul }}>
          <TableRow>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              ID de la investigación
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Código SACE
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Nombre
            </TableCell>

            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Función
            </TableCell>

            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Identidad
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Centro Educativo
            </TableCell>

            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Zona
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Departamento
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Municipio
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
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(row.id)} color="action">
                    <EditIcon />
                  </IconButton>
                </Tooltip>

              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.idinvestigacioncap}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.codigosace}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.nombre}
              </TableCell>

              <TableCell style={{ width: 160 }} align="right">
                {row.funcion}
              </TableCell>

              <TableCell style={{ width: 160 }} align="right">
                {row.identificacion}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.centroeducativo}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.zona}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.nombredepto}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.nombremuni}
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
