import classNames from 'classnames';

interface Props {
  title: string;
  value: string | number;
  trend?: string;
  accent?: 'primary' | 'success' | 'warning';
}

const accentStyles: Record<NonNullable<Props['accent']>, string> = {
  primary: 'from-primary-500/20 to-primary-500/0 text-primary-600 dark:text-primary-200',
  success: 'from-emerald-500/20 to-emerald-500/0 text-emerald-600 dark:text-emerald-200',
  warning: 'from-amber-500/20 to-amber-500/0 text-amber-600 dark:text-amber-200'
};

const StatCard: React.FC<Props> = ({ title, value, trend, accent = 'primary' }) => (
  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft">
    <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
    <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
    {trend && (
      <div
        className={classNames(
          'mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-r',
          accentStyles[accent]
        )}
      >
        {trend}
      </div>
    )}
  </div>
);

export default StatCard;
