import classNames from 'classnames';
import { EventStatus } from '@/types';

const variants: Record<EventStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  LIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
  FINISHED: 'bg-slate-200 text-slate-700 dark:bg-slate-500/10 dark:text-slate-200'
};

const StatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => (
  <span className={classNames('rounded-full px-3 py-1 text-xs font-medium', variants[status])}>{status}</span>
);

export default StatusBadge;
