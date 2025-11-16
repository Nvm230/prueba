import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { checkInWithQR } from '@/services/checkInService';
import { useToast } from '@/contexts/ToastContext';
import { QrCodeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const CheckInPage = () => {
  const { pushToast } = useToast();
  const [qrPayload, setQrPayload] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: string) => checkInWithQR(payload),
    onSuccess: (data) => {
      setCheckInResult({
        success: true,
        message: `Check-in exitoso. Estado: ${data.status}`
      });
      pushToast({
        type: 'success',
        title: 'Check-in Exitoso',
        description: `Registrado a las ${new Date(data.checkedInAt).toLocaleString()}`
      });
      setQrPayload('');
    },
    onError: (error: any) => {
      setCheckInResult({
        success: false,
        message: error.message || 'Error al procesar el check-in'
      });
      pushToast({
        type: 'error',
        title: 'Error en Check-in',
        description: error.message || 'No se pudo procesar el código QR'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrPayload.trim()) {
      pushToast({
        type: 'info',
        title: 'Campo requerido',
        description: 'Por favor ingresa el código QR'
      });
      return;
    }
    mutation.mutate(qrPayload);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Check-in' }]} />
      
      <div className="card max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <QrCodeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Check-in con QR</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Escanea o ingresa el código QR del participante para registrar su asistencia
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Código QR
            </label>
            <textarea
              value={qrPayload}
              onChange={(e) => {
                setQrPayload(e.target.value);
                setCheckInResult(null);
              }}
              placeholder="Pega aquí el código QR del participante..."
              rows={6}
              className="input-field font-mono text-sm"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              El código QR debe ser el payload completo generado durante el registro
            </p>
          </div>

          {checkInResult && (
            <div
              className={`rounded-xl p-4 flex items-start gap-3 ${
                checkInResult.success
                  ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                  : 'bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800'
              }`}
            >
              {checkInResult.success ? (
                <CheckCircleIcon className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    checkInResult.success
                      ? 'text-success-900 dark:text-success-200'
                      : 'text-error-900 dark:text-error-200'
                  }`}
                >
                  {checkInResult.message}
                </p>
              </div>
            </div>
          )}

          <SubmitButton
            type="submit"
            className="w-full"
            disabled={mutation.isLoading || !qrPayload.trim()}
          >
            {mutation.isLoading ? 'Procesando...' : 'Registrar Check-in'}
          </SubmitButton>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Instrucciones</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>Escanea el código QR del participante usando un escáner QR</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>O copia y pega el payload completo del código QR</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>El sistema validará automáticamente el código y registrará la asistencia</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;







