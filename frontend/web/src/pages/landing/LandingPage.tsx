import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: <CalendarDaysIcon className="h-8 w-8" />,
      title: 'Gestión de Eventos',
      description: 'Crea, organiza y gestiona eventos universitarios de manera sencilla e intuitiva.'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: 'Comunidad Activa',
      description: 'Conecta con otros estudiantes, únete a grupos y participa en actividades.'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: 'Chat en Tiempo Real',
      description: 'Comunícate con tus compañeros a través de chats grupales y privados.'
    },
    {
      icon: <TrophyIcon className="h-8 w-8" />,
      title: 'Sistema de Logros',
      description: 'Gana puntos y desbloquea logros mientras participas en eventos y actividades.'
    },
    {
      icon: <BellIcon className="h-8 w-8" />,
      title: 'Notificaciones',
      description: 'Mantente al día con las últimas actualizaciones y eventos importantes.'
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8" />,
      title: 'Check-in Rápido',
      description: 'Regístrate y confirma tu asistencia a eventos con códigos QR.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">UniVibe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="btn-primary px-6 py-2 text-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">
            Conecta, Participa y
            <span className="gradient-text block">Vive la Experiencia Universitaria</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            UniVibe es la plataforma que une a la comunidad universitaria. Gestiona eventos, 
            conecta con compañeros y participa en actividades que enriquecen tu vida estudiantil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to="/register"
              className="btn-primary px-8 py-4 text-lg"
            >
              Comenzar Ahora
            </Link>
            <Link
              to="/login"
              className="btn-secondary px-8 py-4 text-lg"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Descubre todas las funcionalidades que UniVibe tiene para ofrecerte
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-white/80 dark:bg-slate-900/80 hover:scale-105 transition-transform"
            >
              <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 w-fit mb-4 text-primary-600 dark:text-primary-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto card bg-gradient-to-br from-primary-500 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Únete a la comunidad universitaria y comienza a vivir experiencias inolvidables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Crear Cuenta Gratis
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors border-2 border-white/20"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center text-slate-600 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} UniVibe. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
