import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import SubmitButton from '@/components/forms/SubmitButton';
import { scanEventQr } from '@/services/registrationService';
import { useToast } from '@/contexts/ToastContext';
import { QrCodeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const CheckInPage = () => {
  const { pushToast } = useToast();
  const [qrPayload, setQrPayload] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [registeredEventId, setRegisteredEventId] = useState<number | null>(null);

  const decodeEventId = (payload: string): number | null => {
    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      if (decoded.startsWith('REGISTER:')) {
        return Number(decoded.split(':')[1]);
      }
    } catch {
      // ignore decoding errors
    }
    return null;
  };

  const mutation = useMutation({
    mutationFn: (payload: string) => scanEventQr(payload),
    onSuccess: (data) => {
      const eventId = decodeEventId(qrPayload);
      setRegisteredEventId(eventId);
      setResult({
        success: true,
        message: 'Ya estás registrado en este evento. Ábrelo para ver tu QR personal y obtener la contraseña de check-in cuando esté en vivo.'
      });
      pushToast({
        type: 'success',
        title: 'Registro confirmado',
        description: 'Ya puedes ver tu QR personal en la página del evento.'
      });
      setQrPayload('');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'No se pudo procesar el QR';
      setResult({
        success: false,
        message
      });
      setRegisteredEventId(null);
      pushToast({
        type: 'error',
        title: 'Error en registro',
        description: message
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
    mutation.mutate(qrPayload.trim());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Registro QR' }]} />
      
      <div className="card max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <QrCodeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Registro con QR de Evento</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pega el payload del QR del evento (empieza con REGISTER:ID) para registrarte automáticamente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Código QR del evento</label>
            <textarea
              value={qrPayload}
              onChange={(e) => {
                setQrPayload(e.target.value);
                setResult(null);
                setPersonalQr(null);
                setRegisteredEventId(null);
              }}
              placeholder="Ejemplo: UkVHSVNURVI6Mg=="
              rows={6}
              className="input-field font-mono text-sm"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Este QR se obtiene desde la vista del evento y se usa únicamente para inscribirte (REGISTER:ID).
            </p>
          </div>

          {result && (
            <div
              className={`rounded-xl p-4 flex items-start gap-3 ${
                result.success
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700'
                  : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {result.success ? (
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-300 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    result.success
                      ? 'text-emerald-800 dark:text-emerald-200'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {result.message}
                </p>
                {result.success && registeredEventId && (
                  <div className="mt-3">
                    <Link
                      to={`/events/${registeredEventId}`}
                      className="inline-flex items-center justify-center rounded-full bg-primary-600 text-white px-4 py-2 text-sm font-semibold hover:bg-primary-500"
                    >
                      Abrir evento
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <SubmitButton
            type="submit"
            className="w-full"
            disabled={mutation.isLoading || !qrPayload.trim()}
          >
            {mutation.isLoading ? 'Registrando...' : 'Registrarme al evento'}
          </SubmitButton>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Instrucciones</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>Escanea o copia el QR del evento (REGISTER:ID) desde la página del evento.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>Pega el payload completo en el campo superior para inscribirte al instante.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">•</span>
              <span>Luego abre el evento: verás tu QR personal y, cuando esté en vivo, ingresa la contraseña de check-in.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;







