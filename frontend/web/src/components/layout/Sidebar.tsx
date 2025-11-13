import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import classNames from 'classnames';

const navigation = [
  { name: 'Overview', to: '/', icon: HomeIcon },
  { name: 'Events', to: '/events', icon: CalendarDaysIcon },
  { name: 'Notifications', to: '/notifications', icon: BellAlertIcon },
  { name: 'Groups', to: '/groups', icon: UserGroupIcon },
  { name: 'Surveys', to: '/surveys', icon: ClipboardDocumentListIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon }
];

const adminNavigation = [{ name: 'Admin', to: '/admin/users', icon: ShieldCheckIcon, roles: ['ADMIN'] }];

const Sidebar = () => {
  const { user } = useAuth();
  const items = user?.role === 'ADMIN' ? [...navigation, ...adminNavigation] : navigation;

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xl font-semibold text-primary-600">UniVibe</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">University experiences, reimagined</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-600/10 dark:text-primary-200'
                  : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
