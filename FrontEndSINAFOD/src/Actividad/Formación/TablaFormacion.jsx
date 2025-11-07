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
  Modal,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import Groups2Icon from '@mui/icons-material/Groups2';
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
import TablaParticipantes from "../../Participantes/TablaParticipantes";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Componente para el PDF
import logoDGDP from "../../Components/img/Logo DGDP_FondoB.png";
import logoSE from "../../Components/img/LogoEducacion.png";
import marcaH from "../../Components/img/5 estrellas y H.png";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    position: "relative",
    padding: 30,
    fontFamily: "Helvetica",
  },
  backgroundColumn: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: "100%",
    backgroundColor: color.primary.azul,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: "auto",
  },
  marcaH: {
    position: "absolute",
    padding: 5,
    bottom: 100,
    left: 35,
    width: 80,
    height: 40,
    backgroundColor: color.primary.azul,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 60,
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
  labelMensaje: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "red",
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

const FormationPDF = ({
  formacion,
  modalidad,
  estado,
  fechainicio,
  fechafinal,
  qrUrl,
}) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.backgroundColumn} />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={logoDGDP} />
        <Image style={styles.logo} src={logoSE} />
      </View>

      <View style={styles.content}>
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
          <Text style={styles.label}>Fecha de Inicio:</Text>
          <Text style={styles.value}>
            {fechainicio
              ? new Date(fechainicio).toLocaleDateString("es-ES", { timeZone: "UTC" })
              : "No especificada"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fecha de Finalización:</Text>
          <Text style={styles.value}>
            {fechafinal
              ? new Date(fechafinal).toLocaleDateString("es-ES", { timeZone: "UTC" })
              : "No especificada"}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.labelMensaje}>Este código QR tiene una vigencia de 24 horas a partir del momento en que fue generado.</Text>
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
      </View>
      <Image style={styles.marcaH} src={marcaH} />
    </Page>
  </Document>
);

export default function TablaActividad({ isSaved, setIsSaved }) {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const { permissions } = useUser();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  const [qrUrl, setQrUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [openParticipantes, setOpenParticipantes] = useState(false);
  const [selectedFormacionId, setSelectedFormacionId] = useState(null);

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
      const confirmResult = await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>acción formativa</b> <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      return confirmResult.isConfirmed;
    } else if (
      selectedRow?.estado_lineamientos === "Lineamientos Incompletos"
    ) {
      const confirmResult = await Swal.fire({
        title: "¡Advertencia!",
        html: `Esta <b>acción formativa</b> tiene sus <b>"${selectedRow.estado_lineamientos}"</b>.<br>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      return confirmResult.isConfirmed;
    }

    return true;
  };

  const handleFormacion = async (id) => {
    const shouldContinue = await checkLineamientos(id);
    if (!shouldContinue) return;
    navigate(`/Actualizar_Acción_Formativa/${id}`);
  };

  const handleLineamientosFormacion = async (id) => {
    const shouldContinue = await checkLineamientos(id);
    if (!shouldContinue) return;
    navigate(`/Actualizar_Lineamientos_De_La_Acción_Formativa/${id}`);
  };

  const handleOpenQrModal = (id) => {
    const selectedRow = rows.find((row) => row.id === id);

    // Agregar timestamp de expiración (ej: 24 horas)
    const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas en milisegundos
    const qrLink = `${process.env.REACT_APP_DOMINIO}/Formulario-De-Participante/${id}?expires=${expirationTime}`;

    setQrUrl(qrLink);
    setCurrentRow(selectedRow);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenParticipantes = (id) => {
    setSelectedFormacionId(id);
    setOpenParticipantes(true);
  };

  const handleCloseParticipantes = () => {
    setOpenParticipantes(false);
    setSelectedFormacionId(null);
  };



  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.actualizar === true;
  };

  const tienePermisoInsertar = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.insertar === true;
  };

  const columns = [
    ...(tienePermiso(2)
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

              <Tooltip title="Ver Participantes">
                <IconButton
                  color="info"
                  onClick={() => handleOpenParticipantes(params.id)}
                >
                  <Groups2Icon />
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
        return date.toLocaleDateString("es-ES", { timeZone: "UTC" });
      }

    },
    {
      field: "fechafinal",
      headerName: "Fecha de Finalización",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES", { timeZone: "UTC" });
      }

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
            Acciones Formativas
          </Typography>
          {tienePermisoInsertar(2) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/Lineamientos_De_La_Acción_Formativa")}
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
          )}
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

        />

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>QR para Inscripción</DialogTitle>
          <DialogContent style={{ textAlign: "center", padding: "20px" }}>
            {qrUrl && currentRow && (
              <>
                {!showPreview && (
                  <>
                    <QRCodeCanvas value={qrUrl} size={200} />
                    <p style={{ marginTop: "15px", wordBreak: "break-all" }}>
                      {qrUrl}
                    </p>
                  </>
                )}

                <div style={{ marginTop: "25px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowPreview(!showPreview)}
                    sx={{ mr: 2 }}
                  >
                    {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
                  </Button>

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
                    fileName={`QR_${currentRow.formacion.replace(
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

                {showPreview && (
                  <div style={{ marginTop: "30px", height: "600px" }}>
                    <PDFViewer width="100%" height="100%">
                      <FormationPDF
                        formacion={currentRow.formacion}
                        modalidad={currentRow.modalidad}
                        estado={currentRow.estado}
                        fechainicio={currentRow.fechainicio}
                        fechafinal={currentRow.fechafinal}
                        qrUrl={qrUrl}
                      />
                    </PDFViewer>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        <Modal
          open={openParticipantes}
          onClose={handleCloseParticipantes}
          aria-labelledby="modal-participantes-title"
          aria-describedby="modal-participantes-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxHeight: "90vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 3,
              overflowY: "auto",
            }}
          >
            {selectedFormacionId ? (
              <TablaParticipantes
                investCap={selectedFormacionId}
                isSaved={false}
                setIsSaved={() => { }}
                formacioninvest={"formacion"}
              />
            ) : (
              <Typography variant="body2">Cargando participantes...</Typography>
            )}
          </Box>
        </Modal>

      </Paper>
    </Dashboard>
  );
}
