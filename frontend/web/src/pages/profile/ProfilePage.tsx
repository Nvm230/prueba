import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import ImageUpload from '@/components/forms/ImageUpload';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import ProfileCard from '@/components/social/ProfileCard';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { updateProfile } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';

const categories = ['Technology', 'Wellness', 'Sports', 'Entrepreneurship', 'Art', 'Science', 'Education', 'Networking'];

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  preferredCategories: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(user?.profilePictureUrl || null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      preferredCategories: user?.preferredCategories ?? []
    }
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, preferredCategories: user.preferredCategories || [] });
      setProfilePictureUrl(user.profilePictureUrl || null);
    }
  }, [user, reset]);

  if (!user) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile({
        ...values,
        profilePictureUrl: profilePictureUrl || undefined
      });
      await refreshProfile();
      pushToast({
        type: 'success',
        title: 'Perfil actualizado',
        description: 'Tus preferencias fueron guardadas exitosamente.'
      });
      reset(values);
    } catch (error: any) {
      pushToast({
        type: 'error',
        title: 'Error al actualizar',
        description: error.message || 'No se pudo actualizar el perfil. Intenta nuevamente.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Perfil' }]} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card with QR */}
        <ProfileCard />

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 card space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Editar Perfil</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Actualiza tu información personal y preferencias
            </p>
          </div>

          {/* Profile Picture Upload */}
          <ImageUpload
            currentImageUrl={user.profilePictureUrl}
            onImageChange={(url) => setProfilePictureUrl(url)}
            label="Foto de Perfil"
            maxSizeMB={5}
          />

          <TextField
            label="Nombre completo"
            defaultValue={user.name}
            {...register('name')}
            error={errors.name?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              Categorías Preferidas
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Selecciona las categorías de eventos que más te interesan
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {categories.map((category) => {
                const selected = user.preferredCategories?.includes(category) || false;
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={category}
                      defaultChecked={selected}
                      {...register('preferredCategories')}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</span>
                  </label>
                );
              })}
            </div>
            {errors.preferredCategories && (
              <p className="mt-2 text-xs text-error-500">{errors.preferredCategories.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                reset();
                setProfilePictureUrl(user.profilePictureUrl || null);
              }}
              className="btn-secondary flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <SubmitButton className="flex-1 sm:flex-none" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
