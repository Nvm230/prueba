import { useState, useRef } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { uploadFile } from '@/services/fileService';

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onError?: (error: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      onError?.('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('La imagen no puede superar los 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir archivo al servidor
      const response = await uploadFile(file, 'OTHER');
      
      // Construir URL del archivo
      const fileUrl = `/api/files/${response.id}`;
      onChange(fileUrl);
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      onError?.(error.message || 'Error al subir la imagen');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-error-500 hover:bg-error-600 text-white rounded-full p-2 transition-colors"
            title="Eliminar imagen"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <PhotoIcon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isUploading ? 'Subiendo...' : 'Desde dispositivo'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <CameraIcon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isUploading ? 'Subiendo...' : 'Tomar foto'}
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona una imagen de tu dispositivo o toma una foto
            </p>
          </div>
        </div>
      )}

      {/* Input oculto para seleccionar archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Input oculto para cámara */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;



