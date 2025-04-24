
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/dashboard';
// import Formulario from './Actividad/Investigación/Investigación';
import LineamientosI from './Actividad/Investigación/Lineamientos';
import LineamientosM from './Actividad/Investigación/ModificarLineamientos';
import Investigación from './Actividad/Investigación/Investigación';
import ActualizarInvestigación from './Actividad/Investigación/ModificarInvestigación';


import LineamientosF from './Actividad/Formación/LineamientosF';
import LineamientosFormacionM from './Actividad/Formación/ModificarLineamientosF';
import Formacion from './Actividad/Formación/Formacion';
import ActualizarFormacion from './Actividad/Formación/ModificarFormación'


import Participantes from './Participantes/FormularioParticipantes';
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

          <Route path="/Lineamientos_De_Investigación" element={<ProtectedRoute><LineamientosI /></ProtectedRoute>} />
          <Route path="/Actualizar_Lineamientos_De_Investigación/:id" element={<ProtectedRoute><LineamientosM /></ProtectedRoute>} />
          <Route path="/Investigación" element={<ProtectedRoute><Investigación /></ProtectedRoute>} />
          <Route path="/Actualizar_Investigación/:id" element={<ProtectedRoute><ActualizarInvestigación /></ProtectedRoute>} />





          <Route path="/Lineamientos_De_Formación" element={<ProtectedRoute><LineamientosF /></ProtectedRoute>} />
          <Route path="/Actualizar_Lineamientos_De_Formación/:id" element={<ProtectedRoute><LineamientosFormacionM /></ProtectedRoute>} />
          <Route path="/Formación" element={<ProtectedRoute><Formacion /></ProtectedRoute>} />
          <Route path="/Actualizar_Formación/:id" element={<ProtectedRoute><ActualizarFormacion /></ProtectedRoute>} />



          <Route path="/Participantes" element={<ProtectedRoute><Participantes /></ProtectedRoute>} />
          <Route path="/Modificar_Participante/:id" element={<ProtectedRoute><ModificarParticipante /></ProtectedRoute>} />
         
          <Route path="/Reportería/Listado_Participantes" element={<ProtectedRoute><ListadoParticipantes /></ProtectedRoute>} />
          <Route path="/Reportería/Listado_Capacitaciones" element={<ProtectedRoute><ListadoActividad /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>

    </UserProvider>

  );
}

export default App;
