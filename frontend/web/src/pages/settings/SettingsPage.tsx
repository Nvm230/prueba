import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import SubmitButton from '@/components/forms/SubmitButton';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Configuración' }]} />
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-6 shadow-soft">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Preferencias generales</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza tu experiencia en UniVibe.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tema</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Alterna entre modo claro y oscuro.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-full px-4 py-1 text-sm ${theme === 'light' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                Claro
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-full px-4 py-1 text-sm ${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                Oscuro
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-500/10 px-4 py-4">
            <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-200">Cerrar sesión</h2>
            <p className="text-xs text-rose-600 dark:text-rose-300">Finaliza tu sesión actual de forma segura.</p>
            <SubmitButton onClick={logout} className="mt-3 bg-rose-600 hover:bg-rose-500">
              Cerrar sesión
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
