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
  Checkbox,
  FormControlLabel,
  Paper,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Margin } from "@mui/icons-material";

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

const ListadoInvestigadores = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [departamentos, setDepartamentos] = useState([]);

  const [funcion, setFuncion] = useState([]);

  useEffect(() => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/participanteInvest`)
    .then((response) => {
      const dataConIds = response.data.map((item, index) => ({
        ...item,
        id: `${item.identificacion}-${item.idinvestigacion || index}`,
      }));
      setRows(dataConIds);
      setFilteredRows(dataConIds);
      console.log("Filas con IDs únicos:", dataConIds);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}, []);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/departamentos`)
      .then((response) => setDepartamentos(response.data));
    axios
      .get(`${process.env.REACT_APP_API_URL}/cargodes`)
      .then((response) => setFuncion(response.data));
  }, []);

  const [exactMatch, setExactMatch] = useState(false);

  useEffect(() => {
    if (!filterColumn || !filterValue) {
      setFilteredRows(rows);
    } else {
      setFilteredRows(
        rows.filter((row) => {
          const rowValue = row[filterColumn]?.toString().toLowerCase();
          const searchValue = filterValue.toString().toLowerCase();
          return exactMatch
            ? rowValue === searchValue
            : rowValue?.includes(searchValue);
        })
      );
    }
  }, [filterColumn, filterValue, exactMatch, rows]);

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Investigadores");
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
      worksheet.addImage(image1, "A1:A7");
      worksheet.addImage(image2, "E1:F5");

      // Definir el título
      worksheet.mergeCells("A8:F8");
      const title = worksheet.getCell("A8");
      title.value = "Listado de los Investigadores";
      title.font = { size: 16, bold: true };

      // Agregar fecha y hora
      const fechaHoraActual = dayjs().format("DD/MM/YYYY  hh:mm A");
      worksheet.mergeCells("A9:E9");
      const title2 = worksheet.getCell("A9");
      title2.value = ` Fecha y hora de generación: ${fechaHoraActual}`;
      title2.font = { size: 10, italic: true };
      title2.alignment = { horizontal: "left", vertical: "middle" };

      const colorPrimarioAzul = color.primary.azul;

      // Espacio en blanco entre regionales
      worksheet.addRow([]);
      // Definir encabezados de la tabla
      const headers = [
        "Nombre de la Investigación",
        "Código SACE",
        "Nombre",
        "Identificación",
        "Género",
        "Fecha de Nacimiento",
        "Edad",
        "Correo Electrónico",
        "Teléfono",
        "Nivel Académico del Participante",
        "Grado Académico del Participante",
        "Cargo que Desempeña",
        "Años de Servicio",
        "Código de Red",
        "Departamento en el que Reside",
        "Municipio en el que Reside",
        "Aldea en la que Reside",
        "Caserio",
      ];

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
          item.investigacion,
          item.codigosace ?? "-",
          item.nombre,
          item.identificacion,
          item.genero,
          item.fechanacimiento,
          item.edad,
          item.correo,
          item.telefono,
          item.nivelacademico ?? "-",
          item.gradoacademico ?? "-",
          item.cargopart,
          item.añosdeservicio,
          item.codigodered,
          item.departamento,
          item.municipio,
          item.aldea,
          item.caserio,
        ]);
      });

      // Ajustar ancho de columnas
      worksheet.columns.forEach((column, index) => {
        column.width = index === 0 ? 25 : 15;
      });

      // Generar y descargar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reporte_Investigadores.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const columns = [

    {
      field: "investigacion",
      headerName: "Nombre de la Investigación ",
      width: 280,
    },
    { field: "codigosace", headerName: "Código SACE", width: 180 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "identificacion", headerName: "Identidad", width: 180 },
    { field: "genero", headerName: "Género", width: 180 },
    { field: "fechanacimiento", headerName: "Fecha de Nacimiento", width: 180 },
    { field: "edad", headerName: "Edad", width: 180 },
    { field: "correo", headerName: "Correo Electrónico", width: 180 },
    { field: "telefono", headerName: "Teléfono", width: 180 },
    {
      field: "nivelacademico",
      headerName: "Nivel Académico del Participante",
      width: 230,
    },
    {
      field: "gradoacademico",
      headerName: "Grado Académico del Participante",
      width: 230,
    },
    { field: "cargopart", headerName: "Cargo que Desempeña", width: 180 },
    { field: "añosdeservicio", headerName: "Años de Servicio", width: 180 },
    {
      field: "codigodered",
      headerName: "Código de Red que Pertenece",
      width: 230,
    },
    {
      field: "departamento",
      headerName: "Departamento en el que Reside",
      width: 230,
    },
    {
      field: "municipio",
      headerName: "Municipio en el que Reside",
      width: 230,
    },
    {
      field: "aldea",
      headerName: "Aldea en la que Reside",
      width: 180,
    },
    {
      field: "caserio",
      headerName: "Caserio",
      width: 180,
    },
  ];

  return (
    <Dashboard>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: color.primary.azul, mb: 5 }}
        >
          Listado de Investigadores
        </Typography>

        <Grid container spacing={2} marginBottom={3}>
          <Grid size={{ xs: 3, md: 3 }}>
            <FormControl fullWidth>
              <Select onChange={(e) => setFilterColumn(e.target.value)}>
                <MenuItem value="">Seleccionar columna</MenuItem>
                <MenuItem value="investigacion">
                  Nombre de la Investigación
                </MenuItem>
                <MenuItem value="codigosace">Código SACE</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="identificacion">Identidad</MenuItem>
                <MenuItem value="genero">Género</MenuItem>
                <MenuItem value="fechanacimiento">Fecha de Nacimiento</MenuItem>
                <MenuItem value="edad">Edad</MenuItem>
                <MenuItem value="telefono">Teléfono</MenuItem>
                <MenuItem value="nivelacademico">
                  Nivel Académico del Participante
                </MenuItem>
                <MenuItem value="gradoacademico">
                  Grado Académico del Participante
                </MenuItem>
                <MenuItem value="cargopart">Cargo que Desempeña</MenuItem>
                <MenuItem value="añosdeservicio">Años de Servicio</MenuItem>
                <MenuItem value="departamento">
                  Departamento en el que Reside
                </MenuItem>
                <MenuItem value="caserio">Caserio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            {filterColumn === "genero" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                 <MenuItem value="" disabled>Seleccionar género</MenuItem>
                                  <MenuItem value="Femenino">Femenino</MenuItem>
                                  <MenuItem value="Masculino">Masculino</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "departamento" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar departamento</MenuItem>
                  {departamentos.map((dep) => (
                    <MenuItem key={dep.id} value={dep.nombre}>
                      {dep.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "nivelacademico" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar nivel</MenuItem>
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Superior">Superior</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "gradoacademico" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar grado</MenuItem>
                  <MenuItem value="Técnico">Técnico</MenuItem>
                  <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                  <MenuItem value="Maestría">Maestría</MenuItem>
                  <MenuItem value="Doctorado">Doctorado</MenuItem>
                </Select>
              </FormControl>
            ) : filterColumn === "cargopart" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="" disabled>
                    Seleccione un cargo
                  </MenuItem>
                  {funcion.length > 0 ? (
                    funcion.map((dep) => (
                      <MenuItem key={dep.cargo} value={dep.cargo}>
                        {dep.cargo}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Cargando...</MenuItem>
                  )}
                </Select>
              </FormControl>
            ) : (
              <Grid display="flex" alignItems="center">
                <Grid mr={4} size={{ xs: 5, md: 5 }}>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      placeholder="Ingresar valor"
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exactMatch}
                        onChange={() => setExactMatch(!exactMatch)}
                      />
                    }
                    label="Coincidencia exacta"
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid size={{ xs: 3, md: 3 }} container justifyContent="flex-end">
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

export default ListadoInvestigadores;
