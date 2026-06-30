import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/useAuth';

export const PrivateRoute = () => {
  const { isAuthenticated, isHydrated } = useAuth();
  if (!isHydrated) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
