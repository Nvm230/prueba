import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes, fallbackRoute } from '@/router/routes';
import ProtectedRoute from '@/router/ProtectedRoute';
import PublicRoute from '@/router/PublicRoute';
import AppShell from '@/components/layout/AppShell';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import NotificationCenter from '@/components/feedback/NotificationCenter';
import { useToast } from '@/contexts/ToastContext';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { toasts } = useToast();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingOverlay message="Cargando interfaz" />}>
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PublicRoute>{route.element}</PublicRoute>}
            />
          ))}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AppShell>
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                </AppShell>
              }
            />
          ))}
          <Route path={fallbackRoute.path} element={fallbackRoute.element} />
        </Routes>
      </Suspense>
      <NotificationCenter toasts={toasts} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
};

export default App;
