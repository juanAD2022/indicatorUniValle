import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@page/Login/Login.tsx';
import { Dashboard } from '@page/Dashboard/Dashboard.tsx';
import { PrivateRoute } from '@components/PrivateRoute/PrivateRoute.tsx';
import { ForgotPassword } from '@page/ForgotPassword/ForgotPassword.tsx';
import { ResetPassword } from '@page/ResetPassword/ResetPassword.tsx';
import { GestionDirectiva } from '@page/GestionDirectiva/GestionDirectiva.tsx';
import { Pregrado } from '@page/Pregrado/Pregrado.tsx';
import { Posgrado } from '@page/Posgrado/Posgrado.tsx';
import { Laboratorio } from '@page/Laboratorio/Laboratorio.tsx';
import { GrupoInferir } from '@page/GrupoInferir/GrupoInferir.tsx';
import { ExtensionEducacion } from '@page/ExtensionEducacion/ExtensionEducacion.tsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gestion-directiva" element={<GestionDirectiva />} />
        <Route path="/pregrado" element={<Pregrado />} />
        <Route path="/posgrado" element={<Posgrado />} />
        <Route path="/laboratorio" element={<Laboratorio />} />
        <Route path="/grupo-inferir" element={<GrupoInferir />} />
        <Route path="/extension-educacion" element={<ExtensionEducacion />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
