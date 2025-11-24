import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary captured an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-error-100 dark:bg-error-900/30">
                <ExclamationTriangleIcon className="h-8 w-8 text-error-600 dark:text-error-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Algo salió mal</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {this.state.error?.message || 'Ocurrió un error inesperado. Serás redirigido al inicio.'}
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={this.handleGoHome} className="btn-primary w-full">
                Ir al Inicio
              </button>
              <button onClick={this.handleReload} className="btn-secondary w-full">
                Recargar Aplicación
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
