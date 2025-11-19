import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ThemeToggle from '../navigation/ThemeToggle';
import UserMenu from '../navigation/UserMenu';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const debounced = useDebouncedValue(query);

  // push query to events page to centralize search
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({ pathname: '/events', search: debounced ? `?search=${encodeURIComponent(debounced)}` : '' });
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bars3Icon className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </button>
          <form onSubmit={onSubmit} className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              name="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar eventos, grupos o notificaciones"
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </form>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
