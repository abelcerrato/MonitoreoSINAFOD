import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  Button,
  Toolbar,
  IconButton,
  Divider,
  useMediaQuery,
  Menu, MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { color } from "../Components/color";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";

const ProjectDrawer = () => {
  const navigate = useNavigate();
  const [openD, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    setAnchorEl(null);
    if (path) navigate(path);
  };
  const toggleDrawer = () => {
    setOpen(!openD);
  };

  const NuevaActividad = () => {
    navigate("/Formulario");
    setOpen(false); // Cierra el menú después de navegar
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "fixed", top: 20, left: 5, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: isMobile ? "auto" : 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 244 },
        }}
      >
        <Toolbar />
        <List>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={NuevaActividad}
            size="large"
            sx={{ margin: 2, color: color.primary.azul }}
          >
            Nueva Actividad
          </Button>
          <Divider />

          <Button
            variant="text"
            startIcon={<DescriptionIcon />}
            onClick={handleClick}
            size="large"
            sx={{ margin: 2, color:  color.primary.azul  }} // Usa tu variable de color si es necesario
          >
            Reportería
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
            <MenuItem onClick={() => handleClose("/Listado_Capacitaciones")}>
              Listado de Capacitaciones
            </MenuItem> 
            <MenuItem onClick={() => handleClose("/Listado_Participantes")}>
              Listado de Participantes
            </MenuItem>
           
          </Menu>
        </List>
      </Drawer>
    </>
  );
};

export default ProjectDrawer;