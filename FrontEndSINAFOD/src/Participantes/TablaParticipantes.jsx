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
  Box,
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

export default function TablaPacticantes({
  investCap,
  isSaved,
  setIsSaved,
  formacioninvest,
}) {
 
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

      .get(
        `${process.env.REACT_APP_API_URL}/participante/${formacioninvest}/${investCap}`
      )
      .then((response) => {
        setRows(response.data); // Actualizar las filas con los nuevos datos
        setIsSaved(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, [isSaved, investCap]);

  const handleEdit = (id) => {
    navigate(`/Modificar_Participante/${id}`, {
      state: { formacioninvest: formacioninvest },
    });
  };

  return (
    <TableContainer component={Paper}>
      <Typography
        variant="h4"
        sx={{ color: color.primary.azul, textAlign: "center" }}
      >
        {formacioninvest === "formacion" ? "Participantes" : "Investigadores"}
      </Typography>

      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead sx={{ backgroundColor: color.primary.azul }}>
          <TableRow>
            <TableCell align="center" style={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>

            <TableCell align="right">Nombre</TableCell>
            <TableCell align="right">Identidad</TableCell>
            <TableCell align="right">Genero</TableCell>
            <TableCell align="right">
              Nivel Académico del Participante
            </TableCell>
            <TableCell align="right">
              Grado Académico del Participante
            </TableCell>
            <TableCell align="right">Años de Servicio</TableCell>
            <TableCell align="right">Código de Red que Pertenece</TableCell>
            <TableCell align="right">Función</TableCell>
            <TableCell align="right">Departamento en el que Reside</TableCell>
            <TableCell align="right">Municipio en el que Reside</TableCell>
            <TableCell align="right">Aldea en la que Reside</TableCell>
            {formacioninvest === "formacion" && (
              <>
                <TableCell align="right">Código SACE del Centro</TableCell>
                <TableCell align="right">Centro Educativo</TableCell>
                <TableCell align="right">Nivel Académico que Atiende</TableCell>
                <TableCell align="right">Grado que Atiende</TableCell>
                <TableCell align="right">Tipo Administración</TableCell>
                <TableCell align="right">Zona Centro Educativo</TableCell>
                <TableCell align="right">
                  Departamento Centro Educativo
                </TableCell>
                <TableCell align="right">Municipio Centro Educativo</TableCell>
                <TableCell align="right">Aldea Centro Educativo</TableCell>
              </>
            )}
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

              <TableCell align="right">{row.nombre}</TableCell>
              <TableCell align="right">{row.identificacion}</TableCell>
              <TableCell align="right">{row.genero}</TableCell>
              <TableCell align="right">{row.nivelacademico}</TableCell>
              <TableCell align="right">{row.gradoacademico}</TableCell>
              <TableCell align="right">{row.añosdeservicio}</TableCell>
              <TableCell align="right">{row.codigodered}</TableCell>
              <TableCell align="right">{row.cargopart}</TableCell>
              <TableCell align="right">{row.departamento}</TableCell>
              <TableCell align="right">{row.municipio}</TableCell>
              <TableCell align="right">{row.aldea}</TableCell>

              {formacioninvest === "formacion" && (
                <>
                  <TableCell align="right">{row.codigosace}</TableCell>
                  <TableCell align="right">{row.nombreced}</TableCell>
                  <TableCell align="right">{row.nivelacademico_ced}</TableCell>
                  <TableCell align="right">{row.gradoacademico_ced}</TableCell>
                  <TableCell align="right">{row.tipoadministracion}</TableCell>
                  <TableCell align="right">{row.zona}</TableCell>
                  <TableCell align="right">{row.departamentoced}</TableCell>
                  <TableCell align="right">{row.municipioced}</TableCell>
                  <TableCell align="right">{row.aldeaced}</TableCell>
                </>
              )}
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
              colSpan={5}
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
