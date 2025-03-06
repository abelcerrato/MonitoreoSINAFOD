import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBarComponent from "./AppBar";
import ProjectDrawer from "./Drawer";
import React from "react";
import TablaActividad from "../Actividad/TablaAcividad";

const Dashboard = ({ children }) => {
  const location = useLocation();

  const showTablaActividad =
    location.pathname === "/dashboard";

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBarComponent />
      <ProjectDrawer />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 15, overflowY: "auto" }}
      >
        {children}
        {showTablaActividad && <TablaActividad />}

        <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 5, py: 2 }}
      >
        {"Copyright © "}

        Propiedad intelectual del Consejo Nacional de Educación
      </Typography>
      </Box>
      
    </Box>
  );
};

export default Dashboard;
