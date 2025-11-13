import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { updateProfile } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';

const categories = ['Technology', 'Wellness', 'Sports', 'Entrepreneurship', 'Art', 'Science'];

type FormValues = {
  name: string;
  preferredCategories: string[];
};

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? '',
      preferredCategories: user?.preferredCategories ?? []
    }
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, preferredCategories: user.preferredCategories });
    }
  }, [user, reset]);

  if (!user) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile(values);
      await refreshProfile();
      pushToast({ type: 'success', title: 'Perfil actualizado', description: 'Tus preferencias fueron guardadas.' });
      reset(values);
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error al actualizar', description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Perfil' }]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft">
          <div className="text-xs uppercase tracking-wide text-slate-400">Resumen</div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{user.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Rol: {user.role}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Puntos gamificados: {user.points}</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-4 shadow-soft"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Editar perfil</h2>
          <TextField label="Nombre" defaultValue={user.name} {...register('name')} />
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Categorías preferidas</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => {
                const selected = user.preferredCategories.includes(category);
                return (
                  <label key={category} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      value={category}
                      defaultChecked={selected}
                      {...register('preferredCategories')}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    {category}
                  </label>
                );
              })}
            </div>
          </div>
          <SubmitButton className="w-full sm:w-auto">Guardar cambios</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
