import { ReactNode } from 'react';

const EmptyState: React.FC<{ title: string; description: string; action?: ReactNode }> = ({ title, description, action }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-transparent p-10 text-center">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
