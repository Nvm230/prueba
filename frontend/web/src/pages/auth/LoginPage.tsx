import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
    <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Bienvenido a UniVibe</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gestiona eventos universitarios en un solo lugar.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField label="Correo" type="email" error={formState.errors.email?.message} {...register('email')} />
        <TextField
          label="Contraseña"
          type="password"
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <SubmitButton loading={isAuthenticating} className="w-full">
          Iniciar sesión
        </SubmitButton>
      </form>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        ¿Aún no tienes cuenta?{' '}
        <Link to="/register" className="text-primary-600">
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
