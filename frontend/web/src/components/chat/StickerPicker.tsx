import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStickers, createSticker, deleteSticker, Sticker } from '@/services/stickerService';
import { useToast } from '@/contexts/ToastContext';
import { FaceSmileIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface StickerPickerProps {
  onSelect: (sticker: Sticker) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: stickers = [], isLoading } = useQuery({
    queryKey: ['stickers'],
    queryFn: getStickers
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, nombre }: { file: File; nombre?: string }) => createSticker(file, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
      pushToast({
        type: 'success',
        title: 'Sticker agregado',
        description: 'Tu sticker ya está disponible para usar.'
      });
    },
    onError: (error: any) => {
      pushToast({
        type: 'error',
        title: 'Error al subir',
        description: error?.message || 'No se pudo crear el sticker.'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (stickerId: number) => deleteSticker(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stickers'] });
    }
  });

  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast({
        type: 'error',
        title: 'Formato no válido',
        description: 'Solo se permiten imágenes para los stickers.'
      });
      return;
    }
    uploadMutation.mutate({ file, nombre: file.name.split('.')[0] });
    event.target.value = '';
  };

  const ownStickers = stickers.filter((sticker) => sticker.owned);
  const globalStickers = stickers.filter((sticker) => !sticker.owned);

  const renderStickerGrid = (items: Sticker[]) => {
    if (!items.length) {
      return <p className="text-xs text-slate-500">Aún no hay stickers disponibles.</p>;
    }
    return (
      <div className="grid grid-cols-4 gap-2">
        {items.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className="relative aspect-square rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg"
            onClick={() => {
              onSelect(sticker);
              setIsOpen(false);
            }}
            title={sticker.nombre || 'Sticker'}
          >
            {sticker.owned && (
              <span className="absolute top-1 left-1 bg-primary-500 text-[10px] text-white px-2 py-0.5 rounded-full">
                Tú
              </span>
            )}
            {sticker.owned && (
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(sticker.id);
                }}
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            )}
            <img
              src={`data:${sticker.contentType};base64,${sticker.previewBase64}`}
              alt={sticker.nombre || 'Sticker'}
              className="w-full h-full object-contain p-1"
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Abrir stickers"
      >
        <FaceSmileIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4 z-20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mis stickers</p>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleStickerUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-300 hover:underline"
              >
                <PlusIcon className="h-4 w-4" />
                Agregar
              </button>
            </div>
          </div>
          {isLoading ? (
            <p className="text-xs text-slate-500">Cargando stickers...</p>
          ) : (
            <>
              {renderStickerGrid(ownStickers)}
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">Colección global</p>
              {renderStickerGrid(globalStickers)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StickerPicker;
















