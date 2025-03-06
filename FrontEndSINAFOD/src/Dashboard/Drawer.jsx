import React from "react";
import { Drawer, List, ListItem, Button, Toolbar, IconButton, Divider } from "@mui/material";
import { color } from "../Components/color";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ProjectDrawer = () => {
  const navigate = useNavigate();
  const NuevaActividad = () => {
    navigate("/Formulario");
  };
 
  return (
    <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0 }}>
      <Toolbar />
      <List sx={{ width: 250,top:20 }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => NuevaActividad()}
          size="large"
          sx={{ margin: 2, color: color.primary.azul, }}
        >
          Nueva Actividad
        </Button>
       {/*  <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => Participante()}
          size="large"
          sx={{ margin: 2, color: color.primary.azul, }}
        >
          Participantes
        </Button> */}
        <Divider />

      </List>
    </Drawer>
  );
};

export default ProjectDrawer;
