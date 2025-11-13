import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { formatDateTime } from '@/utils/formatters';
import StatusBadge from '../data/StatusBadge';

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => (
  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 flex flex-col gap-4 shadow-soft">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Link to={`/events/${event.id}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-primary-600">
          {event.title}
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
      </div>
      <StatusBadge status={event.status} />
    </div>
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">{event.category}</span>
      {event.faculty && <span>{event.faculty}</span>}
      {event.career && <span>{event.career}</span>}
      <span>Starts: {formatDateTime(event.startTime)}</span>
      <span>Ends: {formatDateTime(event.endTime)}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {event.tags?.map((tag) => (
        <span key={tag} className="rounded-full bg-primary-50 dark:bg-primary-600/10 px-3 py-1 text-xs text-primary-600 dark:text-primary-200">
          #{tag}
        </span>
      ))}
    </div>
  </div>
);

export default EventCard;
