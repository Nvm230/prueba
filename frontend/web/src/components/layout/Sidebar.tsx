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
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  FaceSmileIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { getUnreadMessageCount } from '@/services/socialService';
import classNames from 'classnames';

type NavigationItem = {
  name: string;
  to: string;
  icon: typeof HomeIcon;
  roles?: string[];
};

const navigation: NavigationItem[] = [
  { name: 'Inicio', to: '/', icon: HomeIcon },
  { name: 'Eventos', to: '/events', icon: CalendarDaysIcon },
  { name: 'Registro QR', to: '/qr-register', icon: QrCodeIcon },
  { name: 'Notificaciones', to: '/notifications', icon: BellAlertIcon },
  { name: 'Grupos', to: '/groups', icon: UserGroupIcon },
  { name: 'Encuestas', to: '/surveys', icon: ClipboardDocumentListIcon },
  { name: 'Amigos', to: '/friends', icon: UserPlusIcon },
  { name: 'Chat', to: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Perfil', to: '/profile', icon: UserCircleIcon },
  { name: 'Configuración', to: '/settings', icon: Cog6ToothIcon }
];

const adminNavigation: NavigationItem[] = [
  { name: 'Administración', to: '/admin/users', icon: ShieldCheckIcon, roles: ['ADMIN', 'SERVER'] },
  { name: 'Stickers globales', to: '/admin/stickers', icon: FaceSmileIcon, roles: ['ADMIN'] },
  { name: 'Soporte', to: '/admin/support', icon: ChatBubbleBottomCenterTextIcon, roles: ['ADMIN', 'SERVER'] }
];

type SidebarVariant = 'desktop' | 'mobile';

interface SidebarProps {
  variant?: SidebarVariant;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ variant = 'desktop', isOpen = false, onClose }) => {
  const { user } = useAuth();
  const isPrivileged = user && (user.role === 'ADMIN' || user.role === 'SERVER');
  const privilegedItems = isPrivileged
    ? adminNavigation.filter((item) => !item.roles || (user?.role ? item.roles.includes(user.role) : false))
    : [];
  const items = isPrivileged ? [...navigation, ...privilegedItems] : navigation;

  const { data: unreadData } = useQuery({
    queryKey: ['unread-messages-count', user?.id],
    queryFn: ({ signal }) => getUnreadMessageCount(signal),
    enabled: Boolean(user),
    refetchInterval: 10000
  });

  const unreadCount = unreadData?.count || 0;

  if (variant === 'mobile') {
    return (
      <div className={`lg:hidden fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-lg font-semibold text-primary-600">UniVibe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explora tus espacios</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <SidebarItems items={items} unreadCount={unreadCount} onNavigate={onClose} />
          </nav>
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xl font-semibold text-primary-600">UniVibe</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Experiencias universitarias reinventadas</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <SidebarItems items={items} unreadCount={unreadCount} />
      </nav>
    </aside>
  );
};

interface SidebarItemsProps {
  items: NavigationItem[];
  unreadCount: number;
  onNavigate?: () => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ items, unreadCount, onNavigate }) => (
  <>
    {items.map((item) => {
      const isChat = item.to === '/chat';
      const showBadge = isChat && unreadCount > 0;

      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
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
  </>
);

export default Sidebar;
