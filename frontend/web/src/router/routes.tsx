import { lazy } from 'react';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EventsPage = lazy(() => import('@/pages/events/EventListPage'));
const EventDetailPage = lazy(() => import('@/pages/events/EventDetailPage'));
const GroupsPage = lazy(() => import('@/pages/groups/GroupsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const SurveyPage = lazy(() => import('@/pages/surveys/SurveyPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> }
];

export const privateRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/events/:eventId', element: <EventDetailPage /> },
  { path: '/groups', element: <GroupsPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/surveys', element: <SurveyPage /> },
  { path: '/admin/users', element: <AdminUsersPage /> }
];

export const fallbackRoute = { path: '*', element: <NotFoundPage /> };
