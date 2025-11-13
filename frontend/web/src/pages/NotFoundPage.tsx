import EmptyState from '@/components/display/EmptyState';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-[70vh] items-center justify-center">
    <EmptyState
      title="404 - Not Found"
      description="La vista que buscas no existe o fue movida."
      action={
        <Link to="/" className="rounded-full bg-primary-600 px-4 py-2 text-sm text-white">
          Volver al inicio
        </Link>
      }
    />
  </div>
);

export default NotFoundPage;
