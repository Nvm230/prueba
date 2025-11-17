import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HomeIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { getUnreadMessageCount } from '@/services/socialService';
import classNames from 'classnames';

const navigation = [
  { name: 'Overview', to: '/', icon: HomeIcon },
  { name: 'Events', to: '/events', icon: CalendarDaysIcon },
  { name: 'Registro QR', to: '/qr-register', icon: QrCodeIcon },
  { name: 'Notifications', to: '/notifications', icon: BellAlertIcon },
  { name: 'Groups', to: '/groups', icon: UserGroupIcon },
  { name: 'Surveys', to: '/surveys', icon: ClipboardDocumentListIcon },
  { name: 'Friends', to: '/friends', icon: UserPlusIcon },
  { name: 'Chat', to: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon }
];

const adminNavigation = [{ name: 'Admin', to: '/admin/users', icon: ShieldCheckIcon, roles: ['ADMIN'] }];

const Sidebar = () => {
  const { user } = useAuth();
  const isPrivileged = user && (user.role === 'ADMIN' || user.role === 'SERVER');
  const items = isPrivileged ? [...navigation, ...adminNavigation] : navigation;

  // Obtener contador de mensajes sin leer
  const { data: unreadData } = useQuery({
    queryKey: ['unread-messages-count', user?.id],
    queryFn: ({ signal }) => getUnreadMessageCount(signal),
    enabled: Boolean(user),
    refetchInterval: 10000 // Actualizar cada 10 segundos
  });

  const unreadCount = unreadData?.count || 0;

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xl font-semibold text-primary-600">UniVibe</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">University experiences, reimagined</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item) => {
          const isChat = item.to === '/chat';
          const showBadge = isChat && unreadCount > 0;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-600/10 dark:text-primary-200'
                    : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
                )
              }
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
