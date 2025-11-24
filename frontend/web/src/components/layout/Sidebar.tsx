import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FlagIcon,
  RectangleStackIcon,
  PhotoIcon,
  DocumentTextIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { getUnreadMessageCount } from '@/services/socialService';
import classNames from 'classnames';

type NavigationItem = {
  name: string;
  to?: string;
  icon: typeof HomeIcon;
  roles?: string[];
  children?: NavigationItem[];
};

const navigation: NavigationItem[] = [
  { name: 'Inicio', to: '/', icon: HomeIcon },
  {
    name: 'Eventos',
    icon: CalendarDaysIcon,
    children: [
      { name: 'Eventos', to: '/events', icon: CalendarDaysIcon },
      { name: 'Encuestas', to: '/surveys', icon: ClipboardDocumentListIcon }
    ]
  },
  { name: 'Registro QR', to: '/qr-register', icon: QrCodeIcon },
  { name: 'Notificaciones', to: '/notifications', icon: BellAlertIcon },
  {
    name: 'Social',
    icon: UserGroupIcon,
    children: [
      { name: 'Grupos', to: '/groups', icon: UserGroupIcon },
      { name: 'Chat', to: '/chat', icon: ChatBubbleLeftRightIcon },
      { name: 'Amigos', to: '/friends', icon: UserPlusIcon },
      { name: 'Posts', to: '/posts', icon: DocumentTextIcon },
      { name: 'Historias', to: '/stories', icon: PhotoIcon }
    ]
  },
  { name: 'Perfil', to: '/profile', icon: UserCircleIcon },
  { name: 'Configuración', to: '/settings', icon: Cog6ToothIcon }
];

const adminNavigation: NavigationItem[] = [
  {
    name: 'Administración',
    icon: ShieldCheckIcon,
    roles: ['ADMIN'],
    children: [
      { name: 'Usuarios', to: '/admin/users', icon: ShieldCheckIcon, roles: ['ADMIN'] },
      { name: 'Stickers globales', to: '/admin/stickers', icon: FaceSmileIcon, roles: ['ADMIN'] },
      { name: 'Soporte', to: '/admin/support', icon: ChatBubbleBottomCenterTextIcon, roles: ['ADMIN'] },
      { name: 'Reportes', to: '/admin/reports', icon: FlagIcon, roles: ['ADMIN'] }
    ]
  }
];

type SidebarVariant = 'desktop' | 'mobile';

interface SidebarProps {
  variant?: SidebarVariant;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ variant = 'desktop', isOpen = false, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const isPrivileged = user && user.role === 'ADMIN';
  const privilegedItems = isPrivileged
    ? adminNavigation.filter((item) => {
      if (item.children) {
        item.children = item.children.filter((child) => !child.roles || (user?.role ? child.roles.includes(user.role) : false));
        return item.children.length > 0;
      }
      return !item.roles || (user?.role ? item.roles.includes(user.role) : false);
    })
    : [];
  const items = isPrivileged ? [...navigation, ...privilegedItems] : navigation;

  // Auto-expand groups if current route is a child
  const checkAndExpandGroups = () => {
    const newExpanded = new Set(expandedGroups);
    items.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => child.to && location.pathname.startsWith(child.to));
        if (hasActiveChild) {
          newExpanded.add(item.name);
        }
      }
    });
    if (newExpanded.size !== expandedGroups.size) {
      setExpandedGroups(newExpanded);
    }
  };

  useEffect(() => {
    checkAndExpandGroups();
  }, [location.pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

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
          className={`absolute inset-y-0 left-0 w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
            <SidebarItems
              items={items}
              unreadCount={unreadCount}
              onNavigate={onClose}
              expandedGroups={expandedGroups}
              onToggleGroup={toggleGroup}
            />
          </nav>
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-white/90 via-purple-50/20 to-white/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/90 backdrop-blur-xl shadow-lg">
      <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/60">
        <span className="text-xl font-bold gradient-text">UniVibe</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Experiencias universitarias reinventadas</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <SidebarItems
          items={items}
          unreadCount={unreadCount}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
        />
      </nav>
    </aside>
  );
};

interface SidebarItemsProps {
  items: NavigationItem[];
  unreadCount: number;
  onNavigate?: () => void;
  expandedGroups: Set<string>;
  onToggleGroup: (groupName: string) => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ items, unreadCount, onNavigate, expandedGroups, onToggleGroup }) => {
  const location = useLocation();

  return (
    <>
      {items.map((item) => {
        if (item.children && item.children.length > 0) {
          const isExpanded = expandedGroups.has(item.name);
          const hasActiveChild = item.children.some((child) => child.to && location.pathname.startsWith(child.to));

          return (
            <div key={item.name}>
              <button
                onClick={() => onToggleGroup(item.name)}
                className={classNames(
                  'w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  hasActiveChild
                    ? 'bg-slate-700 text-white dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                  {item.children.map((child) => {
                    if (!child.to) return null;
                    const isChat = child.to === '/chat';
                    const showBadge = isChat && unreadCount > 0;

                    return (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          classNames(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative',
                            isActive
                              ? 'bg-slate-700 text-white dark:bg-slate-800 dark:text-slate-100'
                              : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
                          )
                        }
                      >
                        <div className="relative">
                          <child.icon className="h-4 w-4" />
                          {showBadge && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                        {child.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        if (!item.to) return null;

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
                  ? 'bg-slate-700 text-white dark:bg-slate-800 dark:text-slate-100'
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
};

export default Sidebar;
