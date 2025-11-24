import { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  label?: string;
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  label = 'Foto de perfil',
  maxSizeMB = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      return;
    }

    setError(null);

    // Leer archivo como base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="relative">
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 shadow-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-error-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                aria-label="Eliminar imagen"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={handleClick}
              className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
            >
              <PhotoIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            className="btn-secondary text-sm"
          >
            {preview ? 'Cambiar foto' : 'Subir foto'}
          </button>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG o GIF. Máximo {maxSizeMB}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;







