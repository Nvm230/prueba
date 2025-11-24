import { lazy } from 'react';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EventsPage = lazy(() => import('@/pages/events/EventListPage'));
const EventDetailPage = lazy(() => import('@/pages/events/EventDetailPage'));
const CreateEventPage = lazy(() => import('@/pages/events/CreateEventPage'));
const EditEventPage = lazy(() => import('@/pages/events/EditEventPage'));
const CheckInPage = lazy(() => import('@/pages/checkin/CheckInPage'));
const GroupsPage = lazy(() => import('@/pages/groups/GroupsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const SurveyPage = lazy(() => import('@/pages/surveys/SurveyPage'));
const FriendsPage = lazy(() => import('@/pages/friends/FriendsPage'));
const PrivateChatPage = lazy(() => import('@/pages/chat/PrivateChatPage'));
const GroupDetailPage = lazy(() => import('@/pages/groups/GroupDetailPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminStickersPage = lazy(() => import('@/pages/admin/AdminStickersPage'));
const AdminSupportPage = lazy(() => import('@/pages/admin/AdminSupportPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AchievementsPage = lazy(() => import('@/pages/achievements/AchievementsPage'));
const StoriesPage = lazy(() => import('@/pages/stories/StoriesPage'));
const PostsPage = lazy(() => import('@/pages/posts/PostsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));

export const publicRoutes = [
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> }
];

export const privateRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/events/new', element: <CreateEventPage /> },
  { path: '/events/:eventId', element: <EventDetailPage /> },
  { path: '/events/:eventId/edit', element: <EditEventPage /> },
  { path: '/qr-register', element: <CheckInPage /> },
  { path: '/checkin', element: <CheckInPage /> },
  { path: '/groups', element: <GroupsPage /> },
  { path: '/groups/:groupId', element: <GroupDetailPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/profile/:userId', element: <UserProfilePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/surveys', element: <SurveyPage /> },
  { path: '/friends', element: <FriendsPage /> },
  { path: '/chat', element: <PrivateChatPage /> },
  { path: '/chat/:userId', element: <PrivateChatPage /> },
  { path: '/admin/users', element: <AdminUsersPage /> },
  { path: '/admin/stickers', element: <AdminStickersPage /> },
  { path: '/admin/support', element: <AdminSupportPage /> },
  { path: '/admin/reports', element: <AdminReportsPage /> },
  { path: '/achievements', element: <AchievementsPage /> },
  { path: '/stories', element: <StoriesPage /> },
  { path: '/posts', element: <PostsPage /> }
];

export const fallbackRoute = { path: '*', element: <NotFoundPage /> };
