import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes, fallbackRoute } from '@/router/routes';
import ProtectedRoute from '@/router/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import NotificationCenter from '@/components/feedback/NotificationCenter';
import { useToast } from '@/contexts/ToastContext';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const App = () => {
  const { toasts } = useToast();

  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<LoadingOverlay message="Cargando interfaz" />}>
          <Routes>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}
            <Route path={fallbackRoute.path} element={fallbackRoute.element} />
          </Routes>
        </Suspense>
      </AppShell>
      <NotificationCenter toasts={toasts} />
    </ErrorBoundary>
  );
};

export default App;
