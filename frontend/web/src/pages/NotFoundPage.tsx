import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="text-center space-y-6 animate-fade-in max-w-2xl">
      {/* Imagen del alcalde */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          <img
            src="/alcaldefoto.jpg"
            alt="404"
            className="relative w-80 h-80 object-cover rounded-3xl shadow-2xl ring-4 ring-primary-500/20 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <h1 className="text-5xl font-bold gradient-text mb-4">
        Estamos trabajando en esto mi amor
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        La página que buscas aún no está disponible, pero estamos trabajando para tenerla lista pronto.
      </p>
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
