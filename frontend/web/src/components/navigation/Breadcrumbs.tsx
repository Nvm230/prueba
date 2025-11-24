import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav className="text-xs uppercase tracking-wide text-slate-400" aria-label="Breadcrumb">
    <ol className="flex items-center gap-2">
      {items.map((item, index) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-500 dark:text-slate-300">{item.label}</span>
          )}
          {index + 1 < items.length && <span>/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
