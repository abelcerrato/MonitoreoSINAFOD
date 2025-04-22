
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/dashboard';
import Formulario from './Actividad/Investigación/Investigación';
import Participantes from './Participantes/FormularioParticipantes';
import ModificarActividad from './Actividad/ModificarActividad'
import ModificarParticipante from './Participantes/ModificarParticipantes'
import ListadoParticipantes from './Reportería/ListadoParticipantes'
import ListadoActividad from './Reportería/ListadoCapacitaciones'
import { UserProvider } from './Components/UserContext';


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated"); // Ahora verificamos sessionStorage

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("user"); // Borra datos si la sesión es inválida
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};



function App() {




  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/Formulario" element={<ProtectedRoute><Formulario /></ProtectedRoute>} />
          <Route path="/Participantes" element={<ProtectedRoute><Participantes /></ProtectedRoute>} />
          <Route path="/Modificar_Actividad/:id" element={<ProtectedRoute><ModificarActividad /></ProtectedRoute>} />
          <Route path="/Modificar_Participante/:id" element={<ProtectedRoute><ModificarParticipante /></ProtectedRoute>} />
          <Route path="/Listado_Participantes" element={<ProtectedRoute><ListadoParticipantes /></ProtectedRoute>} />
          <Route path="/Listado_Capacitaciones" element={<ProtectedRoute><ListadoActividad /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>

    </UserProvider>

  );
}

export default App;
