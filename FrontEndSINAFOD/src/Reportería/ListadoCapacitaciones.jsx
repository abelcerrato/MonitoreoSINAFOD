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
  const [filterHoras, setFilterHoras] = useState("");
  const [filterMinutos, setFilterMinutos] = useState("");

  useEffect(() => {
    // Obtener los datos de los participantes después de guardar
    axios
      .get(`${process.env.REACT_APP_API_URL}/formacion`)
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
    const sinFiltros =
      !filterColumn ||
      (filterColumn === "fecha" && (!fechaInicio || !fechaFinal)) ||
      (filterColumn === "duracion" && !filterHoras && !filterMinutos) ||
      (filterColumn !== "fecha" && filterColumn !== "duracion" && !filterValue);

    if (sinFiltros) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => {
        if (filterColumn === "fecha") {
          // lógica de fecha
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

          return (
            fechaInicioRowDate >= fechaInicioInput &&
            fechaFinalRowDate <= fechaFinalInput
          );
        } else if (filterColumn === "duracion") {
          const duracionObj = row.duracion || {};
          const horas = parseInt(duracionObj.hours) || 0;
          const minutos = parseInt(duracionObj.minutes) || 0;

          const matchHoras = !filterHoras || horas === parseInt(filterHoras);
          const matchMinutos =
            !filterMinutos || minutos === parseInt(filterMinutos);
          return matchHoras && matchMinutos;
        } else {
          return row[filterColumn]
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toString().toLowerCase());
        }
      });

      setFilteredRows(filtered);
    }
  }, [
    filterColumn,
    filterValue,
    fechaInicio,
    fechaFinal,
    filterHoras,
    filterMinutos,
    rows,
  ]);

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Acciones Formativas");
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
      title.value = "Listado de Acciones Formativas";
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
        "Nombre de la Acción o Formación",
        "Estado",
        "¿La Formación Es Interna o Externa?",
        "Nombre de la Institución Asociada",
        "Se Tiene Convenio la Institución Asociada",
        "Institución Responsable",
        "Responsable de Firmas",
        "Ámbito de Formación",
        "Tipo de Formación",
        "Modalidad",
        "Plataforma en la que se Realizará la Actividad",
        "Duración",
        "Cargo a la que va dirigido",
        "Nicel Educativo",
        "Ciclo Académico",
        "Fecha Inicio",
        "Fecha de Finalización",
        "Cantidad de Participantes Programados",
        "Espacio Físico",
        "Dirección",
        "Zona",
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
          item.formacion,
          item.estado ?? "-",
          item.tipoactividad ?? "-",
          item.institucionconvenio ?? "-",
          item.existeconvenio ?? "-",
          item.institucionresponsable ?? "-",
          item.responsablefirmas ?? "-",
          item.ambitoformacion ?? "-",
          item.tipoformacion,
          item.modalidad ?? "-",
          item.plataforma ?? "-",
          item.duracion
            ? `${item.duracion?.hours ?? 0}h ${item.duracion?.minutes ?? 0}m`
            : "0h 0m",
          item.funciondirigido,
          item.nivelacademico ?? "-",
          item.cicloacademico ?? "-",
          item.fechainicio
            ? new Date(item.fechainicio).toLocaleDateString("es-ES")
            : "-",
          item.fechafinal
            ? new Date(item.fechafinal).toLocaleDateString("es-ES")
            : "-",
          item.participantesprog ?? "-",
          item.espaciofisico ?? "-",
          item.direccion ?? "-",
          item.zona ?? "-",
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
      field: "formacion",
      headerName: "Nombre de la Acción Formativa",
      width: 200,
    },
    { field: "estado", headerName: "Estado", width: 150 },
    {
      field: "tipoactividad",
      headerName: "¿La Formación Es Interna o Externa?",
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
      field: "institucionresponsable",
      headerName: "Institución Responsable",
      width: 200,
    },
    {
      field: "responsablefirmas",
      headerName: "Responsable de Firmas",
      width: 200,
    },
    { field: "ambitoformacion", headerName: "Ámbito de Formación", width: 180 },

    { field: "tipoformacion", headerName: "Tipo de Formación", width: 180 },
    { field: "modalidad", headerName: "Modalidad", width: 180 },
    {
      field: "plataforma",
      headerName: " Plataforma en la que se Realizará la Actividad",
      width: 180,
    },
    {
      field: "duracion",
      headerName: "Duración",
      width: 200,
      renderCell: (params) => {
        const duracion = params.row.duracion;

        return `${duracion.hours ?? 0}h ${duracion.minutes ?? 0}m`;
      },
    },
    {
      field: "funciondirigido",
      headerName: "  Cargo a la que va dirigido",
      width: 180,
    },

    { field: "nivelacademico", headerName: "Nivel Educativo", width: 180 },
    { field: "cicloacademico", headerName: "Ciclo Académico", width: 150 },
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
      field: "participantesprog",
      headerName: "Cantidad de Participantes Programados",
      width: 290,
    },
    { field: "espaciofisico", headerName: "Espacio Físico", width: 180 },

    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "zona", headerName: "Zona", width: 200 },
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
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: color.primary.azul, mb: 5 }}
        >
          Listado de Acciones Formativas
        </Typography>

        <Grid container spacing={2} marginBottom={3}>
          <Grid item size={{ xs: 3, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Columna</InputLabel>
              <Select
                label="Columna"
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                <MenuItem value="">Seleccionar columna</MenuItem>
                <MenuItem value="formacion">
                  Nombre de la Acción Formativa
                </MenuItem>
                <MenuItem value="tipoactividad">
                  ¿La Formación Es Interna o Externa?
                </MenuItem>
                <MenuItem value="institucionconvenio">
                  Nombre de la Institución Asociada
                </MenuItem>
                <MenuItem value="existeconvenio">
                  Se Tiene Convenio la Institución Asociada
                </MenuItem>
                <MenuItem value="institucionresponsable">
                  Institución Responsable
                </MenuItem>
                <MenuItem value="responsablefirmas">
                  Responsable de Firmas
                </MenuItem>
                <MenuItem value="ambitoformacion">Ámbito de Formación</MenuItem>
                <MenuItem value="tipoformacion">Tipo de Formación</MenuItem>
                <MenuItem value="modalidad">Modalidad</MenuItem>
                <MenuItem value="plataforma">
                  Plataforma en la que se Realizará la Actividad
                </MenuItem>
                <MenuItem value="duracion">Duración</MenuItem>
                <MenuItem value="funciondirigido">
                  Cargo a la que va dirigido
                </MenuItem>
                <MenuItem value="nivelacademico">Nivel Educativo</MenuItem>
                <MenuItem value="cicloacademico">Ciclo Educativo</MenuItem>
                <MenuItem value="estado">Estado</MenuItem>
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="participantesprog">
                  Cantidad de Participantes Programados
                </MenuItem>
                <MenuItem value="espaciofisico">Espacio Físico</MenuItem>
                <MenuItem value="direccion">Dirección</MenuItem>
                <MenuItem value="zona">Zona</MenuItem>
                <MenuItem value="socializaron">
                  ¿Se realizó convocatoria?
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 6, md: 6 }}>
            {filterColumn === "tipoformacion" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Taller">Taller</MenuItem>
                  <MenuItem value="Seminario">Seminario</MenuItem>
                  <MenuItem value="Curso">Curso</MenuItem>
                  <MenuItem value="Diplomado">Diplomado</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "modalidad" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Híbrido">Híbrido</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "tipoactividad" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Interna">Interna</MenuItem>
                  <MenuItem value="Externa">Externa</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "estado" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Planificada">Planificada</MenuItem>
                  <MenuItem value="En Curso">En Curso</MenuItem>
                  <MenuItem value="Suspendida">Suspendida</MenuItem>
                  <MenuItem value="Completada">Completada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
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
            ) : filterColumn === "zona" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar zona</MenuItem>
                  <MenuItem value="Rural">Rural</MenuItem>
                  <MenuItem value="Urbana">Urbana</MenuItem>
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
            ) : filterColumn === "duracion" ? (
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <TextField
                    type="number"
                    label="Horas"
                    placeholder="Horas"
                    onChange={(e) => setFilterHoras(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField
                    type="number"
                    label="Minutos"
                    placeholder="Minutos"
                    onChange={(e) => setFilterMinutos(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ) : filterColumn === "socializaron" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="Sí">Sí</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <TextField
                  type="text"
                  placeholder="Ingresar valor"
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </FormControl>
            )}
          </Grid>
          <Grid
            item
            size={{ xs: 3, md: 3 }}
            container
            justifyContent="flex-end"
          >
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
