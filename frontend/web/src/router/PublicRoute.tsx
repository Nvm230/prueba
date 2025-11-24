import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/data/LoadingOverlay';

/**
 * Componente que protege rutas públicas (login, register)
 * Si el usuario ya está autenticado, lo redirige al dashboard
 */
const PublicRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <LoadingOverlay message="Validando sesión" />;
  }

  if (user) {
    // Si el usuario ya está logueado, redirigir al dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;



