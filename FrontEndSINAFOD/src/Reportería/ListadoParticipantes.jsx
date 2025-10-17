import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import Dashboard from "../Dashboard/dashboard";
import PropTypes from "prop-types";
import { color } from "../Components/color";
import { FaRegFileExcel, FaFileCsv, FaGraduationCap } from "react-icons/fa";
import dayjs from "dayjs";


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Eliminar todos los imports de @react-pdf/renderer
// import { pdf, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

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
  Modal,
  Button,
  Card,
  CardContent,
  Slider,
  Input,
  Switch,
  FormControlLabel,
  InputLabel,
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
        // AGREGAR ESTA LÍNEA para establecer el primer participante para la vista previa
        if (dataConIds.length > 0) {
          setPreviewParticipant(dataConIds[0]);
        }
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
        "Ciclo que Atiende",
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
          item.nivelatiende ?? "-",
          item.cicloatiende ?? "-",
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
        // "profile_field_cargo",

        "institution",
        "profile_field_tipoCentr",
        "profile_field_SACE",
        "department",
        /* "city",
         "profile_field_aldea",
         "profile_field_caserio",
         "profile_field_jornada", */
        "profile_field_level",
        //"profile_field_Ciclo",
        "profile_field_zona",
        "course1",
      ];

      // Iniciar contenido CSV con encabezados y BOM para UTF-8
      let csvContent = "\uFEFF" + headers.join(";") + "\n";


      // Agregar cada fila
      filteredRows.forEach((item) => {
        const row = [
          item.correo,
          item.nombre,
          item.apellido,
          `${item.identificacion}`, // Forzar formato texto para username
          `${item.identificacion}`, // Forzar formato texto para idnumber
          `${item.identificacion}`, // Password puede mantenerse sin formato
          `${item.identificacion}`, // Forzar formato texto para profile_field_ID
          item.genero,
          item.edad,
          item.telefono,
          //item.cargopart,
          item.nombreced,
          item.tipocentro,
          item.codigosaceced,
          item.departamentoced,
          /*  item.municipioced,
           item.aldeaced,
           item.caserio,
           item.jornada, */
          item.nivelatiende,
          // item.cicloatiende,
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

        csvContent += escapedRow.join(";") + "\n";

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
    {
      field: "fechanacimiento",
      headerName: "Fecha de Nacimiento",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return ""; // si no hay fecha, mostrar vacío
        const date = new Date(params.value);
        return date.toLocaleDateString('es-ES');
      },
    },
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
      field: "nivelatiende",
      headerName: "Nivel Académico que Atiende",
      width: 200,
    },

    {
      field: "cicloatiende",
      headerName: "Ciclo que Atiende",
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


  // Estados para el modal de certificados - AGREGAR ESTOS ESTADOS
  const [modalOpen, setModalOpen] = useState(false);
  const [certificateConfig, setCertificateConfig] = useState({
    backgroundImage: null,
    institutionLogos: [],
    title: "",
    subtitle: "",
    bodyText: "",
    includeFormacionName: true,
    fechaLugarText: "",
    signatures: [],
    showBorder: true,
    borderColor: "#000000",
    // Colores individuales
    titleColor: "#000000",
    subtitleColor: "#000000",
    participantColor: "#000000",
    bodyColor: "#000000",
    fechaLugarColor: "#000000",
    signatureColor: "#000000",
    // Fuentes individuales
    titleFont: "Helvetica-Bold",
    subtitleFont: "Helvetica",
    participantFont: "Helvetica-Bold",
    bodyFont: "Helvetica",
    fechaLugarFont: "Helvetica-Oblique",
    signatureFont: "Helvetica",
    // Tamaños individuales
    titleSize: 32,
    subtitleSize: 14,
    participantSize: 18,
    bodySize: 12,
    fechaLugarSize: 10,
    signatureSize: 10,
    // Layout
    logoSize: 80,
    logoPosition: "center",
    contentMargin: 30,
    logoSpacing: 20,
    // NUEVAS PROPIEDADES MEJORADAS
    logoMaxWidth: 350,
    logoMaxHeight: 100,
    signatureMaxWidth: 120,
    signatureMaxHeight: 60,
    signatureMargin: 20,
  });


  const [previewParticipant, setPreviewParticipant] = useState(null);

  // Estilos para el modal - AGREGAR ESTO
  // Estilos para el modal - ACTUALIZAR
  // Estilos para el modal - RESPONSIVE
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95vw', md: '90vw', lg: '85vw' }, // Responsive
    height: { xs: '95vh', md: '90vh', lg: '85vh' },
    maxWidth: '1400px',
    maxHeight: '900px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: { xs: 2, md: 3 },
    borderRadius: 2,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };
  // Funciones para manejar archivos - AGREGAR ESTAS FUNCIONES
  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCertificateConfig(prev => ({
          ...prev,
          backgroundImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newLogos = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newLogos.push(e.target.result);
        if (newLogos.length === files.length) {
          setCertificateConfig(prev => ({
            ...prev,
            institutionLogos: [...prev.institutionLogos, ...newLogos]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = (index) => {
    setCertificateConfig(prev => ({
      ...prev,
      institutionLogos: prev.institutionLogos.filter((_, i) => i !== index)
    }));
  };

  // Funciones para manejar firmas - AGREGAR
  const handleSignatureUpload = (event) => {
    const files = Array.from(event.target.files);
    const newSignatures = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSignatures.push({
          image: e.target.result,
          name: "",
          position: "",
          institution: ""
        });
        if (newSignatures.length === files.length) {
          setCertificateConfig(prev => ({
            ...prev,
            signatures: [...prev.signatures, ...newSignatures]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateSignature = (index, field, value) => {
    setCertificateConfig(prev => ({
      ...prev,
      signatures: prev.signatures.map((sig, i) =>
        i === index ? { ...sig, [field]: value } : sig
      )
    }));
  };

  const removeSignature = (index) => {
    setCertificateConfig(prev => ({
      ...prev,
      signatures: prev.signatures.filter((_, i) => i !== index)
    }));
  };



  const CertificateTemplate = ({ participant, config, isPDF = false }) => {
    // Función mejorada para calcular dimensiones de logos
    const getLogoDimensions = () => {
      return {
        width: 'auto',
        height: `${config.logoSize}px`,
        maxWidth: `${config.logoMaxWidth}px`,
        maxHeight: `${config.logoMaxHeight}px`,
        objectFit: 'contain'
      };
    };

    // Función mejorada para dimensiones de firmas
    const getSignatureDimensions = () => {
      return {
        width: 'auto',
        height: `${config.signatureMaxHeight}px`,
        maxWidth: `${config.signatureMaxWidth}px`,
        objectFit: 'contain'
      };
    };

    // Estilos base
    const containerStyle = {
      width: isPDF ? '297mm' : '100%',
      height: isPDF ? '210mm' : '100%',
      background: 'white',
      backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: `${config.contentMargin}px`,
      boxSizing: 'border-box',
      border: config.showBorder ? `2px solid ${config.borderColor}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      margin: isPDF ? '0' : '0',
      fontFamily: 'Arial, sans-serif'
    };

    return (
      <div style={containerStyle}>
        {/* Logos */}
        {config.institutionLogos.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: config.logoPosition,
            alignItems: 'center',
            marginBottom: '20px',
            width: '100%',
            gap: `${config.logoSpacing}px`,
            flexWrap: 'wrap'
          }}>
            {config.institutionLogos.map((logo, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={logo}
                  alt={`Logo ${index}`}
                  style={{
                    ...getLogoDimensions(),
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Resto del contenido se mantiene igual */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 0'
        }}>
          {/* Título */}
          {config.title && (
            <div style={{
              fontSize: `${config.titleSize}px`,
              fontWeight: 'bold',
              textAlign: 'center',
              color: config.titleColor,
              marginBottom: '20px',
              fontFamily: config.titleFont,
              width: '100%',
              lineHeight: '1.2',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              padding: '0 20px'
            }}>
              {config.title}
            </div>
          )}

          {/* Subtítulo */}
          {config.subtitle && (
            <div style={{
              fontSize: `${config.subtitleSize}px`,
              textAlign: 'center',
              color: config.subtitleColor,
              marginBottom: '15px',
              fontFamily: config.subtitleFont,
              width: '100%',
              lineHeight: '1.3',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              padding: '0 20px'
            }}>
              {config.subtitle}
            </div>
          )}

          {/* Prefijo del nombre */}
          {config.participantPrefix && (
            <div style={{
              fontSize: `${config.participantSize - 2}px`,
              textAlign: 'center',
              color: config.participantColor,
              marginBottom: '8px',
              fontFamily: config.subtitleFont,
              width: '100%',
              lineHeight: '1.3',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              padding: '0 20px'
            }}>
              {config.participantPrefix}
            </div>
          )}

          {/* Nombre del participante */}
          <div style={{
            fontSize: `${config.participantSize}px`,
            fontWeight: 'bold',
            textAlign: 'center',
            color: config.participantColor,
            marginBottom: '25px',
            fontFamily: config.participantFont,
            width: '100%',
            lineHeight: '1.2',
            wordWrap: 'break-word',
            padding: '0 20px'
          }}>
            {participant.nombre} {participant.apellido}
          </div>

          {/* Cuerpo del texto */}
          {config.bodyText && (
            <div style={{
              fontSize: `${config.bodySize}px`,
              textAlign: 'center',
              color: config.bodyColor,
              lineHeight: '1.5',
              marginBottom: '25px',
              fontFamily: config.bodyFont,
              width: '100%',
              maxWidth: '90%',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              padding: '0 20px'
            }}>
              {config.bodyText}
            </div>
          )}

          {/* Fecha y lugar */}
          {config.fechaLugarText && (
            <div style={{
              fontSize: `${config.fechaLugarSize}px`,
              textAlign: 'center',
              color: config.fechaLugarColor,
              marginBottom: `${config.signatureMargin}px`,
              fontStyle: 'italic',
              fontFamily: config.fechaLugarFont,
              width: '100%',
              lineHeight: '1.3',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              padding: '0 20px'
            }}>
              {config.fechaLugarText}
            </div>
          )}
        </div>

        {/* Firmas */}
        {config.signatures.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            marginTop: 'auto',
            paddingTop: '30px',
            width: '100%',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {config.signatures.map((signature, index) => (
              <div key={index} style={{
                textAlign: 'center',
                flex: '1 1 auto',
                minWidth: '120px',
                maxWidth: `${config.signatureMaxWidth}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '8px',
                  width: '100%'
                }}>
                  <img
                    src={signature.image}
                    alt={`Firma ${index}`}
                    style={{
                      ...getSignatureDimensions(),
                      display: 'block',
                    }}
                  />
                </div>
                <div style={{
                  fontSize: `${config.signatureSize}px`,
                  color: config.signatureColor,
                  fontFamily: config.signatureFont,
                  lineHeight: '1.3',
                  width: '100%'
                }}>
                  {signature.name && <div style={{ fontWeight: 'bold' }}>{signature.name}</div>}
                  {signature.position && <div>{signature.position}</div>}
                  {signature.institution && <div style={{ fontStyle: 'italic' }}>{signature.institution}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleGenerarPDF = async () => {
    if (!filteredRows.length) {
      console.error("No hay participantes para generar PDF");
      alert("No hay participantes para generar certificados");
      return;
    }

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');

      console.log(`🔄 Generando ${filteredRows.length} certificados...`);

      for (let i = 0; i < filteredRows.length; i++) {
        const participant = filteredRows[i];
        console.log(`📝 Procesando participante ${i + 1}: ${participant.nombre} ${participant.apellido}`);

        // Crear un iframe en lugar de un div para mejor aislamiento
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-9999px';
        iframe.style.top = '0';
        iframe.style.width = '297mm';
        iframe.style.height = '210mm';
        iframe.style.border = 'none';
        iframe.style.visibility = 'visible';

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Escribir el contenido HTML directamente CON EL SISTEMA MEJORADO
        iframeDoc.open();
        iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background: white;
              font-family: Arial, sans-serif;
            }
            .certificate-container {
              width: 297mm;
              height: 210mm;
              background: white;
              ${certificateConfig.backgroundImage ? `
                background-image: url('${certificateConfig.backgroundImage}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
              ` : ''}
              padding: ${certificateConfig.contentMargin}px;
              box-sizing: border-box;
              border: ${certificateConfig.showBorder ? `2px solid ${certificateConfig.borderColor}` : 'none'};
              display: flex;
              flex-direction: column;
              position: relative;
              overflow: hidden;
            }
            
            /* CONTENEDORES MEJORADOS PARA IMÁGENES */
            .logos-container {
              display: flex;
              justify-content: ${certificateConfig.logoPosition};
              align-items: center;
              margin-bottom: 20px;
              width: 100%;
              gap: ${certificateConfig.logoSpacing}px;
              flex-wrap: wrap;
            }
            
            .logo-item {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .logo-img {
              width: auto;
              height: ${certificateConfig.logoSize}px;
              max-width: ${certificateConfig.logoMaxWidth}px;
              max-height: ${certificateConfig.logoMaxHeight}px;
              object-fit: contain;
              display: block;
              flex-shrink: 0;
            }
            
            .signature-img {
              width: auto;
              height: ${certificateConfig.signatureMaxHeight}px;
              max-width: ${certificateConfig.signatureMaxWidth}px;
              object-fit: contain;
              display: block;
            }
            
            .signature-image-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 8px;
              width: 100%;
            }
            
            .content-container {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 20px 0;
            }
            
            .title {
              font-size: ${certificateConfig.titleSize}px;
              font-weight: bold;
              text-align: center;
              color: ${certificateConfig.titleColor};
              margin-bottom: 20px;
              font-family: ${certificateConfig.titleFont};
              width: 100%;
              line-height: 1.2;
              white-space: pre-line;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .subtitle {
              font-size: ${certificateConfig.subtitleSize}px;
              text-align: center;
              color: ${certificateConfig.subtitleColor};
              margin-bottom: 15px;
              font-family: ${certificateConfig.subtitleFont};
              width: 100%;
              line-height: 1.3;
              white-space: pre-line;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .participant-prefix {
              font-size: ${certificateConfig.participantSize - 2}px;
              text-align: center;
              color: ${certificateConfig.participantColor};
              margin-bottom: 8px;
              font-family: ${certificateConfig.subtitleFont};
              width: 100%;
              line-height: 1.3;
              white-space: pre-line;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .participant-name {
              font-size: ${certificateConfig.participantSize}px;
              font-weight: bold;
              text-align: center;
              color: ${certificateConfig.participantColor};
              margin-bottom: 25px;
              font-family: ${certificateConfig.participantFont};
              width: 100%;
              line-height: 1.2;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .body-text {
              font-size: ${certificateConfig.bodySize}px;
              text-align: center;
              color: ${certificateConfig.bodyColor};
              line-height: 1.5;
              margin-bottom: 25px;
              font-family: ${certificateConfig.bodyFont};
              width: 100%;
              max-width: 90%;
              white-space: pre-line;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .fecha-lugar {
              font-size: ${certificateConfig.fechaLugarSize}px;
              text-align: center;
              color: ${certificateConfig.fechaLugarColor};
              margin-bottom: ${certificateConfig.signatureMargin}px;
              font-style: italic;
              font-family: ${certificateConfig.fechaLugarFont};
              width: 100%;
              line-height: 1.3;
              white-space: pre-line;
              word-wrap: break-word;
              padding: 0 20px;
            }
            
            .signatures-container {
              display: flex;
              justify-content: space-around;
              align-items: flex-end;
              margin-top: auto;
              padding-top: 30px;
              width: 100%;
              gap: 10px;
              flex-wrap: wrap;
            }
            
            .signature-item {
              text-align: center;
              flex: 1 1 auto;
              min-width: 120px;
              max-width: ${certificateConfig.signatureMaxWidth}px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .signature-text {
              font-size: ${certificateConfig.signatureSize}px;
              color: ${certificateConfig.signatureColor};
              font-family: ${certificateConfig.signatureFont};
              line-height: 1.3;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <!-- Logos MEJORADO -->
            ${certificateConfig.institutionLogos.length > 0 ? `
              <div class="logos-container">
                ${certificateConfig.institutionLogos.map(logo => `
                  <div class="logo-item">
                    <img class="logo-img" src="${logo}" crossorigin="anonymous" />
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Contenido principal -->
            <div class="content-container">
              <!-- Título -->
              ${certificateConfig.title ? `
                <div class="title">${certificateConfig.title}</div>
              ` : ''}
              
              <!-- Subtítulo -->
              ${certificateConfig.subtitle ? `
                <div class="subtitle">${certificateConfig.subtitle}</div>
              ` : ''}
              
              <!-- Prefijo del nombre -->
              ${certificateConfig.participantPrefix ? `
                <div class="participant-prefix">${certificateConfig.participantPrefix}</div>
              ` : ''}
              
              <!-- Nombre del participante -->
              <div class="participant-name">${participant.nombre} ${participant.apellido}</div>
              
              <!-- Cuerpo del texto -->
              ${certificateConfig.bodyText ? `
                <div class="body-text">${certificateConfig.bodyText}</div>
              ` : ''}
              
              <!-- Fecha y lugar -->
              ${certificateConfig.fechaLugarText ? `
                <div class="fecha-lugar">${certificateConfig.fechaLugarText}</div>
              ` : ''}
            </div>
            
            <!-- Firmas MEJORADO -->
            ${certificateConfig.signatures.length > 0 ? `
              <div class="signatures-container">
                ${certificateConfig.signatures.map(signature => `
                  <div class="signature-item">
                    <div class="signature-image-container">
                      <img class="signature-img" src="${signature.image}" crossorigin="anonymous" />
                    </div>
                    <div class="signature-text">
                      ${signature.name ? `<div style="font-weight: bold;">${signature.name}</div>` : ''}
                      ${signature.position ? `<div>${signature.position}</div>` : ''}
                      ${signature.institution ? `<div style="font-style: italic;">${signature.institution}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);
        iframeDoc.close();

        // Resto del código se mantiene igual...
        await new Promise(resolve => setTimeout(resolve, 500));

        await new Promise((resolve) => {
          const images = iframeDoc.images;
          let loadedCount = 0;
          const totalImages = images.length;

          if (totalImages === 0) {
            resolve();
            return;
          }

          const checkLoaded = () => {
            loadedCount++;
            console.log(`🖼️ Imagen ${loadedCount}/${totalImages} cargada`);
            if (loadedCount === totalImages) {
              setTimeout(resolve, 200);
            }
          };

          for (let img of images) {
            if (img.complete) {
              checkLoaded();
            } else {
              img.onload = checkLoaded;
              img.onerror = () => {
                console.warn(`⚠️ Error cargando imagen: ${img.src}`);
                checkLoaded();
              };
            }
          }
        });

        const canvas = await html2canvas(iframeDoc.body, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: true,
        });

        console.log(`✅ Canvas generado para ${participant.nombre}`);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        document.body.removeChild(iframe);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        console.log(`✅ Página ${i + 1} agregada al PDF`);
      }

      const fileName = `Certificados_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      setModalOpen(false);

      console.log("🎉 PDF generado exitosamente: " + fileName);
      alert(`✅ PDF generado exitosamente con ${filteredRows.length} certificados`);

    } catch (error) {
      console.error("❌ Error generando PDF:", error);
      alert("Error al generar el PDF: " + error.message);
    }
  };

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
          <Grid size={{ xs: 12, md: 4 }}>
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
                <MenuItem value="nivelatiende">
                  Nivel Educativo que Atiende
                </MenuItem>

                <MenuItem value="cicloatiende">
                  Ciclo que Atiende
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
          <Grid size={{ xs: 12, md: 4 }}>
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
          <Grid size={{ xs: 12, md: 4 }} container justifyContent="flex-end">
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
            {/* REEMPLAZAR el botón PDF existente con este */}
            <Tooltip title="Generar Certificados Personalizados">
              <IconButton
                onClick={() => setModalOpen(true)}
                aria-label="generar certificados"
                sx={{ fontSize: 30, color: color.primary.azul }}
              >
                <FaGraduationCap />
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
        {/* Modal para configuración de certificados - AGREGAR ESTO ANTES DEL DATAGRID */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="certificate-modal"
          aria-describedby="certificate-configuration"
        >
          <Box sx={modalStyle}>
            <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Configuración de Certificados
            </Typography>

            <Box sx={{
              display: 'flex',
              flex: 1,
              gap: { xs: 1, md: 2, lg: 3 },
              overflow: 'hidden',
              flexDirection: { xs: 'column', lg: 'row' }
            }}>
              {/* Panel de configuración */}
              <Box sx={{
                width: { xs: '100%', lg: '35%' },
                height: { xs: '45%', lg: '100%' },
                overflow: 'auto',
                minHeight: { xs: '350px', lg: 'auto' },
                pr: { xs: 0, lg: 1 }
              }}>
                {/* Sección Imágenes */}
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Imágenes
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        Fondo del Certificado
                      </Typography>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageChange}
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        Logos de Instituciones
                      </Typography>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleLogoUpload}
                      />
                    </FormControl>

                    {certificateConfig.institutionLogos.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                          Logos cargados:
                        </Typography>
                        {certificateConfig.institutionLogos.map((logo, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <img src={logo} alt={`Logo ${index}`} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Typography variant="body2" sx={{ flex: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                              Logo {index + 1}
                            </Typography>
                            <Button size="small" onClick={() => removeLogo(index)}>
                              Eliminar
                            </Button>
                          </Box>
                        ))}

                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Posición de logos: {certificateConfig.logoPosition}
                          </Typography>
                          <Select
                            value={certificateConfig.logoPosition}
                            onChange={(e) => setCertificateConfig(prev => ({
                              ...prev,
                              logoPosition: e.target.value
                            }))}
                            size="small"
                          >
                            <MenuItem value="left">Izquierda</MenuItem>
                            <MenuItem value="center">Centro</MenuItem>
                            <MenuItem value="right">Derecha</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        Firmas y Sellos
                      </Typography>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSignatureUpload}
                      />
                    </FormControl>

                    {certificateConfig.signatures.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                          Firmas cargadas:
                        </Typography>
                        {certificateConfig.signatures.map((signature, index) => (
                          <Box key={index} sx={{ border: '1px solid #ddd', p: 1, mb: 1, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <img src={signature.image} alt={`Firma ${index}`} style={{ width: 40, height: 40, marginRight: 10 }} />
                              <Typography variant="body2" sx={{ flex: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                Firma {index + 1}
                              </Typography>
                              <Button size="small" onClick={() => removeSignature(index)}>
                                Eliminar
                              </Button>
                            </Box>
                            <TextField
                              label="Nombre"
                              value={signature.name}
                              onChange={(e) => updateSignature(index, 'name', e.target.value)}
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                            <TextField
                              label="Cargo"
                              value={signature.position}
                              onChange={(e) => updateSignature(index, 'position', e.target.value)}
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                            <TextField
                              label="Institución"
                              value={signature.institution}
                              onChange={(e) => updateSignature(index, 'institution', e.target.value)}
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Box>
                        ))}
                      </Box>
                    )}

                    <FormControlLabel
                      control={
                        <Switch
                          checked={certificateConfig.showBorder}
                          onChange={(e) => setCertificateConfig(prev => ({
                            ...prev,
                            showBorder: e.target.checked
                          }))}
                        />
                      }
                      label="Mostrar borde"
                    />
                  </CardContent>
                </Card>

                {/* Sección Textos */}
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Textos del Certificado
                    </Typography>

                    <TextField
                      label="Instituciones Asosiadas *"
                      value={certificateConfig.title}
                      onChange={(e) => setCertificateConfig(prev => ({
                        ...prev,
                        title: e.target.value
                      }))}
                      fullWidth
                      margin="normal"
                      size="small"
                      placeholder="Ej: Dirección General de Desarrollo Profesional Consejo Nacional de Educación"
                      multiline
                      rows={2}
                      maxRows={4}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const newValue = certificateConfig.title.substring(0, selectionStart) + '\n' + certificateConfig.title.substring(selectionEnd);
                          setCertificateConfig(prev => ({ ...prev, title: newValue }));
                          setTimeout(() => {
                            e.target.selectionStart = selectionStart + 1;
                            e.target.selectionEnd = selectionStart + 1;
                          }, 0);
                        }
                      }}
                    />

                    <TextField
                      label="Subtítulo"
                      value={certificateConfig.subtitle}
                      onChange={(e) => setCertificateConfig(prev => ({
                        ...prev,
                        subtitle: e.target.value
                      }))}
                      fullWidth
                      margin="normal"
                      size="small"
                      placeholder="Ej: Se otorga el presente certificado a"
                      multiline
                      rows={2}
                      maxRows={4}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const newValue = certificateConfig.subtitle.substring(0, selectionStart) + '\n' + certificateConfig.subtitle.substring(selectionEnd);
                          setCertificateConfig(prev => ({ ...prev, subtitle: newValue }));
                          setTimeout(() => {
                            e.target.selectionStart = selectionStart + 1;
                            e.target.selectionEnd = selectionStart + 1;
                          }, 0);
                        }
                      }}
                    />

                    <TextField
                      label="Prefijo del nombre del participante"
                      value={certificateConfig.participantPrefix}
                      onChange={(e) => setCertificateConfig(prev => ({
                        ...prev,
                        participantPrefix: e.target.value
                      }))}
                      fullWidth
                      margin="normal"
                      size="small"
                      placeholder="Ej: Diploma Otorgado a:"
                      multiline
                      rows={2}
                      maxRows={4}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const newValue = certificateConfig.participantPrefix.substring(0, selectionStart) + '\n' + certificateConfig.participantPrefix.substring(selectionEnd);
                          setCertificateConfig(prev => ({ ...prev, participantPrefix: newValue }));
                          setTimeout(() => {
                            e.target.selectionStart = selectionStart + 1;
                            e.target.selectionEnd = selectionStart + 1;
                          }, 0);
                        }
                      }}
                    />

                    <TextField
                      label="Texto del cuerpo *"
                      value={certificateConfig.bodyText}
                      onChange={(e) => setCertificateConfig(prev => ({
                        ...prev,
                        bodyText: e.target.value
                      }))}
                      fullWidth
                      margin="normal"
                      size="small"
                      multiline
                      rows={4}
                      maxRows={8}
                      placeholder="Ej: Por su participación en el Foro Internacional..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const newValue = certificateConfig.bodyText.substring(0, selectionStart) + '\n' + certificateConfig.bodyText.substring(selectionEnd);
                          setCertificateConfig(prev => ({ ...prev, bodyText: newValue }));
                          setTimeout(() => {
                            e.target.selectionStart = selectionStart + 1;
                            e.target.selectionEnd = selectionStart + 1;
                          }, 0);
                        }
                      }}
                    />

                    <TextField
                      label="Fecha y lugar"
                      value={certificateConfig.fechaLugarText}
                      onChange={(e) => setCertificateConfig(prev => ({
                        ...prev,
                        fechaLugarText: e.target.value
                      }))}
                      fullWidth
                      margin="normal"
                      size="small"
                      placeholder="Ej: Tegucigalpa, Honduras, 15 de diciembre de 2024"
                      multiline
                      rows={2}
                      maxRows={4}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const { selectionStart, selectionEnd } = e.target;
                          const newValue = certificateConfig.fechaLugarText.substring(0, selectionStart) + '\n' + certificateConfig.fechaLugarText.substring(selectionEnd);
                          setCertificateConfig(prev => ({ ...prev, fechaLugarText: newValue }));
                          setTimeout(() => {
                            e.target.selectionStart = selectionStart + 1;
                            e.target.selectionEnd = selectionStart + 1;
                          }, 0);
                        }
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Sección Estilos Avanzados */}
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Estilos Avanzados
                    </Typography>

                    {/* Colores */}
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Colores</Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, md: 6 }} >
                        <TextField
                          label="Color instituciones asosiadas"
                          type="color"
                          value={certificateConfig.titleColor}
                          onChange={(e) => setCertificateConfig(prev => ({ ...prev, titleColor: e.target.value }))}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Color subtítulo"
                          type="color"
                          value={certificateConfig.subtitleColor}
                          onChange={(e) => setCertificateConfig(prev => ({ ...prev, subtitleColor: e.target.value }))}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Color nombre"
                          type="color"
                          value={certificateConfig.participantColor}
                          onChange={(e) => setCertificateConfig(prev => ({ ...prev, participantColor: e.target.value }))}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Color cuerpo"
                          type="color"
                          value={certificateConfig.bodyColor}
                          onChange={(e) => setCertificateConfig(prev => ({ ...prev, bodyColor: e.target.value }))}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    {/* Fuentes */}
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Fuentes</Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Fuente instituciones asosiadas</InputLabel>
                          <Select
                            value={certificateConfig.titleFont}
                            label="Fuente instituciones asosiadas"
                            onChange={(e) => setCertificateConfig(prev => ({ ...prev, titleFont: e.target.value }))}
                          >
                            {/* 🟦 Sans-serif */}
                            <MenuItem value="Arial, sans-serif" style={{ fontFamily: "Arial, sans-serif" }}>Arial</MenuItem>
                            <MenuItem value="'Helvetica', sans-serif" style={{ fontFamily: "'Helvetica', sans-serif" }}>Helvetica</MenuItem>
                            <MenuItem value="'Verdana', sans-serif" style={{ fontFamily: "'Verdana', sans-serif" }}>Verdana</MenuItem>
                            <MenuItem value="'Trebuchet MS', sans-serif" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>Trebuchet MS</MenuItem>
                            <MenuItem value="'Gill Sans', sans-serif" style={{ fontFamily: "'Gill Sans', sans-serif" }}>Gill Sans</MenuItem>
                            <MenuItem value="'Lucida Sans', sans-serif" style={{ fontFamily: "'Lucida Sans', sans-serif" }}>Lucida Sans</MenuItem>
                            <MenuItem value="'Tahoma', sans-serif" style={{ fontFamily: "'Tahoma', sans-serif" }}>Tahoma</MenuItem>
                            <MenuItem value="'Geneva', sans-serif" style={{ fontFamily: "'Geneva', sans-serif" }}>Geneva</MenuItem>
                            <MenuItem value="'Segoe UI', sans-serif" style={{ fontFamily: "'Segoe UI', sans-serif" }}>Segoe UI</MenuItem>
                            <MenuItem value="'Futura', sans-serif" style={{ fontFamily: "'Futura', sans-serif" }}>Futura</MenuItem>

                            {/* 🟩 Serif */}
                            <MenuItem value="'Times New Roman', serif" style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</MenuItem>
                            <MenuItem value="'Georgia', serif" style={{ fontFamily: "'Georgia', serif" }}>Georgia</MenuItem>
                            <MenuItem value="'Garamond', serif" style={{ fontFamily: "'Garamond', serif" }}>Garamond</MenuItem>
                            <MenuItem value="'Baskerville', serif" style={{ fontFamily: "'Baskerville', serif" }}>Baskerville</MenuItem>
                            <MenuItem value="'Palatino Linotype', 'Book Antiqua', Palatino, serif" style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>Palatino Linotype</MenuItem>
                            <MenuItem value="'Cambria', serif" style={{ fontFamily: "'Cambria', serif" }}>Cambria</MenuItem>
                            <MenuItem value="'Didot', serif" style={{ fontFamily: "'Didot', serif" }}>Didot</MenuItem>
                            <MenuItem value="'Constantia', serif" style={{ fontFamily: "'Constantia', serif" }}>Constantia</MenuItem>
                            <MenuItem value="'Bookman Old Style', serif" style={{ fontFamily: "'Bookman Old Style', serif" }}>Bookman Old Style</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟨 Monospace */}
                            <MenuItem value="'Courier New', monospace" style={{ fontFamily: "'Courier New', monospace" }}>Courier New</MenuItem>
                            <MenuItem value="'Lucida Console', monospace" style={{ fontFamily: "'Lucida Console', monospace" }}>Lucida Console</MenuItem>
                            <MenuItem value="'Consolas', monospace" style={{ fontFamily: "'Consolas', monospace" }}>Consolas</MenuItem>
                            <MenuItem value="'Monaco', monospace" style={{ fontFamily: "'Monaco', monospace" }}>Monaco</MenuItem>
                            <MenuItem value="'Andale Mono', monospace" style={{ fontFamily: "'Andale Mono', monospace" }}>Andale Mono</MenuItem>

                            {/* 🟧 Cursive / Script */}
                            <MenuItem value="'Brush Script MT', cursive" style={{ fontFamily: "'Brush Script MT', cursive" }}>Brush Script MT</MenuItem>
                            <MenuItem value="'Comic Sans MS', cursive" style={{ fontFamily: "'Comic Sans MS', cursive" }}>Comic Sans MS</MenuItem>
                            <MenuItem value="'Lucida Handwriting', cursive" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>Lucida Handwriting</MenuItem>
                            <MenuItem value="'Segoe Script', cursive" style={{ fontFamily: "'Segoe Script', cursive" }}>Segoe Script</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟪 Fantasy / Display */}
                            <MenuItem value="'Papyrus', fantasy" style={{ fontFamily: "'Papyrus', fantasy" }}>Papyrus</MenuItem>
                            <MenuItem value="'Copperplate', fantasy" style={{ fontFamily: "'Copperplate', fantasy" }}>Copperplate</MenuItem>
                            <MenuItem value="'Impact', fantasy" style={{ fontFamily: "'Impact', fantasy" }}>Impact</MenuItem>
                            <MenuItem value="'Jokerman', fantasy" style={{ fontFamily: "'Jokerman', fantasy" }}>Jokerman</MenuItem>
                            <MenuItem value="'Chiller', fantasy" style={{ fontFamily: "'Chiller', fantasy" }}>Chiller</MenuItem>

                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Fuente cuerpo</InputLabel>
                          <Select
                            value={certificateConfig.bodyFont}
                            label="Fuente cuerpo"
                            onChange={(e) => setCertificateConfig(prev => ({ ...prev, bodyFont: e.target.value }))}
                          >
                            {/* 🟦 Sans-serif */}
                            <MenuItem value="Arial, sans-serif" style={{ fontFamily: "Arial, sans-serif" }}>Arial</MenuItem>
                            <MenuItem value="'Helvetica', sans-serif" style={{ fontFamily: "'Helvetica', sans-serif" }}>Helvetica</MenuItem>
                            <MenuItem value="'Verdana', sans-serif" style={{ fontFamily: "'Verdana', sans-serif" }}>Verdana</MenuItem>
                            <MenuItem value="'Trebuchet MS', sans-serif" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>Trebuchet MS</MenuItem>
                            <MenuItem value="'Gill Sans', sans-serif" style={{ fontFamily: "'Gill Sans', sans-serif" }}>Gill Sans</MenuItem>
                            <MenuItem value="'Lucida Sans', sans-serif" style={{ fontFamily: "'Lucida Sans', sans-serif" }}>Lucida Sans</MenuItem>
                            <MenuItem value="'Tahoma', sans-serif" style={{ fontFamily: "'Tahoma', sans-serif" }}>Tahoma</MenuItem>
                            <MenuItem value="'Geneva', sans-serif" style={{ fontFamily: "'Geneva', sans-serif" }}>Geneva</MenuItem>
                            <MenuItem value="'Segoe UI', sans-serif" style={{ fontFamily: "'Segoe UI', sans-serif" }}>Segoe UI</MenuItem>
                            <MenuItem value="'Futura', sans-serif" style={{ fontFamily: "'Futura', sans-serif" }}>Futura</MenuItem>

                            {/* 🟩 Serif */}
                            <MenuItem value="'Times New Roman', serif" style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</MenuItem>
                            <MenuItem value="'Georgia', serif" style={{ fontFamily: "'Georgia', serif" }}>Georgia</MenuItem>
                            <MenuItem value="'Garamond', serif" style={{ fontFamily: "'Garamond', serif" }}>Garamond</MenuItem>
                            <MenuItem value="'Baskerville', serif" style={{ fontFamily: "'Baskerville', serif" }}>Baskerville</MenuItem>
                            <MenuItem value="'Palatino Linotype', 'Book Antiqua', Palatino, serif" style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>Palatino Linotype</MenuItem>
                            <MenuItem value="'Cambria', serif" style={{ fontFamily: "'Cambria', serif" }}>Cambria</MenuItem>
                            <MenuItem value="'Didot', serif" style={{ fontFamily: "'Didot', serif" }}>Didot</MenuItem>
                            <MenuItem value="'Constantia', serif" style={{ fontFamily: "'Constantia', serif" }}>Constantia</MenuItem>
                            <MenuItem value="'Bookman Old Style', serif" style={{ fontFamily: "'Bookman Old Style', serif" }}>Bookman Old Style</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟨 Monospace */}
                            <MenuItem value="'Courier New', monospace" style={{ fontFamily: "'Courier New', monospace" }}>Courier New</MenuItem>
                            <MenuItem value="'Lucida Console', monospace" style={{ fontFamily: "'Lucida Console', monospace" }}>Lucida Console</MenuItem>
                            <MenuItem value="'Consolas', monospace" style={{ fontFamily: "'Consolas', monospace" }}>Consolas</MenuItem>
                            <MenuItem value="'Monaco', monospace" style={{ fontFamily: "'Monaco', monospace" }}>Monaco</MenuItem>
                            <MenuItem value="'Andale Mono', monospace" style={{ fontFamily: "'Andale Mono', monospace" }}>Andale Mono</MenuItem>

                            {/* 🟧 Cursive / Script */}
                            <MenuItem value="'Brush Script MT', cursive" style={{ fontFamily: "'Brush Script MT', cursive" }}>Brush Script MT</MenuItem>
                            <MenuItem value="'Comic Sans MS', cursive" style={{ fontFamily: "'Comic Sans MS', cursive" }}>Comic Sans MS</MenuItem>
                            <MenuItem value="'Lucida Handwriting', cursive" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>Lucida Handwriting</MenuItem>
                            <MenuItem value="'Segoe Script', cursive" style={{ fontFamily: "'Segoe Script', cursive" }}>Segoe Script</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟪 Fantasy / Display */}
                            <MenuItem value="'Papyrus', fantasy" style={{ fontFamily: "'Papyrus', fantasy" }}>Papyrus</MenuItem>
                            <MenuItem value="'Copperplate', fantasy" style={{ fontFamily: "'Copperplate', fantasy" }}>Copperplate</MenuItem>
                            <MenuItem value="'Impact', fantasy" style={{ fontFamily: "'Impact', fantasy" }}>Impact</MenuItem>
                            <MenuItem value="'Jokerman', fantasy" style={{ fontFamily: "'Jokerman', fantasy" }}>Jokerman</MenuItem>
                            <MenuItem value="'Chiller', fantasy" style={{ fontFamily: "'Chiller', fantasy" }}>Chiller</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Fuente participante</InputLabel>
                          <Select
                            value={certificateConfig.participantFont}
                            label="Fuente participante"
                            onChange={(e) => setCertificateConfig(prev => ({ ...prev, participantFont: e.target.value }))}
                          >
                            {/* 🟦 Sans-serif */}
                            <MenuItem value="Arial, sans-serif" style={{ fontFamily: "Arial, sans-serif" }}>Arial</MenuItem>
                            <MenuItem value="'Helvetica', sans-serif" style={{ fontFamily: "'Helvetica', sans-serif" }}>Helvetica</MenuItem>
                            <MenuItem value="'Verdana', sans-serif" style={{ fontFamily: "'Verdana', sans-serif" }}>Verdana</MenuItem>
                            <MenuItem value="'Trebuchet MS', sans-serif" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>Trebuchet MS</MenuItem>
                            <MenuItem value="'Gill Sans', sans-serif" style={{ fontFamily: "'Gill Sans', sans-serif" }}>Gill Sans</MenuItem>
                            <MenuItem value="'Lucida Sans', sans-serif" style={{ fontFamily: "'Lucida Sans', sans-serif" }}>Lucida Sans</MenuItem>
                            <MenuItem value="'Tahoma', sans-serif" style={{ fontFamily: "'Tahoma', sans-serif" }}>Tahoma</MenuItem>
                            <MenuItem value="'Geneva', sans-serif" style={{ fontFamily: "'Geneva', sans-serif" }}>Geneva</MenuItem>
                            <MenuItem value="'Segoe UI', sans-serif" style={{ fontFamily: "'Segoe UI', sans-serif" }}>Segoe UI</MenuItem>
                            <MenuItem value="'Futura', sans-serif" style={{ fontFamily: "'Futura', sans-serif" }}>Futura</MenuItem>

                            {/* 🟩 Serif */}
                            <MenuItem value="'Times New Roman', serif" style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</MenuItem>
                            <MenuItem value="'Georgia', serif" style={{ fontFamily: "'Georgia', serif" }}>Georgia</MenuItem>
                            <MenuItem value="'Garamond', serif" style={{ fontFamily: "'Garamond', serif" }}>Garamond</MenuItem>
                            <MenuItem value="'Baskerville', serif" style={{ fontFamily: "'Baskerville', serif" }}>Baskerville</MenuItem>
                            <MenuItem value="'Palatino Linotype', 'Book Antiqua', Palatino, serif" style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>Palatino Linotype</MenuItem>
                            <MenuItem value="'Cambria', serif" style={{ fontFamily: "'Cambria', serif" }}>Cambria</MenuItem>
                            <MenuItem value="'Didot', serif" style={{ fontFamily: "'Didot', serif" }}>Didot</MenuItem>
                            <MenuItem value="'Constantia', serif" style={{ fontFamily: "'Constantia', serif" }}>Constantia</MenuItem>
                            <MenuItem value="'Bookman Old Style', serif" style={{ fontFamily: "'Bookman Old Style', serif" }}>Bookman Old Style</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟨 Monospace */}
                            <MenuItem value="'Courier New', monospace" style={{ fontFamily: "'Courier New', monospace" }}>Courier New</MenuItem>
                            <MenuItem value="'Lucida Console', monospace" style={{ fontFamily: "'Lucida Console', monospace" }}>Lucida Console</MenuItem>
                            <MenuItem value="'Consolas', monospace" style={{ fontFamily: "'Consolas', monospace" }}>Consolas</MenuItem>
                            <MenuItem value="'Monaco', monospace" style={{ fontFamily: "'Monaco', monospace" }}>Monaco</MenuItem>
                            <MenuItem value="'Andale Mono', monospace" style={{ fontFamily: "'Andale Mono', monospace" }}>Andale Mono</MenuItem>

                            {/* 🟧 Cursive / Script */}
                            <MenuItem value="'Brush Script MT', cursive" style={{ fontFamily: "'Brush Script MT', cursive" }}>Brush Script MT</MenuItem>
                            <MenuItem value="'Comic Sans MS', cursive" style={{ fontFamily: "'Comic Sans MS', cursive" }}>Comic Sans MS</MenuItem>
                            <MenuItem value="'Lucida Handwriting', cursive" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>Lucida Handwriting</MenuItem>
                            <MenuItem value="'Segoe Script', cursive" style={{ fontFamily: "'Segoe Script', cursive" }}>Segoe Script</MenuItem>
                            <MenuItem value="'Monotype Corsiva', cursive" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>Monotype Corsiva</MenuItem>

                            {/* 🟪 Fantasy / Display */}
                            <MenuItem value="'Papyrus', fantasy" style={{ fontFamily: "'Papyrus', fantasy" }}>Papyrus</MenuItem>
                            <MenuItem value="'Copperplate', fantasy" style={{ fontFamily: "'Copperplate', fantasy" }}>Copperplate</MenuItem>
                            <MenuItem value="'Impact', fantasy" style={{ fontFamily: "'Impact', fantasy" }}>Impact</MenuItem>
                            <MenuItem value="'Jokerman', fantasy" style={{ fontFamily: "'Jokerman', fantasy" }}>Jokerman</MenuItem>
                            <MenuItem value="'Chiller', fantasy" style={{ fontFamily: "'Chiller', fantasy" }}>Chiller</MenuItem>


                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Fuente firmas</InputLabel>
                          <Select
                            value={certificateConfig.signatureFont}
                            label="Fuente firmas"
                            onChange={(e) => setCertificateConfig(prev => ({ ...prev, signatureFont: e.target.value }))}
                          >
                            <MenuItem value="Arial, sans-serif">Arial</MenuItem>
                            <MenuItem value="'Times New Roman', serif">Times New Roman</MenuItem>
                            <MenuItem value="'Helvetica', sans-serif">Helvetica</MenuItem>
                            <MenuItem value="'Georgia', serif">Georgia</MenuItem>
                            <MenuItem value="'Verdana', sans-serif">Verdana</MenuItem>
                            <MenuItem value="'Courier New', monospace">Courier New</MenuItem>
                            <MenuItem value="'Trebuchet MS', sans-serif">Trebuchet MS</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Tamaños */}
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Tamaños de texto</Typography>
                    {[
                      { key: 'titleSize', label: 'Instituciones Asosiadas', min: 1, max: 100 },
                      { key: 'subtitleSize', label: 'Subtítulo', min: 1, max: 100 },
                      { key: 'participantSize', label: 'Nombre participante', min: 1, max: 100 },
                      { key: 'bodySize', label: 'Cuerpo', min: 1, max: 100 },
                      { key: 'fechaLugarSize', label: 'Fecha/lugar', min: 1, max: 100 },
                      { key: 'signatureSize', label: 'Firmas', min: 1, max: 100 },
                    ].map((item) => (
                      <FormControl fullWidth key={item.key} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                          {item.label}: {certificateConfig[item.key]}px
                        </Typography>
                        <Slider
                          value={certificateConfig[item.key]}
                          onChange={(_, value) => setCertificateConfig(prev => ({
                            ...prev,
                            [item.key]: value
                          }))}
                          min={item.min}
                          max={item.max}
                          step={1}
                          size="small"
                        />
                      </FormControl>
                    ))}

                    {/* Layout */}
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Layout</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Margen del contenido: {certificateConfig.contentMargin}px
                      </Typography>
                      <Slider
                        value={certificateConfig.contentMargin}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          contentMargin: value
                        }))}
                        min={10}
                        max={300}
                        step={5}
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Espacio entre logos: {certificateConfig.logoSpacing}px
                      </Typography>
                      <Slider
                        value={certificateConfig.logoSpacing}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          logoSpacing: value
                        }))}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Tamaño logos: {certificateConfig.logoSize}px
                      </Typography>
                      <Slider
                        value={certificateConfig.logoSize}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          logoSize: value
                        }))}
                        min={50}
                        max={100}
                        step={5}
                      />
                    </FormControl>
                    {/* En la sección Layout del modal */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Ancho máximo de logos: {certificateConfig.logoMaxWidth}px
                      </Typography>
                      <Slider
                        value={certificateConfig.logoMaxWidth || 150}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          logoMaxWidth: value
                        }))}
                        min={50}
                        max={300}
                        step={5}
                      />
                    </FormControl>
                    {/* En la sección Layout del modal, agrega estos controles */}

                    {/* Control para altura máxima de logos */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Altura máxima de logos: {certificateConfig.logoMaxHeight}px
                      </Typography>
                      <Slider
                        value={certificateConfig.logoMaxHeight}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          logoMaxHeight: value
                        }))}
                        min={50}
                        max={100}
                        step={5}
                      />
                    </FormControl>


                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Firmas</Typography>
                    {/* En la sección Layout del modal, agrega estos controles adicionales */}

                    {/* Control para ancho máximo de firmas */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Ancho máximo de firmas: {certificateConfig.signatureMaxWidth}px
                      </Typography>
                      <Slider
                        value={certificateConfig.signatureMaxWidth}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          signatureMaxWidth: value
                        }))}
                        min={80}
                        max={100}
                        step={5}
                      />
                    </FormControl>

                    {/* Control para espacio entre fecha y firmas */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                        Espacio entre fecha y firmas: {certificateConfig.signatureMargin}px
                      </Typography>
                      <Slider
                        value={certificateConfig.signatureMargin}
                        onChange={(_, value) => setCertificateConfig(prev => ({
                          ...prev,
                          signatureMargin: value
                        }))}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Box>

              {/* Vista previa - HORIZONTAL CON ELEMENTOS ADENTRO */}
              {/* Vista previa - CON DIMENSIONES REALES A4 HORIZONTAL */}
              <Box sx={{
                width: { xs: '100%', lg: '65%' },
                height: { xs: '55%', lg: '100%' },
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: '400px', lg: 'auto' }
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  Vista Previa (DIMENSIONES REALES A4 Horizontal)
                </Typography>

                <Box sx={{
                  flex: 1,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: { xs: 1, md: 2 },
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'auto',
                  minHeight: { xs: '300px', sm: '350px', md: '400px' }
                }}>
                  {/* Contenedor con dimensiones exactas A4 horizontal */}
                  <Box sx={{
                    width: '297mm',
                    height: '210mm',
                    minWidth: '297mm',
                    minHeight: '210mm',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transform: 'scale(0.7)',
                    transformOrigin: 'center center',
                    '@media (max-width: 1200px)': {
                      transform: 'scale(0.6)',
                    },
                    '@media (max-width: 900px)': {
                      transform: 'scale(0.5)',
                    },
                    '@media (max-width: 600px)': {
                      transform: 'scale(0.4)',
                    }
                  }}>
                    {/* Usar el mismo componente que el PDF pero con dimensiones reales */}
                    {previewParticipant && (
                      <CertificateTemplate
                        participant={previewParticipant}
                        config={certificateConfig}
                        isPDF={false}
                      />
                    )}
                  </Box>
                </Box>

                {/* Indicador de dimensiones reales */}
                <Typography variant="caption" sx={{
                  textAlign: 'center',
                  display: 'block',
                  mt: 1,
                  color: 'text.secondary',
                  fontSize: { xs: '0.7rem', md: '0.8rem' }
                }}>
                  📏 Dimensiones reales: 297mm × 210mm (A4 Horizontal) - Vista escalada para ajustarse al modal
                </Typography>
              </Box>

            </Box>
            <Box sx={{
              mt: 2,
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>
              <Button
                onClick={() => setModalOpen(false)}
                size="medium"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleGenerarPDF}
                disabled={filteredRows.length === 0 || !certificateConfig.title || !certificateConfig.bodyText}
                size="medium"
                sx={{
                  backgroundColor: color.primary.azul,
                  '&:hover': {
                    backgroundColor: color.primary.azul,
                    opacity: 0.9
                  }
                }}
              >
                Generar {filteredRows.length} Certificados PDF
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Dashboard>
  );
};

export default ListadoParticipantes;
