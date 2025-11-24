import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/data/LoadingOverlay';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  // Redirigir al perfil del usuario actual
  return <Navigate to={`/profile/${user.id}`} replace />;
};

export default ProfilePage;
