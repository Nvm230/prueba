import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { formatDateTime } from '@/utils/formatters';
import StatusBadge from '../data/StatusBadge';
import { ClockIcon, MapPinIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const { user } = useAuth();
  const { primaryColor } = useTheme();
  const isAdminOrServer = user && (user.role === 'ADMIN' || user.role === 'SERVER');

  const formatDate = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 p-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {event.title}
            </h3>
            {isAdminOrServer && (
              <span className="inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                ID: {event.id}
              </span>
            )}
            {event.visibility === 'PRIVATE' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                Privado
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {event.description}
            </p>
          )}
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span 
          className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium"
          style={{ color: primaryColor }}
        >
          {event.category}
        </span>
        {event.faculty && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
            <MapPinIcon className="h-3 w-3" />
            {event.faculty}
          </span>
        )}
        {event.tags && event.tags.length > 0 && event.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ClockIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{formatDate(event.startTime)}</span>
          {event.career && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="truncate">{event.career}</span>
            </>
          )}
        </div>
        {event.createdBy && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <UserIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">Creado por: {event.createdBy.name}</span>
          </div>
        )}
        {event.maxCapacity && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <UserGroupIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">Aforo máximo: {event.maxCapacity} personas</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
