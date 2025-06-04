import "./App.css";
import { useUser } from "./Components/UserContext";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignIn from "./Login/Sign-in";
import Dashboard from "./Dashboard/dashboard";

import LineamientosI from "./Actividad/Investigación/Lineamientos";
import LineamientosM from "./Actividad/Investigación/ModificarLineamientos";
import Investigación from "./Actividad/Investigación/Investigación";
import ActualizarInvestigación from "./Actividad/Investigación/ModificarInvestigación";

import LineamientosF from "./Actividad/Formación/LineamientosF";
import LineamientosFormacionM from "./Actividad/Formación/ModificarLineamientosF";
import Formacion from "./Actividad/Formación/Formacion";
import ActualizarFormacion from "./Actividad/Formación/ModificarFormación";

import Participantes from "./Participantes/FormularioParticipantes";
import FormularioExterno from "./Participantes/FormularioExterno";
import ModificarParticipante from "./Participantes/ModificarParticipantes";

import ListadoInvestigación from "./Reportería/ListadoInvestigaciones";
import ListadoInvestigadores from "./Reportería/ListadoInvestigadores";
import ListadoParticipantes from "./Reportería/ListadoParticipantes";
import ListadoActividad from "./Reportería/ListadoCapacitaciones";

import Usuarios from "./Seguridad/Usuarios/TablaUsuarios";
import RegistroUsuario from "./Seguridad/Usuarios/Usuarios";
import ModificarUsuario from "./Seguridad/Usuarios/ModificarUsuario";

import Permisos from "./Seguridad/Permisos/TablaPermisos";
import RegistroRol from "./Seguridad/Permisos/RolyPermisos";
import ModificarRol from "./Seguridad/Permisos/ModificarRolyPermisos";

import { UserProvider } from "./Components/UserContext";
import axios from "axios";
import Swal from "sweetalert2";

import TablaFormacion from "./Actividad/Formación/TablaFormacion";
import TablaInvestigacion from "./Actividad/Investigación/TablaInvestigación";

import { PERMISSIONS } from "./Components/permissions";
import PreInscripcion from "./Participantes/Pre-Inscripcion";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    const verifyAuth = () => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      const token = localStorage.getItem("token");

      if (!isAuthenticated || !token) {
        localStorage.removeItem("user");
        navigate("/", { replace: true });
        return false;
      }
      return true;
    };

    if (!verifyAuth()) {
      return;
    }

    setIsVerified(true);

    // Verificar validez del token cada 10 segundos
    const checkSessionValidity = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.valid) {
          logoutAndRedirect();
        }
      } catch (error) {
        logoutAndRedirect();
      }
    };

    const logoutAndRedirect = () => {
      localStorage.clear();
      sessionStorage.clear();
      Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        //text: "Tu sesión ha sido cerrada porque se inició desde otro dispositivo.",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    };

    const interval = setInterval(checkSessionValidity, 20000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!isVerified) {
    return null; // O un componente de carga
  }

  return <Outlet />;
};

const PermissionValidator = ({ children, requiredPermission }) => {
  const { permissions } = useUser();

  const hasPermission = (idobjeto, action = "consultar") => {
    const permiso = permissions?.find((p) => p.idobjeto === idobjeto);
    return permiso?.[action] === true;
  };

  if (!hasPermission(requiredPermission)) {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "No tienes permisos para acceder a esta sección",
      timer: 3000,
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route
            path="/Formulario-De-Participante/:id"
            element={<FormularioExterno />}
          />

          <Route
            path="/Formulario-De-Inscripción"
            element={<PreInscripcion />}
          />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Investigación */}
            <Route
              path="/Listado_De_Investigaciones"
              element={<TablaInvestigacion />}
            />
            <Route
              path="/Lineamientos_De_Investigación"
              element={<LineamientosI />}
            />
            <Route
              path="/Actualizar_Lineamientos_De_Investigación/:id"
              element={<LineamientosM />}
            />
            <Route path="/Investigación" element={<Investigación />} />
            <Route
              path="/Actualizar_Investigación/:id"
              element={<ActualizarInvestigación />}
            />
            {/* Formación */}
            <Route
              path="/Listado_De_Formaciones"
              element={<TablaFormacion />}
            />
            <Route
              path="/Lineamientos_De_Formación"
              element={<LineamientosF />}
            />
            <Route
              path="/Actualizar_Lineamientos_De_Formación/:id"
              element={<LineamientosFormacionM />}
            />
            <Route path="/Formación" element={<Formacion />} />
            <Route
              path="/Actualizar_Formación/:id"
              element={<ActualizarFormacion />}
            />
            {/* Participantes */}
            <Route path="/Participantes" element={<Participantes />} />
            <Route
              path="/Modificar_Participante/:id"
              element={<ModificarParticipante />}
            />
            {/* Reportería */}
            <Route
              path="/Reportería/Listado_Participantes"
              element={<ListadoParticipantes />}
            />
            <Route
              path="/Reportería/Listado_Investigadores"
              element={<ListadoInvestigadores />}
            />
            <Route
              path="/Reportería/Listado_De_Acciones_Formativas"
              element={<ListadoActividad />}
            />
            <Route
              path="/Reportería/Listado_De_Investigaciones"
              element={<ListadoInvestigación />}
            />
            {/* Seguridad */}
            <Route path="/Seguridad/Usuarios" element={<Usuarios />} />
            <Route
              path="/Seguridad/Registrar_Usuario"
              element={<RegistroUsuario />}
            />
            <Route
              path="/Seguridad/Actualizar_Usuario/:id"
              element={<ModificarUsuario />}
            />
            <Route path="/Seguridad/Roles-y-Permisos" element={<Permisos />} />
            <Route
              path="/Seguridad/Registrar_Rol-y-Permisos"
              element={<RegistroRol />}
            />
            <Route
              path="/Seguridad/Actualizar_Rol-y-Permisos/:id"
              element={<ModificarRol />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
