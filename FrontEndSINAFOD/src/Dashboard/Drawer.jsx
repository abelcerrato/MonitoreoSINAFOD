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
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";

import { useNavigate, useLocation } from "react-router-dom";

import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";

import { useUser } from "../Components/UserContext";
import { color } from "../Components/color";
import { styled } from "@mui/material/styles";

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
  const [openSeguridad, setOpenSeguridad] = useState(false);

  // Refs y estados para los menús flotantes
  const reporteriaAnchorRef = useRef(null);
  const seguridadAnchorRef = useRef(null);
  const [reporteriaMenuOpen, setReporteriaMenuOpen] = useState(false);
  const [seguridadMenuOpen, setSeguridadMenuOpen] = useState(false);

  const handelReporteriaMenuOpen = (event) => {
    if (!open && reporteriaAnchorRef.current) {
      setReporteriaMenuOpen(true);
    }
  };

  const handleSeguridadMenuOpen = (event) => {
    if (!open && seguridadAnchorRef.current) {
      setSeguridadMenuOpen(true);
    }
  };

  const handleMenuClose = () => {
    setReporteriaMenuOpen(false);
  };

  const handleMenuCloseSegu = () => {
    setSeguridadMenuOpen(false);
  };
  const handleItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => {
    // Decodifica tanto la ruta actual como la ruta que estamos comparando
    const decodedCurrentPath = decodeURIComponent(location.pathname);
    const decodedComparePath = decodeURIComponent(path);
    return decodedCurrentPath.startsWith(decodedComparePath);
  };

  const isFormacionActive =
    isActive("/Listado_De_Acciones_Formativas") ||
    isActive("/Lineamientos_De_La_Acción_Formativa") ||
    isActive("/Crear_Acción_Formativa") ||
    isActive(`/Actualizar_Acción_Formativa`) ||
    isActive(`/Actualizar_Lineamientos_De_La_Acción_Formativa`);

  const isReporteriaActive =
    isActive("/Reportería/Listado_De_Acciones_Formativas") ||
    isActive("/Reportería/Listado_Participantes") ||
    isActive("/Reportería/Listado_De_Investigaciones") ||
    isActive("/Reportería/Listado_Investigadores");

  const isSeguridadActive =
    isActive("/Seguridad/Usuarios") || isActive("/Seguridad/Roles-y-Permisos");

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

  const MenuItem = ({
    path,
    icon,
    text,
    onClick,
    isParent,
    parentActive,
    menuRef,
    onMouseEnter,
    onMouseLeave,
  }) => (
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
      {open &&
        isParent === "reporteria" &&
        (openRepoeteria ? <ExpandLess /> : <ExpandMore />)}
      {open &&
        isParent === "seguridad" &&
        (openRepoeteria ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
  );

  const tienePermisosModulo = (idModulo) => {
    return permissions?.some((p) => p.idmodulo === idModulo && p.consultar);
  };

  const tienePermiso = (idobjeto) => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.consultar === true;
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 235 : 75,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? 265 : 80,
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
      {tienePermisosModulo(2) && (
        <>
          {open && <Divider />}
          {/* Acciones_Formativas */}
          {tienePermiso(2) && (
            <List>
              <LightTooltip
                title="Nueva Acción Formativa"
                placement="right"
                disableHoverListener={open}
              >
                <div>
                  <MenuItem
                    path="/Listado_De_Acciones_Formativas"
                    icon={<PostAddOutlinedIcon />}
                    text=" Nueva Acción Formativa"
                    onClick={() => navigate("/Listado_De_Acciones_Formativas")}
                    isParent={true}
                    parentActive={isFormacionActive}
                  />
                </div>
              </LightTooltip>
            </List>
          )}
        </>
      )}

      {tienePermisosModulo(1) && (
        <>
          {open && <Divider />}
          {/* Investigación */}
          {tienePermiso(1) && (
            <List>
              <LightTooltip
                title="Nueva Investigación"
                placement="right"
                disableHoverListener={open}
              >
                <div>
                  <MenuItem
                    path="/Listado_De_Investigaciones"
                    icon={<ZoomInIcon />}
                    text="Nueva Investigación"
                    onClick={() => navigate("/Listado_De_Investigaciones")}
                  />
                </div>
              </LightTooltip>
            </List>
          )}
        </>
      )}

      {tienePermisosModulo(3) && (
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
              <Collapse
                in={openRepoeteria}
                timeout="auto"
                unmountOnExit
                sx={{ ml: 2.5 }}
              >
                <List component="div" disablePadding>
                  {tienePermiso(4) && (
                    <MenuItem
                      path="/Reportería/Listado_De_Acciones_Formativas"
                      icon={<TextSnippetOutlinedIcon />}
                      text={
                        <>
                          Listado de
                          <br />
                          Acciones Formativas
                        </>
                      }
                      onClick={() =>
                        navigate("/Reportería/Listado_De_Acciones_Formativas")
                      }
                    />
                  )}
                  {tienePermiso(3) && (
                    <MenuItem
                      path="/Reportería/Listado_Participantes"
                      icon={<TextSnippetOutlinedIcon />}
                      text={
                        <>
                          Listado de
                          <br />
                          Participantes
                        </>
                      }
                      onClick={() =>
                        navigate("/Reportería/Listado_Participantes")
                      }
                    />
                  )}
                  {tienePermiso(7) && (
                    <MenuItem
                      path="/Reportería/Listado_De_Investigaciones"
                      icon={<TextSnippetOutlinedIcon />}
                      text={
                        <>
                          Listado de
                          <br />
                          Investigaciones
                        </>
                      }
                      onClick={() =>
                        navigate("/Reportería/Listado_De_Investigaciones")
                      }
                    />
                  )}

                  {tienePermiso(8) && (
                    <MenuItem
                      path="/Reportería/Listado_Investigadores"
                      icon={<TextSnippetOutlinedIcon />}
                      text={
                        <>
                          Listado de
                          <br />
                          Investigadores
                        </>
                      }
                      onClick={() =>
                        navigate("/Reportería/Listado_Investigadores")
                      }
                    />
                  )}
                </List>
              </Collapse>
            )}

            {/* Menú flotante de Reportería */}
            <Menu
              anchorEl={() => reporteriaAnchorRef.current}
              open={reporteriaMenuOpen && !open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                sx: {
                  ml: 3,
                  boxShadow: 3,
                  minWidth: 200,
                },
              }}
              disableAutoFocusItem
            >
              {tienePermiso(4) && (
                <MuiMenuItem
                  onClick={() =>
                    handleItemClick(
                      "/Reportería/Listado_De_Acciones_Formativas"
                    )
                  }
                >
                  <ListItemIcon>
                    <TextSnippetOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Reportería/Listado_De_Acciones_Formativas")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Listado de Acciones Formativas"
                    primaryTypographyProps={{
                      color: isActive(
                        "/Reportería/Listado_De_Acciones_Formativas"
                      )
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}
              {tienePermiso(3) && (
                <MuiMenuItem
                  onClick={() =>
                    handleItemClick("/Reportería/Listado_Participantes")
                  }
                >
                  <ListItemIcon>
                    <TextSnippetOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Reportería/Listado_Participantes")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Listado de Participantes"
                    primaryTypographyProps={{
                      color: isActive("/Reportería/Listado_Participantes")
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}
              {tienePermiso(7) && (
                <MuiMenuItem
                  onClick={() =>
                    handleItemClick("/Reportería/Listado_De_Investigaciones")
                  }
                >
                  <ListItemIcon>
                    <TextSnippetOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Reportería/Listado_De_Investigaciones")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Listado de Investigaciones"
                    primaryTypographyProps={{
                      color: isActive("/Reportería/Listado_De_Investigaciones")
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}
              {tienePermiso(8) && (
                <MuiMenuItem
                  onClick={() =>
                    handleItemClick("/Reportería/Listado_Investigadores")
                  }
                >
                  <ListItemIcon>
                    <TextSnippetOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Reportería/Listado_Investigadores")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Listado de Investigadores"
                    primaryTypographyProps={{
                      color: isActive("/Reportería/Listado_Investigadores")
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}
            </Menu>
          </List>
        </>
      )}

      {tienePermisosModulo(4) && (
        <>
          {open && <Divider />}
          {/* Seguridad con menú flotante */}
          <List>
            <MenuItem
              path="/seguridad"
              icon={<AdminPanelSettingsOutlinedIcon />}
              text="Seguridad"
              onClick={() => (open ? setOpenSeguridad(!openSeguridad) : null)}
              isParent="seguridad"
              parentActive={isSeguridadActive}
              menuRef={seguridadAnchorRef}
              onMouseEnter={handleSeguridadMenuOpen}
              onMouseLeave={handleMenuClose}
            />

            {open && (
              <Collapse
                in={openSeguridad}
                timeout="auto"
                unmountOnExit
                sx={{ ml: 2.5 }}
              >
                <List component="div" disablePadding>
                  {tienePermiso(5) && (
                    <MenuItem
                      path="/Usuarios"
                      icon={<PeopleAltOutlinedIcon />}
                      text="Usuarios"
                      onClick={() => navigate("/Seguridad/Usuarios")}
                    />
                  )}
                  {tienePermiso(5) && (
                    <MenuItem
                      path="/Roles-y-Permisos"
                      icon={<HttpsOutlinedIcon />}
                      text="Roles y Permisos"
                      onClick={() => navigate("/Seguridad/Roles-y-Permisos")}
                    />
                  )}
                </List>
              </Collapse>
            )}

            {/* Menú flotante de Seguridad */}
            <Menu
              anchorEl={() => seguridadAnchorRef.current}
              open={seguridadMenuOpen && !open}
              onClose={handleMenuCloseSegu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                sx: {
                  ml: 3,
                  boxShadow: 3,
                  minWidth: 200,
                },
              }}
              disableAutoFocusItem
            >
              {tienePermiso(5) && (
                <MuiMenuItem
                  onClick={() => handleItemClick("/Seguridad/Usuarios")}
                  sx={{
                    "&:hover": {
                      backgroundColor: isActive("/Seguridad/Usuarios")
                        ? "#88CFE0"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <PeopleAltOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Seguridad/Usuarios")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usuarios"
                    primaryTypographyProps={{
                      color: isActive("/Seguridad/Usuarios")
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}

              {tienePermiso(6) && (
                <MuiMenuItem
                  onClick={() => handleItemClick("/Seguridad/Roles-y-Permisos")}
                  sx={{
                    "&:hover": {
                      backgroundColor: isActive("/Seguridad/Roles-y-Permisos")
                        ? "#88CFE0"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <HttpsOutlinedIcon
                      fontSize="small"
                      color={
                        isActive("/Seguridad/Roles-y-Permisos")
                          ? color.primary.azul
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Roles y Permisos"
                    primaryTypographyProps={{
                      color: isActive("/Seguridad/Roles-y-Permisos")
                        ? color.primary.azul
                        : "inherit",
                    }}
                  />
                </MuiMenuItem>
              )}
            </Menu>
          </List>
        </>
      )}
    </Drawer>
  );
};

export default ProjectDrawer;
