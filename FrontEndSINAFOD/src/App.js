
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/dashboard';

import LineamientosI from './Actividad/Investigación/Lineamientos';
import LineamientosM from './Actividad/Investigación/ModificarLineamientos';
import Investigación from './Actividad/Investigación/Investigación';
import ActualizarInvestigación from './Actividad/Investigación/ModificarInvestigación';


import LineamientosF from './Actividad/Formación/LineamientosF';
import LineamientosFormacionM from './Actividad/Formación/ModificarLineamientosF';
import Formacion from './Actividad/Formación/Formacion';
import ActualizarFormacion from './Actividad/Formación/ModificarFormación';


import Participantes from './Participantes/FormularioParticipantes';
import ModificarParticipante from './Participantes/ModificarParticipantes';
import ListadoParticipantes from './Reportería/ListadoParticipantes';
import ListadoActividad from './Reportería/ListadoCapacitaciones';

import Usuarios from './Seguridad/Usuarios/TablaUsuarios';
import RegistroUsuario from './Seguridad/Usuarios/Usuarios';
import ModificarUsuario from './Seguridad/Usuarios/ModificarUsuario';

import Permisos from './Seguridad/Permisos/TablaPermisos';
import RegistroRol from './Seguridad/Permisos/RolyPermisos';
import ModificarRol from './Seguridad/Permisos/ModificarRolyPermisos';

import { UserProvider } from './Components/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';


const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  React.useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Verificar validez del token cada 10 segundos
  React.useEffect(() => {
    const checkSessionValidity = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        text: "Tu sesión ha sido cerrada porque se inició desde otro dispositivo.",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    };

    const interval = setInterval(checkSessionValidity, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : null;
};


function App() {




  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />



          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/Lineamientos_De_Investigación" element={<LineamientosI />} />
            <Route path="/Actualizar_Lineamientos_De_Investigación/:id" element={<LineamientosM />} />
            <Route path="/Investigación" element={<Investigación />} />
            <Route path="/Actualizar_Investigación/:id" element={<ActualizarInvestigación />} />





            <Route path="/Lineamientos_De_Formación" element={<LineamientosF />} />
            <Route path="/Actualizar_Lineamientos_De_Formación/:id" element={<LineamientosFormacionM />} />
            <Route path="/Formación" element={<Formacion />} />
            <Route path="/Actualizar_Formación/:id" element={<ActualizarFormacion />} />



            <Route path="/Participantes" element={<Participantes />} />
            <Route path="/Modificar_Participante/:id" element={<ModificarParticipante />} />

            <Route path="/Reportería/Listado_Participantes" element={<ListadoParticipantes />} />
            <Route path="/Reportería/Listado_De_Acciones_Formativas" element={<ListadoActividad />} />



            <Route path="/Seguridad/Usuarios" element={<Usuarios />} />
            <Route path="/Seguridad/Registrar_Usuario" element={<RegistroUsuario />} />
            <Route path="/Seguridad/Actualizar_Usuario/:id" element={<ModificarUsuario />} />

            <Route path="/Seguridad/Roles-y-Permisos" element={<Permisos />} />
            <Route path="/Seguridad/Registrar_Rol-y-Permisos" element={<RegistroRol />} />
            <Route path="/Seguridad/Actualizar_Rol-y-Permisos/:id" element={<ModificarRol />} />
          </Route>


        </Routes>
      </BrowserRouter>

    </UserProvider>

  );
}

export default App;
