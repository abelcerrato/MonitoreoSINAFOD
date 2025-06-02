import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import Dashboard from "../Dashboard/dashboard";
import PropTypes from "prop-types";
import { color } from "../Components/color";
import { FaRegFileExcel } from "react-icons/fa";
import LogoCONED from "../Components/img/logos_CONED.png";
import LogoDGDP from "../Components/img/Logo_DGDP.png";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Box,
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
  Select,
  MenuItem,
  FormControl,
  TextField,
  Grid,
  InputLabel,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { DataGrid } from "@mui/x-data-grid";

const toBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const ListadoActividad = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [niveles, setNiveles] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  useEffect(() => {
    // Obtener los datos de los participantes después de guardar
    axios
      .get(`${process.env.REACT_APP_API_URL}/investigacion`)
      .then((response) => {
        setRows(response.data);
        setFilteredRows(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`)
      .then((response) => setNiveles(response.data));
    axios
      .get(`${process.env.REACT_APP_API_URL}/ciclosAcademicos`)
      .then((response) => setCiclos(response.data));
  }, []);

  useEffect(() => {
    if (!filterColumn || (!filterValue && !fechaInicio && !fechaFinal)) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => {
        if (filterColumn === "fecha") {
          const fechaInicioRow = row.fechainicio
            ? new Date(row.fechainicio).toISOString().split("T")[0]
            : null;
          const fechaFinalRow = row.fechafinal
            ? new Date(row.fechafinal).toISOString().split("T")[0]
            : null;

          const fechaInicioInput = fechaInicio ? new Date(fechaInicio) : null;
          const fechaFinalInput = fechaFinal ? new Date(fechaFinal) : null;

          if (
            !fechaInicioInput ||
            !fechaFinalInput ||
            !fechaInicioRow ||
            !fechaFinalRow
          ) {
            return false;
          }

          const fechaInicioRowDate = new Date(fechaInicioRow);
          const fechaFinalRowDate = new Date(fechaFinalRow);

          const isInRange =
            fechaInicioRowDate >= fechaInicioInput &&
            fechaFinalRowDate <= fechaFinalInput;

          return isInRange;
        } else {
          console.log(
            " Filtrando por:",
            filterColumn,
            "con valor:",
            filterValue
          );
          console.log(" Valor en la fila:", row[filterColumn]);

          return row[filterColumn]
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toString().toLowerCase());
        }
      });

      console.log(" Filas filtradas:", filtered);
      setFilteredRows(filtered);
    }
  }, [filterColumn, filterValue, fechaInicio, fechaFinal, rows]);

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Investigaciones");
      // Convertir imágenes a base64 (si es necesario)
      const image1Base64 = await toBase64(LogoCONED);
      const image2Base64 = await toBase64(LogoDGDP);

      // Agregar imágenes
      const image1 = workbook.addImage({
        base64: image1Base64,
        extension: "png",
      });
      const image2 = workbook.addImage({
        base64: image2Base64,
        extension: "png",
      });

      // Insertar las imágenes en el archivo Excel
      worksheet.addImage(image1, "A1:B7");
      worksheet.addImage(image2, "E1:G5");

      // Definir el título
      worksheet.mergeCells("A8:F8");
      const title = worksheet.getCell("A8");
      title.value = "Listado de Investigaciones";
      title.font = { size: 16, bold: true };
      title.alignment = { horizontal: "center", vertical: "middle" };

      // Agregar fecha y hora
      const fechaHoraActual = dayjs().format("DD/MM/YYYY  hh:mm A");
      worksheet.mergeCells("A9:E9");
      const title2 = worksheet.getCell("A9");
      title2.value = ` Fecha y hora de generación: ${fechaHoraActual}`;
      title2.font = { size: 10, italic: true };
      title2.alignment = { horizontal: "left", vertical: "middle" };

      // Espacio en blanco entre regionales
      worksheet.addRow([]);
      // Definir encabezados de la tabla
      const headers = [
        "ID",
        "Título de la Investigación",
        "¿La Investigación Es Interna o Externa?",
        "Nombre de la Institución Asociada",
        "Se Tiene Convenio la Institución Asociada",
        "Presupuesto",
        "tipomoneda",
        "Duración",
        "Población Objetivo",
        "Nicel Educativo",
        "Fecha Inicio",
        "Fecha de Finalización",
        "Ubicación",
        "¿Se realizó convocatoria?",
        "Observación",
      ];

      const colorPrimarioAzul = color.primary.azul;
      // Agregar encabezados a la primera fila
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: "FFFFFF" } }; // Texto en blanco

      // Aplicar color de fondo al encabezado
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colorPrimarioAzul.replace("#", "") }, // Azul oscuro
        };
        cell.alignment = { horizontal: "center", vertical: "middle" }; // Centrar texto
      });

      // Agregar los datos como filas en la tabla
      filteredRows.forEach((item) => {
        worksheet.addRow([
          item.id,
          item.investigacion,
          item.tipoactividad ?? "-",
          item.institucionconvenio ?? "-",
          item.existeconvenio ?? "-",
          item.presupuesto ?? "-",
          item.tipomoneda ?? "-",
          item.duracion
            ? `${item.duracion?.days ?? 0} Días ${
                item.duracion?.mons ?? 0
              } Meses ${item.duracion?.years ?? 0} Años`
            : "0 Días 0 Meses 0Años",
          item.funciondirigido ?? "-",
          item.nivelacademico ?? "-",
          item.fechainicio
            ? new Date(item.fechainicio).toLocaleDateString("es-ES")
            : "-",
          item.fechafinal
            ? new Date(item.fechafinal).toLocaleDateString("es-ES")
            : "-",
          item.direccion ?? "-",

          item.socializaron,
          item.observacion ?? "-",
        ]);
      });

      // Ajustar ancho de columnas
      worksheet.columns.forEach((column, index) => {
        column.width = index === 0 ? 5 : 15; // Si es la primera columna (index 0), ancho 5, el resto 20
        column.alignment = { wrapText: true, vertical: "middle" };
      });

      // Generar y descargar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reporte_Acciones Formativas.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "investigacion",
      headerName: "Título de la Investigación",
      width: 200,
    },
    {
      field: "tipoactividad",
      headerName: "¿La Investigación Es Interna o Externa?",
      width: 200,
    },
    {
      field: "institucionconvenio",
      headerName: "Nombre de la Institución Asociada",
      width: 200,
    },
    {
      field: "existeconvenio",
      headerName: "Se Tiene Convenio la Institución Asociada",
      width: 200,
    },
    {
      field: "presupuesto",
      headerName: "Presupuesto",
      width: 200,
    },
    {
      field: "tipomoneda",
      headerName: "Tipo Moneda del Presupuesto",
      width: 200,
    },
    {
      field: "duracion",
      headerName: "Duración",
      width: 200,
      renderCell: ({ row }) => {
        const { duracion } = row || {};
        const days = duracion?.days ?? 0;
        const mons = duracion?.mons ?? 0;
        const years = duracion?.years ?? 0;

        return `${days} Días ${mons} Meses ${years} Años`;
      },
    },
    {
      field: "funciondirigido",
      headerName: "Población Objetivo",
      width: 180,
    },

    { field: "nivelacademico", headerName: "Nivel Educativo", width: 180 },
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
      field: "direccion",
      headerName: "Ubicación",
      width: 290,
    },
    {
      field: "socializaron",
      headerName: "¿Se realizó convocatoria?",
      width: 150,
    },
    { field: "observacion", headerName: "Observación", width: 150 },
  ];

  return (
    <Dashboard>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h3" sx={{ color: color.primary.azul, mb: 5 }}>
          Listado de Investigaciones
        </Typography>

        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={12} size={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Columna</InputLabel>
              <Select
                label="Columna"
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                <MenuItem value="">Seleccionar columna</MenuItem>
                <MenuItem value="formacion">
                  Título de la Investigación
                </MenuItem>
                <MenuItem value="tipoactividad">
                  ¿La Investigación Es Interna o Externa?
                </MenuItem>
                <MenuItem value="institucionconvenio">
                  Nombre de la Institución Asociada
                </MenuItem>
                <MenuItem value="existeconvenio">
                  Se Tiene Convenio la Institución Asociada
                </MenuItem>
                <MenuItem value="presupuesto">Presupuesto</MenuItem>
                <MenuItem value="tipomoneda">Tipo Moneda</MenuItem>
                <MenuItem value="duracion">Duración</MenuItem>
                <MenuItem value="funciondirigido">Población Objetivo</MenuItem>
                <MenuItem value="nivelacademico">Nivel Educativo</MenuItem>
                <MenuItem value="cicloacademico">Ciclo Educativo</MenuItem>
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="zona">Zona</MenuItem>
                <MenuItem value="socializaron">
                  ¿Se realizó convocatoria?
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} size={4}>
            {filterColumn === "tipoactividad" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Interna">Interna</MenuItem>
                  <MenuItem value="Externa">Externa</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "tipomoneda" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Lempira">Lempiras</MenuItem>
                  <MenuItem value="Dolar">Dolar</MenuItem>
                  <MenuItem value="Euro">Euro</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "nivelacademico" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar un nivel</MenuItem>
                  {niveles.map((niv) => (
                    <MenuItem key={niv.id} value={niv.nombre}>
                      {niv.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "cicloacademico" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar un ciclo</MenuItem>
                  {ciclos.map((cil) => (
                    <MenuItem key={cil.id} value={cil.nombre}>
                      {cil.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "fecha" ? (
              <Grid container spacing={4}>
                <Grid item xs={12} size={5}>
                  <FormControl fullWidth>
                    <TextField
                      type="date"
                      label="Fecha inicio"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} size={5}>
                  <FormControl fullWidth>
                    <TextField
                      type="date"
                      label="Fecha final"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFechaFinal(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            ) : (
              <TextField
                type="text"
                placeholder="Ingresar valor"
                onChange={(e) => setFilterValue(e.target.value)}
              />
            )}
          </Grid>
          <Grid item xs={12} size={4} container justifyContent="flex-end">
            <Tooltip title="Exportar Excel">
              <IconButton
                onClick={() => exportExcel(rows)}
                aria-label="exportar Excel"
                sx={{ fontSize: 30, color: color.primary.azul }}
              >
                <FaRegFileExcel />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setRowsPerPage(pageSize);
          }}
          autoHeight
        />
      </Paper>
    </Dashboard>
  );
};

export default ListadoActividad;
