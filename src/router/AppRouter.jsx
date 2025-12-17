// src/router/AppRouter.jsx (CÓDIGO CORREGIDO Y FINAL)

import { Route, Routes, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { LandingPageLayout } from "../pages/landing-page/LandingPageLayout";
import { ContactPage } from "../pages/landing-page/views/ContactPage";
import { HomePage } from "../pages/landing-page/views/HomePage";
import { ServiciosPage } from "../pages/landing-page/views/ServiciosPage";
import { PanelCitaLayout } from "../pages/panel-cita/PanelCitaLayout";
import { InicioPanelCita } from "../pages/panel-cita/views/InicioPanelCita";
import { MisCitas } from "../pages/panel-cita/views/MisCitas";
import { NuevaCita } from "../pages/panel-cita/views/NuevaCita";

import { ProtectedRoute } from "../components/ProtectedRoute";


// ✅ IMPORTS NECESARIOS para el Admin
import { AdminLayout } from "../pages/admin/AdminLayout"; 
import { PanelAdmin } from "../pages/admin/PanelAdmin";
import { ConfirmarCita } from "../pages/ConfirmarCita";
import { AuthCallback } from "../pages/auth/AuthCallBack"; 


import { EditarAdmin } from "../pages/admin/EditarAdmin"; 


export const AppRouter = () => {
  return (
    <Routes>
      {/* ========== RUTAS PÚBLICAS (Landing Page) ========== */}
      <Route path="/" element={<LandingPageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
      </Route>

      {/* ========== RUTA DE AUTENTICACIÓN ========== */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* ========== PÁGINA DE CONFIRMACIÓN (Pública con token) ========== */}
      <Route path="/confirmar-cita" element={<ConfirmarCita />} />

      {/* ========================================== */}
      {/* ✅ PANEL ADMIN (Protegido y con AdminLayout) */}
      {/* ========================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout /> 
          </ProtectedRoute>
        }
      >
        {/* RUTA 1: Inicio */}
        <Route index element={<PanelAdmin />} /> 
        
        {/* RUTA 2: Editar Catálogos/Horarios */}
        <Route path="editar-cita" element={<EditarAdmin />} /> 

      </Route>
      {/* ========== RUTAS PROTEGIDAS (Panel de Citas) ========== */}
      <Route
        path="/panel-citas"
        element={
          <ProtectedRoute>
            <PanelCitaLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InicioPanelCita />} />
        <Route path="mis-citas" element={<MisCitas />} />
        <Route path="nueva-cita" element={<NuevaCita />} />
        <Route path="help" element={<h1>Centro de Ayuda</h1>} />
      </Route>

      {/* ========== REDIRECCIÓN PARA RUTAS NO ENCONTRADAS ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};