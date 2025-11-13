import { Component, ErrorInfo, ReactNode } from 'react';
import EmptyState from '../display/EmptyState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary captured an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <EmptyState title="Algo salió mal" description="Recarga la página o vuelve más tarde." />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
