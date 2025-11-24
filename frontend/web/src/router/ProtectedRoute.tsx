import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/data/LoadingOverlay';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticating } = useAuth();
  const location = useLocation();

  if (isAuthenticating) {
    return <LoadingOverlay message="Validando sesión" />;
  }

  if (!user) {
    // Si está intentando acceder a la raíz, redirigir a landing, sino a login
    if (location.pathname === '/') {
      return <Navigate to="/landing" replace />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
