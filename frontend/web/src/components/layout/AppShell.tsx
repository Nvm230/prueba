import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PageContainer from './PageContainer';
import { useAuth } from '@/hooks/useAuth';

const AUTH_ROUTES = ['/login', '/register'];

const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isAuthRoute = useMemo(() => AUTH_ROUTES.includes(location.pathname), [location.pathname]);

  if (!user && isAuthRoute) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">{children}</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
};

export default AppShell;
