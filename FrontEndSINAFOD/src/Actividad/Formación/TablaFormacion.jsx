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
import { PDFViewer } from "@react-pdf/renderer";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Componente para el PDF

const FormationPDF = ({
  formacion,
  modalidad,
  estado,
  fechainicio,
  fechafinal,
  qrUrl,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Información de la Formación</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre de la Formación:</Text>
        <Text style={styles.value}>{formacion || "No especificado"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Modalidad:</Text>
        <Text style={styles.value}>{modalidad || "No especificada"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{estado || "No especificado"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha de Inicio:</Text>
        <Text style={styles.value}>
          {fechainicio
            ? new Date(fechainicio).toLocaleDateString("es-ES")
            : "No especificada"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha de Finalización:</Text>
        <Text style={styles.value}>
          {fechafinal
            ? new Date(fechafinal).toLocaleDateString("es-ES")
            : "No especificada"}
        </Text>
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.label}>Código QR para participantes:</Text>
        <Image
          style={styles.qrImage}
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            qrUrl
          )}`}
        />
        <Text style={styles.url}>{qrUrl}</Text>
      </View>
    </Page>
  </Document>
);

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    marginBottom: 15,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  url: {
    fontSize: 10,
    marginTop: 10,
    color: "#666",
  },
});

export default function TablaActividad({ isSaved, setIsSaved }) {
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
  const [currentRow, setCurrentRow] = useState(null);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/formacion`)
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos:", error);
      });
  }, [isSaved]);

  const checkLineamientos = async (id) => {
    const selectedRow = rows.find((row) => row.id === id);

    if (selectedRow?.estado_lineamientos === "No Lleno Lineamientos") {
      await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>formación</b> <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: color.primary.azul,
      });
    } else if (
      selectedRow?.estado_lineamientos === "Lineamientos Incompletos"
    ) {
      await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>formación</b> tiene sus <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: color.primary.azul,
      });
    }
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
    const selectedRow = rows.find((row) => row.id === id);
    const qrLink = `${process.env.REACT_APP_DOMINIO}/Formulario-De-Participante/${id}`;
    setQrUrl(qrLink);
    setCurrentRow(selectedRow);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.actualizar === true;
  };

  const columns = [
    ...(tienePermiso(5)
      ? [
          {
            field: "actions",
            headerName: "Acción",
            width: 190,
            renderCell: (params) => (
              <>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => handleFormacion(params.id)}
                    color="action"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Actualizar Lineamientos">
                  <IconButton
                    onClick={() => handleLineamientosFormacion(params.id)}
                    color="success"
                  >
                    <ChecklistIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generar QR para participantes">
                  <IconButton
                    sx={{ color: color.primary.azul }}
                    onClick={() => handleOpenQrModal(params.id)}
                  >
                    <QrCodeScannerOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Ver Detalles">
                  <IconButton
                    onClick={() => handleOpen(params.id)}
                    color="info"
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ]
      : []),
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "formacion",
      headerName: "Nombre de la Formación",
      width: 230,
    },
    { field: "modalidad", headerName: "Modalidad", width: 150 },
    { field: "estado", headerName: "Estado", width: 120 },
    {
      field: "fechainicio",
      headerName: "Fecha Inicio",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES");
      },
    },
    {
      field: "fechafinal",
      headerName: "Fecha de Finalización",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "";
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
            Formaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/Lineamientos_De_Formación")}
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

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Información de la Formación</DialogTitle>
          <DialogContent style={{ textAlign: "center", padding: "20px" }}>
            {qrUrl && currentRow && (
              <>
                <QRCodeCanvas value={qrUrl} size={200} />
                <p style={{ marginTop: "15px", wordBreak: "break-all" }}>
                  {qrUrl}
                </p>

                <div style={{ marginTop: "25px" }}>
                  <PDFDownloadLink
                    document={
                      <FormationPDF
                        formacion={currentRow.formacion}
                        modalidad={currentRow.modalidad}
                        estado={currentRow.estado}
                        fechainicio={currentRow.fechainicio}
                        fechafinal={currentRow.fechafinal}
                        qrUrl={qrUrl}
                      />
                    }
                    fileName={`formacion_${currentRow.formacion.replace(
                      /\s+/g,
                      "_"
                    )}.pdf`}
                  >
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                          mt: 2,
                          backgroundColor: color.primary.azul,
                          "&:hover": {
                            backgroundColor: color.dark,
                          },
                        }}
                      >
                        {loading ? "Generando PDF..." : "Descargar PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Dashboard>
  );
}
