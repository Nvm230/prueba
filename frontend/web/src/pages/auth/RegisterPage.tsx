import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const nombreValido = z
  .string()
  .min(3, 'Tu nombre debe tener al menos 3 caracteres')
  .max(100, 'El nombre es demasiado largo')
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/, 'Usa solo letras y espacios para tu nombre');

const schema = z
  .object({
    name: nombreValido,
    email: z.string().email('Ingresa un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña')
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const { register: registerUser, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  const { register: registerAuth, isAuthenticating } = useAuth();

  const onSubmit = async (values: FormValues) => {
    await registerAuth({ name: values.name, email: values.email, password: values.password });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-primary-200 dark:border-primary-800 shadow-soft-lg">
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4">
              <UserPlusIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Crea tu cuenta</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Únete a la plataforma de experiencias universitarias
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Nombre completo"
              placeholder="Juan Pérez"
              error={formState.errors.name?.message}
              {...registerUser('name')}
              required
            />
            <TextField
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              error={formState.errors.email?.message}
              {...registerUser('email')}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={formState.errors.password?.message}
              {...registerUser('password')}
              required
            />
            <TextField
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={formState.errors.confirmPassword?.message}
              {...registerUser('confirmPassword')}
              required
            />
            <SubmitButton loading={isAuthenticating} className="w-full">
              Crear cuenta
            </SubmitButton>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
