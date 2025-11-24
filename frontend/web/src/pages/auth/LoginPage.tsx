import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { login, user, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const redirect = (location.state as { from?: Location })?.from?.pathname ?? '/';
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, location.state]);

  const onSubmit = async (values: FormValues) => {
    await login(values);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Sección izquierda: Información y branding */}
          <div className="hidden md:block space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-6">
              <SparklesIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Bienvenido a UniVibe
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Gestiona eventos universitarios en un solo lugar. Conecta con tu comunidad, participa en eventos y mantente al día con todo lo que pasa en tu universidad.
            </p>
            <div className="space-y-3 mt-8">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Gestiona y participa en eventos</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Conecta con otros estudiantes</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span>Únete a grupos y comunidades</span>
              </div>
            </div>
          </div>

          {/* Sección derecha: Formulario de login */}
          <div className="w-full">
            <div className="card bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-primary-200 dark:border-primary-800 shadow-soft-lg">
              <div className="text-center mb-8 md:hidden">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Bienvenido a UniVibe</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gestiona eventos universitarios en un solo lugar
                </p>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@correo.com"
                  error={formState.errors.email?.message}
                  {...register('email')}
                  required
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  error={formState.errors.password?.message}
                  {...register('password')}
                  required
                />
                <SubmitButton loading={isAuthenticating} className="w-full">
                  Iniciar sesión
                </SubmitButton>
              </form>
              
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                ¿Aún no tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
