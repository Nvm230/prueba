import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  trend?: string;
  accent?: 'primary' | 'success' | 'warning';
  icon?: ReactNode;
}

const accentStyles: Record<NonNullable<Props['accent']>, { bg: string; text: string }> = {
  primary: {
    bg: 'from-primary-500/20 to-primary-500/0',
    text: 'text-primary-600 dark:text-primary-200'
  },
  success: {
    bg: 'from-emerald-500/20 to-emerald-500/0',
    text: 'text-emerald-600 dark:text-emerald-200'
  },
  warning: {
    bg: 'from-amber-500/20 to-amber-500/0',
    text: 'text-amber-600 dark:text-amber-200'
  }
};

const StatCard: React.FC<Props> = ({ title, value, trend, accent = 'primary', icon }) => {
  const accentStyle = accentStyles[accent];
  
  return (
    <div className="card group hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</div>
        {icon && (
          <div className={classNames('p-2 rounded-lg bg-gradient-to-br', accentStyle.bg)}>
            <div className={classNames('text-lg', accentStyle.text)}>
              {icon}
            </div>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
      {trend && (
        <div
          className={classNames(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-r',
            accentStyle.bg,
            accentStyle.text
          )}
        >
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
