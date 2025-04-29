import React, { useState, useRef } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

import { useNavigate, useLocation } from "react-router-dom";

import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';


import { useUser } from "../Components/UserContext";
import { color } from "../Components/color";
import { styled } from '@mui/material/styles';
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: color.primary.azul,
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}));



const ProjectDrawer = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useUser();

  // Estados separados para cada menú
  const [openRepoeteria, setOpenReporteria] = useState(false);


  // Refs y estados para los menús flotantes
  const reporteriaAnchorRef = useRef(null);

  const [reporteriaMenuOpen, setReporteriaMenuOpen] = useState(false);


  const handelReporteriaMenuOpen = (event) => {
    if (!open) {
      setReporteriaMenuOpen(true);
    }
  };


  const handleMenuClose = () => {
    setReporteriaMenuOpen(false);
  };

  const handleItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => {
    // Decodifica tanto la ruta actual como la ruta que estamos comparando
    const decodedCurrentPath = decodeURIComponent(location.pathname);
    const decodedComparePath = decodeURIComponent(path);
    return decodedCurrentPath === decodedComparePath;
  };
  const isReporteriaActive =
    isActive("/Reportería/Listado_De_Acciones_Formativas") ||
    isActive("/Reportería/Listado_Participantes") ||
    isActive("/Reportería/Aldeas") ||
    isActive("/Reportería/Etnias") ||
    isActive("/Reportería/Área-Formación") ||
    isActive("/Reportería/Tipo-Educador") ||
    isActive("/Reportería/Discapacidades") ||
    isActive("/Reportería/Niveles-Académicos") ||
    isActive("/Reportería/Grados-Académicos") ||
    isActive("/Reportería/Nacionalidades")
    ;



  const getMenuItemStyles = (path, isParent = false, parentActive = false) => {
    const active = isParent ? parentActive : isActive(path);

    return {
      justifyContent: open ? "initial" : "center",
      px: 2.5,
      borderRadius: 2,
      mx: 1,
      backgroundColor: active ? color.primary.azul : "inherit",
      "&:hover": {
        backgroundColor: active
          ? "#88CFE0"
          : !open
            ? color.primary.azul
            : "rgba(0, 0, 0, 0.04)",
        "& .MuiListItemIcon-root, & .MuiListItemText-root": {
          color: active || !open ? "white" : "inherit",
        },
      },
      "& .MuiListItemIcon-root": {
        color: active ? "white" : "inherit",
      },
      "& .MuiListItemText-root": {
        color: active ? "white" : "inherit",
      },
    };
  };

  const MenuItem = ({ path, icon, text, onClick, isParent, parentActive, menuRef, onMouseEnter, onMouseLeave }) => (
    <ListItemButton
      onClick={onClick}
      sx={getMenuItemStyles(path, isParent, parentActive)}
      ref={menuRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
          "& .MuiSvgIcon-root": {
            fontSize: open ? "1.5rem" : "2rem",
          },
        }}
      >
        {icon}
      </ListItemIcon>
      {open && <ListItemText primary={text} />}
      {open && isParent === "reporteria" && (openRepoeteria ? <ExpandLess /> : <ExpandMore />)}

    </ListItemButton>
  );


  const tienePermisosModulo = (idModulo) => {
    return permissions?.some(p => p.idmodulo === idModulo && p.consultar);
  };

  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find(p => p.idobjeto === idobjeto);
    return permiso?.consultar === true;
  };


  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 225 : 75,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? 230 : 80,
          overflowX: "hidden",
          alignItems: open ? "" : "center",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          boxShadow: "none",
          border: "none",
        },
      }}
    >
      {/* Dashboard */}
      <List sx={{ marginTop: 12 }}>
        <MenuItem
          path="/dashboard"
          icon={<DashboardOutlinedIcon />}
          text="Dashboard"
          onClick={() => navigate("/dashboard")}
        />
      </List>

      {open && <Divider />}
      {/* Formación */}
      <List>

        <LightTooltip title="Nueva Formación" placement="right" disableHoverListener={open} >
          <div>
            <MenuItem
              path="/Lineamientos_De_Formación"
              icon={<PostAddOutlinedIcon />}
              text=" Nueva Formación"
              onClick={() => navigate("/Lineamientos_De_Formación")}
            />
          </div>
        </LightTooltip >

      </List>

      {open && <Divider />}
      {/* Investigación */}
      <List>
        <LightTooltip title="Nueva Investigación" placement="right" disableHoverListener={open}>
          <div>
            <MenuItem
              path="/Lineamientos_De_Investigación"
              icon={<ZoomInIcon />}
              text="Nueva Investigación"
              onClick={() => navigate("/Lineamientos_De_Investigación")}
            />
          </div>
        </LightTooltip>
      </List>


      <>
        {open && <Divider />}
        {/* Reportería con menú flotante */}
        <List>
          <MenuItem
            path="/Reportería"
            icon={<TextSnippetOutlinedIcon />}
            text="Reportería"
            onClick={() => (open ? setOpenReporteria(!openRepoeteria) : null)}
            isParent="reporteria"
            parentActive={isReporteriaActive}
            menuRef={reporteriaAnchorRef}
            onMouseEnter={handelReporteriaMenuOpen}
            onMouseLeave={handleMenuClose}
          />

          {open && (
            <Collapse in={openRepoeteria} timeout="auto" unmountOnExit sx={{ ml: 2.5 }}>
              <List component="div" disablePadding>


                <MenuItem
                  path="/Reportería/Listado_De_Acciones_Formativas"
                  icon={<TextSnippetOutlinedIcon />}
                  text={
                    <>
                      Listado de<br />Cap
                    </>
                  }
                  onClick={() => navigate("/Reportería/Listado_De_Acciones_Formativas")}
                />


                <MenuItem
                  path="/Reportería/Listado_Participantes"
                  icon={<TextSnippetOutlinedIcon />}
                  text={
                    <>
                      Listado de<br />Participantes
                    </>
                  }
                  onClick={() => navigate("/Reportería/Listado_Participantes")}
                />
              </List>
            </Collapse>
          )}

          {/* Menú flotante de Reportería */}
          <Menu
            anchorEl={reporteriaAnchorRef.current}
            open={reporteriaMenuOpen && !open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                marginTop: 35,
                ml: 10,
                boxShadow: 3,
                minWidth: 200,
              },
            }}
            disableAutoFocusItem
          >

            <MuiMenuItem
              onClick={() => handleItemClick("/Reportería/Listado_De_Acciones_Formativas")}

            >
              <ListItemIcon>
                <TextSnippetOutlinedIcon
                  fontSize="small"
                  color={isActive("/Reportería/Listado_De_Acciones_Formativas") ? color.primary.azul : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Listado de Acciones Formativas"
                primaryTypographyProps={{
                  color: isActive("/Reportería/Listado_De_Acciones_Formativas") ? color.primary.azul : "inherit",
                }}
              />
            </MuiMenuItem>


            <MuiMenuItem
              onClick={() => handleItemClick("/Reportería/Listado_Participantes")}

            >
              <ListItemIcon>
                <TextSnippetOutlinedIcon
                  fontSize="small"
                  color={isActive("/Reportería/Listado_Participantes") ? color.primary.azul : "inherit"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Listado de Participantes"
                primaryTypographyProps={{
                  color: isActive("/Reportería/Listado_Participantes") ? color.primary.azul : "inherit",
                }}
              />
            </MuiMenuItem>




          </Menu>
        </List>
      </>




      {open && <Divider />}
    </Drawer>
  );
};

export default ProjectDrawer;