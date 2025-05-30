import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
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
  // Removí openDrawer ya que parece redundante
  const navigate = useNavigate();
  const { user } = useUser();

  const handleRedirect = async () => {
    try {
      // Verifica que user.id exista
      if (!user?.id) {
        console.error("No se encontró el ID del usuario");
        throw new Error("Usuario no identificado");
      }

      // Llama al endpoint sin token (si no es necesario)
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/cierreSesion/${user.id}`
      );
      console.log("Respuesta del backend:", response.data); // Para depuración

      // Limpieza y redirección
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data, // Respuesta del backend si hay error HTTP
      });
      // Fuerza la limpieza y redirección
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        /*      width: open ? "calc(100% - 250px)" : "100%", // Usamos solo 'open'
        ml: open ? "250px" : 0, */
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: color.primary.azul,
        boxShadow: "none",
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: 4,
        }}
      >
        {/* Logo y Botón de Toggle */}
        <Grid container alignItems="center" justifyContent="flex-start">
          <div
            style={{
              width: "260px",
              height: "90px",

              background: "white",
              padding: 5,
              display: "flex",
              justifyContent: "center",
              marginLeft: -33,
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

          {/* Botón de Toggle - Versión Simplificada */}
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: "white",
              marginRight: 2,
              backgroundColor: color.primary.azul,
              borderRadius: 2,
              width: 40,
              height: 40,
              transition: "all 0.3s ease", // Transición suave
              "&:hover": {
                backgroundColor: color.primary.rojo,
                transform: "scale(1.05)", // Efecto de escala al hacer hover
              },
              "& .MuiSvgIcon-root": {
                fontSize: "1.5rem",
                transition: "transform 0.3s ease",
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
        </Grid>

        {/* Usuario y Cerrar Sesión */}
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          sx={{ width: "auto" }}
        >
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" noWrap sx={{ color: "white" }}>
              {user.usuario}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Tooltip title="Cerrar Sesión">
              <IconButton onClick={handleRedirect} sx={{ padding: 0 }}>
                <LogouIcon sx={{ color: "red", fontSize: "25px" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
