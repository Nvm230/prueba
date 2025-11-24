import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="text-center space-y-8 max-w-2xl">
      <div className="relative inline-block">
        <img
          src="/alcaldefoto.jpg"
          alt="404"
          className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-3xl shadow-2xl mx-auto border-4 border-primary-200 dark:border-primary-800"
        />
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">
          Estamos trabajando en esto mi amor
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          La página que buscas aún no está disponible, pero estamos trabajando para tenerla lista pronto.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          to="/"
          className="btn-primary px-8 py-3 text-lg"
        >
          Volver al inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary px-8 py-3 text-lg"
        >
          Volver atrás
        </button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
