import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import Dashboard from "../Dashboard/dashboard";
import PropTypes from "prop-types";
import { color } from "../Components/color";
import { FaRegFileExcel, FaFileCsv } from "react-icons/fa";
import dayjs from "dayjs";


import LogoCONED from "../Components/img/logos_CONED.png";
import LogoDGDP from "../Components/img/Logo_DGDP.png";
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
} from "@mui/material";
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

const ListadoParticipantes = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [grados, setGrados] = useState([]);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/participanteformacion`)
      .then((response) => {
        const dataConIds = response.data.map((item, index) => ({
          ...item,
          id: `${item.identificacion}-${item.idformacion || index}`,
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
      .get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`)
      .then((response) => setNiveles(response.data));
    axios
      .get(`${process.env.REACT_APP_API_URL}/gradosAcademicos`)
      .then((response) => setGrados(response.data));
  }, []);

  useEffect(() => {
    if (filterColumn === "municipioced" && filterValue) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/municipios/${filterValue}`)
        .then((response) => setMunicipios(response.data));
    }
  }, [filterColumn, filterValue]);

  useEffect(() => {
    if (!filterColumn || !filterValue) {
      setFilteredRows(rows);
    } else {
      setFilteredRows(
        rows.filter(
          (row) => row[filterColumn]?.toString() === filterValue.toString()
        )
      );
    }
  }, [filterColumn, filterValue, rows]);

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Participantes");
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
      title.value = "Listado de los Participantes";
      title.font = { size: 16, bold: true };

      // Agregar fecha y hora
      const fechaHoraActual = dayjs().format("DD/MM/YYYY  hh:mm A");
      worksheet.mergeCells("A9:E9");
      const title2 = worksheet.getCell("A9");
      title2.value = ` Fecha y hora de generación: ${fechaHoraActual}`;
      title2.font = { size: 10, italic: true };
      title2.alignment = { horizontal: "left", vertical: "middle" };

      const colorPrimarioAzul = color.primary.azul;

      worksheet.mergeCells("B11:R11");
      const DatosP = worksheet.getCell("B11");
      DatosP.value = "Datos Generales del Participante";

      // Aplicar los estilos directamente a la celda fusionada
      DatosP.font = {
        size: 16,
        bold: true,
        color: { argb: "FFFFFFFF" }, // Blanco (nota el formato de 8 caracteres)
      };
      DatosP.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color.primary.azul.replace("#", "FF") }, // FF para opacidad completa
      };
      DatosP.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("S11:AE11");
      const DacosCentro = worksheet.getCell("S11");
      DacosCentro.value =
        "Datos del Centro Educativo al que representa el Participante";
      DacosCentro.font = { size: 16, bold: true };
      // Aplicar los estilos directamente a la celda fusionada
      DacosCentro.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }, // Blanco (nota el formato de 8 caracteres)
      };
      DacosCentro.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color.primary.azul.replace("#", "FF") }, // FF para opacidad completa
      };
      DacosCentro.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      // Espacio en blanco entre regionales
      worksheet.addRow([]);
      // Definir encabezados de la tabla
      const headers = [
        "Nombre de la Acción Formativa",
        "Código SACE",
        "Nombre",
        "Apellido",
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

        "Centro Educativo",
        "Código SACE del Centro Educativo",
        "Nivel Académico que Atiende",
        "Grado que Atiende",
        "Cargo que Desempeña en el Centro Educativo",
        "Tipo Administración",
        "Tipo de Centro Educativo",
        "Jornada que Atiende",
        "Modalidad que Atiende",
        "Zona Centro Educativo",
        "Departamento Centro Educativo",
        "Municipio Centro Educativo",
        "Aldea Centro Educativo",
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
          item.formacion,
          item.codigosace,
          item.nombre,
          item.apellido,
          item.identificacion,
          item.genero,
          item.fechanacimiento
            ? new Date(item.fechanacimiento).toISOString().split("T")[0]
            : "",
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

          item.nombreced,
          item.codigosaceced,
          item.nivelacademico_ced ?? "-",
          item.gradoacademico_ced ?? "-",
          item.cargoced,
          item.tipoadministracion,
          item.tipocentro,
          item.jornada,
          item.modalidad,
          item.zona,
          item.departamentoced ?? "-",
          item.municipioced ?? "-",
          item.aldeaced ?? "-",
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
      a.download = "Reporte_Participantes.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const cargaParaIBERTEL = () => {
    try {
      const headers = [
        "email",
        "firstname",
        "lastname",
        "username",
        "idnumber",
        "password",
        "profile_field_ID",
        "profile_field_gender",
        "profile_field_edad",
        "phone1",
        "profile_field_cargo",
        "institution",
        "profile_field_tipoCentro",
        "profile_field_SACE",
        "department",
        "city",
        "profile_field_aldea",
        "profile_field_caserio",
        "profile_field_jornada",
        "profile_field_level",
        "profile_field_Ciclo",
        "profile_field_zona",
        "course1",
      ];

      // Iniciar contenido CSV con encabezados y BOM para UTF-8
      let csvContent = "\uFEFF" + headers.join(",") + "\n";

      // Agregar cada fila
      filteredRows.forEach((item) => {
        const row = [
          item.correo,
          item.nombre,
          item.apellido,
          `="${item.identificacion}"`, // Forzar formato texto para username
          `="${item.identificacion}"`, // Forzar formato texto para idnumber
          `="${item.identificacion}"`, // Password puede mantenerse sin formato
          `="${item.identificacion}"`, // Forzar formato texto para profile_field_ID
          item.genero,
          item.edad,
          item.telefono,
          item.cargopart,
          item.nombreced,
          item.tipocentro,
          item.codigosaceced,
          item.departamentoced,
          item.municipioced,
          item.aldeaced,
          item.caserio,
          item.jornada,
          item.nivelacademico_ced,
          item.gradoacademico_ced,
          item.zona,
          item.formacion,
        ];

        // Escapar valores con comas o saltos de línea
        const escapedRow = row.map((value) => {
          if (value === null || value === undefined) return "";
          const str = String(value);
          // Si ya tiene comillas de formato Excel, no agregar más
          if (str.startsWith('="') && str.endsWith('"')) return str;
          return str.includes(",") || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        });

        csvContent += escapedRow.join(",") + "\n";
      });

      // Descargar el archivo CSV con encoding UTF-8
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Participantes_IBERTEL.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al exportar a CSV:", error);
    }
  };

  const columns = [
    {
      field: "formacion",
      headerName: "Nombre de la Acción Formativa ",
      width: 180,
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

    { field: "nombreced", headerName: "Centro Educativo", width: 180 },
    {
      field: "codigosaceced",
      headerName: "Código SACE del Centro Educativo",
      width: 180,
    },
    {
      field: "nivelacademico_ced",
      headerName: "Nivel Académico que Atiende",
      width: 200,
    },

    {
      field: "gradoacademico_ced",
      headerName: "Grado que Atiende",
      width: 230,
    },
    {
      field: "cargoced",
      headerName: "Cargo que Desempeña en el Centro Educativo",
      width: 180,
    },
    {
      field: "tipoadministracion",
      headerName: "Tipo Administración",
      width: 180,
    },
    {
      field: "tipocentro",
      headerName: "Tipo de Centro Educativo",
      width: 180,
    },
    {
      field: "jornada",
      headerName: "Jornada que Atiende",
      width: 180,
    },
    {
      field: "modalidad",
      headerName: "Modalidad que Atiende",
      width: 180,
    },
    { field: "zona", headerName: "Zona Centro Educativo", width: 180 },
    {
      field: "departamentoced",
      headerName: "Departamento Centro Educativo",
      width: 230,
    },
    {
      field: "municipioced",
      headerName: "Municipio Centro Educativo",
      width: 200,
    },
    {
      field: "aldeaced",
      headerName: "Aldea Centro Educativo",
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
          Listado de Participantes
        </Typography>

        <Grid container spacing={2} marginBottom={3}>
          <Grid item xs={12} size={4}>
            <FormControl fullWidth>
              <Select onChange={(e) => setFilterColumn(e.target.value)}>
                <MenuItem value="">Seleccionar columna</MenuItem>
                <MenuItem value="formacion">
                  Nombre de la Accion Formativa
                </MenuItem>
                <MenuItem value="codigosace">Código SACE</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="identificacion">Identidad</MenuItem>
                <MenuItem value="genero">Género</MenuItem>
                <MenuItem value="nivelacademico">
                  Nivel Académico del Participante
                </MenuItem>
                <MenuItem value="gradoacademico">
                  Grado Académico del Participante
                </MenuItem>
                <MenuItem value="añosdeservicio">Años de Servicio</MenuItem>
                <MenuItem value="codigodered">
                  Código de Red que Pertenece
                </MenuItem>
                <MenuItem value="cargoced">Función</MenuItem>
                <MenuItem value="departamento">
                  Departamento en el que Reside
                </MenuItem>
                <MenuItem value="municipio">
                  Municipio en el que Reside
                </MenuItem>
                <MenuItem value="aldea">Aldea en el que Reside</MenuItem>
                <MenuItem value="nombreced">Centro Educativo</MenuItem>
                <MenuItem value="nivelacademico_ced">
                  Nivel Educativo que Atiende
                </MenuItem>

                <MenuItem value="gradoacademico_ced">
                  Grado que Atiende
                </MenuItem>
                <MenuItem value="tipoadministracion">
                  Tipo Administración
                </MenuItem>
                <MenuItem value="zona">Zona Centro Educativo</MenuItem>
                <MenuItem value="departamentoced">
                  Departamento Centro Educativo
                </MenuItem>
                <MenuItem value="municipioced">
                  Municipio Centro Educativo
                </MenuItem>
                <MenuItem value="aldeaced">Aldea Centro Educativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} size={4}>
            {filterColumn === "genero" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar genero</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
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
            ) : ["departamento", "departamentoced"].includes(filterColumn) ? (
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
            ) : ["municipio", "municipioced"].includes(filterColumn) ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar municipio</MenuItem>
                  {municipios.map((mun) => (
                    <MenuItem key={mun.id} value={mun.id}>
                      {mun.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "idnivelesacademicos" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar nivel</MenuItem>
                  {niveles.map((niv) => (
                    <MenuItem key={niv.id} value={niv.id}>
                      {niv.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "idgradosacademicos" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">Seleccionar grado</MenuItem>
                  {grados.map((gra) => (
                    <MenuItem key={gra.id} value={gra.id}>
                      {gra.gradoacademico}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : filterColumn === "tipoadministracion" ? (
              <FormControl fullWidth>
                <Select onChange={(e) => setFilterValue(e.target.value)}>
                  <MenuItem value="">
                    Seleccionar Tipo de Administración
                  </MenuItem>
                  <MenuItem value="Gubernamental">Gubernamental</MenuItem>
                  <MenuItem value="No Gubernamental">No Gubernamental</MenuItem>
                </Select>
              </FormControl>
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
            <Tooltip title="Exportar Participantes para IBERTEL">
              <IconButton
                onClick={() => cargaParaIBERTEL(rows)}
                aria-label="exportar CSV"
                sx={{ fontSize: 30, color: color.primary.azul }}
              >
                <FaFileCsv />
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

export default ListadoParticipantes;
