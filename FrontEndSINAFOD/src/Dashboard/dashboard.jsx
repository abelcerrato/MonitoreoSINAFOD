import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import AppBarComponent from "./AppBar";
import ProjectDrawer from "./Drawer";
import { useLocation } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { useUser } from "../Components/UserContext";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";

import { QRCodeCanvas } from "qrcode.react";
import CambiarContraModal from "../Login/CambiarContraModal";
import { color } from "../Components/color";
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
import logoDGDP from "../Components/img/Logo DGDP_FondoB.png";
import logoSE from "../Components/img/LogoEducacion.png";
import marcaH from "../Components/img/5 estrellas y H.png";

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

const FormationPDF = ({ qrUrl }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.backgroundColumn} />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={logoDGDP} />
        <Image style={styles.logo} src={logoSE} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Formulario de Pre Inscripción</Text>

        <View style={styles.qrContainer}>
          <Text style={styles.label}>Código QR</Text>
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

const Dashboard = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const mostrarBotonQR =
    pathname === "/Listado_De_Acciones_Formativas" || pathname === "/dashboard";
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const { user, updateUser } = useUser();

  useEffect(() => {
    // Verificar si necesita cambio de contraseña solo al cargar el dashboard
    if (user?.requiresPasswordChange) {
      setOpenChangePasswordModal(true);
    }
  }, [user?.requiresPasswordChange]);  // Solo se ejecuta cuando cambia este valor

  const handlePasswordChangeSuccess = () => {
    // Actualizar el estado del usuario para eliminar el requerimiento
    updateUser({ ...user, requiresPasswordChange: false });
    setOpenChangePasswordModal(false);

    // Opcional: Guardar en localStorage/sessionStorage
    sessionStorage.setItem("passwordChanged", "true");
  };

  const handleOpenQrModal = async () => {
    const qrLink = `${process.env.REACT_APP_DOMINIO}/Formulario-De-Inscripción`;

    try {
      setQrUrl(qrLink);

      setOpenModal(true);
    } catch (error) {
      console.error("Error generando QR:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Pasa openDrawer como prop 'open' al AppBarComponent */}
      <AppBarComponent open={openDrawer} toggleDrawer={toggleDrawer} />

      <ProjectDrawer open={openDrawer} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
          marginTop: "110px",
          marginLeft: openDrawer ? "20px" : "20px",
          marginRight: openDrawer ? "20px" : "20px",
          width: openDrawer ? "calc(100% - 250px)" : "calc(100% - 72px)",
          height: "calc(100vh - 80px)",
          overflow: "auto",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          borderRadius: 5,
          backgroundColor: "#f2f2f2",
        }}
      >
        {mostrarBotonQR && (
          <Tooltip title="Generar QR para Pre Inscripción">
            <IconButton
              sx={{ color: color.primary.azul }}
              onClick={() => handleOpenQrModal()}
            >
              <QrCodeScannerOutlinedIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
        {children}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 5, py: 2 }}
        >
          {"Copyright © "}
          Propiedad Intelectual del Estado de Honduras
        </Typography>

        <CambiarContraModal
          open={openChangePasswordModal}
          onClose={() =>
            !user?.requiresPasswordChange && setOpenChangePasswordModal(false)
          }
          mandatory={true}
          onSuccess={handlePasswordChangeSuccess}
        />
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Descarga de Qr</DialogTitle>
        <DialogContent style={{ textAlign: "center", padding: "20px" }}>
          {qrUrl && (
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
                  document={<FormationPDF qrUrl={qrUrl} />}
                  fileName="Qr_de_PreInscripción.pdf"
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
                    <FormationPDF qrUrl={qrUrl} />
                  </PDFViewer>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
