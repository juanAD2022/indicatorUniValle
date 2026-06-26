import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../page/Login/Login.tsx';
import { Dashboard } from '../page/Dashboard/Dashboard.tsx';
import { PrivateRoute } from '../components/PrivateRoute/PrivateRoute.tsx';
import { ForgotPassword } from '../page/ForgotPassword/ForgotPassword.tsx';
import { ResetPassword } from '../page/ResetPassword/ResetPassword.tsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
