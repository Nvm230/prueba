import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const schema = z
  .object({
    name: z.string().min(3, 'Tu nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string()
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const { register: registerUser, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { register: registerAuth, isAuthenticating } = useAuth();

  const onSubmit = async (values: FormValues) => {
    await registerAuth({ name: values.name, email: values.email, password: values.password });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Únete a la plataforma de experiencias universitarias.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField label="Nombre" error={formState.errors.name?.message} {...registerUser('name')} />
        <TextField label="Correo" type="email" error={formState.errors.email?.message} {...registerUser('email')} />
        <TextField label="Contraseña" type="password" error={formState.errors.password?.message} {...registerUser('password')} />
        <TextField
          label="Confirmar contraseña"
          type="password"
          error={formState.errors.confirmPassword?.message}
          {...registerUser('confirmPassword')}
        />
        <SubmitButton loading={isAuthenticating} className="w-full">
          Crear cuenta
        </SubmitButton>
      </form>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-primary-600">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
