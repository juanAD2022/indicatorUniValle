import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../page/Login/Login.tsx';
import { Dashboard } from '../page/Dashboard/Dashboard.tsx';
import { PrivateRoute } from '../components/PrivateRoute/PrivateRoute.tsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
