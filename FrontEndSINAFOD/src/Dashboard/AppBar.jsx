import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";
import Logo from "../Components/img/Logo DGDP_FondoB.png";
import { color } from "../Components/color";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import LogouIcon from "@mui/icons-material/Logout";

const AppBarComponent = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta pantallas pequeñas

  const handleRedirect = async () => {
    try {
      if (!user?.id) {
        console.error("No se encontró el ID del usuario");
        throw new Error("Usuario no identificado");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/cierreSesion/${user.id}`
      );
      console.log("Respuesta del backend:", response.data);

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
      });
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: color.primary.azul,
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: isMobile ? 1 : 4, // Menor padding en móviles
          minHeight: "64px", // Altura mínima para móviles
        }}
      >
        {/* Logo y Botón de Toggle */}
        <Grid container alignItems="center" justifyContent="flex-start">
          <div
            style={{
              width: isMobile ? "180px" : "260px", // Logo más pequeño en móviles
              height: isMobile ? "60px" : "90px",
              background: "white",
              padding: isMobile ? 2 : 5,
              display: "flex",
              justifyContent: "center",
              marginLeft: isMobile ? -15 : -33, // Ajuste de margen en móviles
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "90%", height: "90%", objectFit: "contain" }}
            />
          </div>

          {/* Botón de Toggle (solo si no es móvil o si el drawer está cerrado) */}
          {!isMobile && (
            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: "white",
                marginRight: 2,
                backgroundColor: color.primary.azul,
                borderRadius: 2,
                width: 40,
                height: 40,
                "&:hover": {
                  backgroundColor: color.primary.rojo,
                  transform: "scale(1.05)",
                },
              }}
              aria-label={open ? "Ocultar menú" : "Mostrar menú"}
            >
              {open ? (
                <FormatIndentDecreaseOutlinedIcon />
              ) : (
                <FormatIndentIncreaseOutlinedIcon />
              )}
            </IconButton>
          )}
        </Grid>

        {/* Usuario y Cerrar Sesión (reorganizado en móviles) */}
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          sx={{ width: "auto" }}
        >
          <Grid item xs={8} sm={9}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              noWrap
              sx={{ color: "white", textAlign: "right" }}
            >
              {user?.usuario || "Usuario"}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Tooltip title="Cerrar Sesión">
              <IconButton
                onClick={handleRedirect}
                sx={{ padding: 0, "&:hover": { opacity: 0.8 } }}
              >
                <LogouIcon
                  sx={{
                    color: "red",
                    fontSize: isMobile ? "20px" : "25px", // Icono más pequeño en móviles
                  }}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
