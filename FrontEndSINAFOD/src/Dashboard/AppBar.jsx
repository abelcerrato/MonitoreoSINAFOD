import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { color } from "../Components/color";
import LogouIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";
import Logo from "../Components/img/Logo_DGDP.png"
const AppBarComponent = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleRedirect = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    navigate("/", { replace: true }); // Reemplaza la entrada en el historial
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: color.primary.azul,
        height: 80,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between", // Alinea los elementos de manera que queden en los extremos
          alignItems: "center",
          paddingX: 4,
          top: 20,
        }}
      >
        {/* Texto "Registro de Monitoreo SINAFOD" alineado a la izquierda */}
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          sx={{ flexGrow: 1 }}
        >
          <div style={{
            width: "240px",
            height: "70px",
            background: "white",
            padding: 5,
            marginRight: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: -24,
            marginLeft: -25,
            cursor: "pointer"
          }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "90%", height: "90%", objectFit: "contain" }}
              onClick={() => navigate("/dashboard")}
            />
          </div>

          {/* 
          <Typography
            variant="h3"
            noWrap
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            SINAFOD
          </Typography> */}
        </Grid>
        {/* Grid para el nombre de usuario y el ícono de cerrar sesión */}
        <Grid
          container
          alignItems="center"
          spacing={4}
          sx={{ justifyContent: "flex-end" }}
        >
          {/* Nombre de usuario */}
          <Grid item>
            <Typography variant="h6" noWrap>
              {user}
            </Typography>
          </Grid>

          {/* Ícono de cerrar sesión */}
          <Grid item>
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
