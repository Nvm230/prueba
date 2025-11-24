import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import EmptyState from '@/components/display/EmptyState';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { createSticker, deleteSticker, getStickers, publishSticker, Sticker } from '@/services/stickerService';
import { FaceSmileIcon, CloudArrowUpIcon, GlobeAltIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AdminStickersPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: stickers = [], isLoading } = useQuery({
    queryKey: ['admin-stickers'],
    queryFn: getStickers,
    enabled: Boolean(user)
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, nombre }: { file: File; nombre?: string }) => createSticker(file, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stickers'] });
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      pushToast({
        type: 'success',
        title: 'Sticker creado',
        description: 'Se agregó correctamente a tu biblioteca.'
      });
    },
    onError: (error: any) => {
      pushToast({
        type: 'error',
        title: 'No se pudo subir',
        description: error?.response?.data?.message || 'Revisa que el archivo sea una imagen válida.'
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: (stickerId: number) => publishSticker(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stickers'] });
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      pushToast({
        type: 'success',
        title: 'Sticker global',
        description: 'Ahora todos los usuarios pueden utilizarlo.'
      });
    },
    onError: () => {
      pushToast({
        type: 'error',
        title: 'No se pudo publicar',
        description: 'Intenta nuevamente en unos segundos.'
      });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (stickerId: number) => deleteSticker(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stickers'] });
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      pushToast({
        type: 'success',
        title: 'Sticker eliminado',
        description: 'Ya no estará disponible.'
      });
    },
    onError: () => {
      pushToast({
        type: 'error',
        title: 'No se pudo eliminar',
        description: 'Revisa si el sticker es global antes de eliminarlo.'
      });
    }
  });

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast({
        type: 'error',
        title: 'Formato no válido',
        description: 'Solo se permiten imágenes.'
      });
      return;
    }
    uploadMutation.mutate({ file, nombre: file.name.split('.')[0] });
    event.target.value = '';
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Stickers' }]} />
        <EmptyState
          title="Acceso restringido"
          description="Solo los administradores pueden gestionar los stickers globales."
        />
      </div>
    );
  }

  const ownedStickers = stickers.filter((sticker) => sticker.owned);
  const globalStickers = stickers.filter((sticker) => sticker.global);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Administración', to: '/admin/users' }, { label: 'Stickers' }]} />
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FaceSmileIcon className="h-6 w-6 text-primary-500" />
              Biblioteca de stickers
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crea y publica stickers visibles para toda la comunidad.</p>
          </div>
          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500 disabled:opacity-60"
              disabled={uploadMutation.isLoading}
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              {uploadMutation.isLoading ? 'Subiendo...' : 'Subir sticker'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingOverlay message="Cargando stickers" />
        ) : stickers.length === 0 ? (
          <EmptyState
            title="Sin stickers"
            description="Aún no has agregado stickers. Sube uno para comenzar."
            icon={FaceSmileIcon}
          />
        ) : (
          <div className="space-y-8">
            <StickerGrid
              title="Mis stickers"
              description="Solo tú puedes verlos hasta que los publiques."
              actionLabel="Publicar global"
              stickers={ownedStickers}
              onPublish={(id) => publishMutation.mutate(id)}
              onDelete={(id) => removeMutation.mutate(id)}
              showGlobalBadge
            />
            <StickerGrid
              title="Colección global"
              description="Stickers visibles para todos los usuarios."
              stickers={globalStickers}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface StickerGridProps {
  title: string;
  description: string;
  stickers: Sticker[];
  actionLabel?: string;
  onPublish?: (id: number) => void;
  onDelete?: (id: number) => void;
  readOnly?: boolean;
  showGlobalBadge?: boolean;
}

const StickerGrid: React.FC<StickerGridProps> = ({
  title,
  description,
  stickers,
  actionLabel,
  onPublish,
  onDelete,
  readOnly = false,
  showGlobalBadge = false
}) => {
  if (!stickers.length) {
    return (
      <div>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
        <p className="text-xs text-slate-400">Aún no hay elementos en esta sección.</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-col gap-3"
          >
            <div className="relative h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden">
              <img
                src={`data:${sticker.contentType};base64,${sticker.previewBase64}`}
                alt={sticker.nombre || 'Sticker'}
                className="max-h-28 object-contain"
              />
              {sticker.global && showGlobalBadge && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <GlobeAltIcon className="h-3 w-3" />
                  Global
                </span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {sticker.nombre || `Sticker #${sticker.id}`}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {sticker.global ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <SparklesIcon className="h-4 w-4" />
                    Público
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <FaceSmileIcon className="h-4 w-4" />
                    Privado
                  </span>
                )}
              </div>
            </div>
            {!readOnly && (
              <div className="flex items-center gap-2">
                {!sticker.global && actionLabel && onPublish && (
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-primary-600/90 text-white text-xs font-semibold px-3 py-1.5 hover:bg-primary-500"
                    onClick={() => onPublish(sticker.id)}
                  >
                    {actionLabel}
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => onDelete(sticker.id)}
                    disabled={sticker.global}
                  >
                    <span className="inline-flex items-center gap-1">
                      <TrashIcon className="h-3.5 w-3.5" />
                      Eliminar
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStickersPage;






















