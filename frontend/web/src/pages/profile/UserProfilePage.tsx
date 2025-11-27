import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import Avatar from '@/components/display/Avatar';
import { getUserProfile } from '@/services/socialService';
import { getPostsByUser, Post } from '@/services/postService';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime } from '@/utils/formatters';
import PaginationControls from '@/components/data/PaginationControls';
import { useState } from 'react';
import apiClient from '@/services/apiClient';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const userIdNum = userId ? parseInt(userId, 10) : null;
  const isOwnProfile = currentUser && userIdNum === currentUser.id;

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile', userIdNum],
    queryFn: ({ signal }) => getUserProfile(userIdNum!, signal),
    enabled: !!userIdNum
  });

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['userPosts', userIdNum, { page, size }],
    queryFn: ({ signal }) => getPostsByUser(userIdNum!, { page, size }, signal),
    enabled: !!userIdNum
  });

  if (isLoadingProfile || !userIdNum) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Perfil' }]} />
        <EmptyState
          title="Usuario no encontrado"
          description="El usuario que buscas no existe o no está disponible."
        />
      </div>
    );
  }

  const posts = postsData?.content || [];
  const pageMeta = postsData ? {
    page: postsData.page || 0,
    size: postsData.size || 10,
    totalElements: postsData.totalElements || 0,
    totalPages: postsData.totalPages || 0
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: profile.name }]} />

      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
          <Avatar user={{ id: profile.id, name: profile.name, profilePictureUrl: profile.profilePictureUrl }} size="xl" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{profile.name}</h1>
            {profile.email && (
              <p className="text-slate-600 dark:text-slate-400 mb-4">{profile.email}</p>
            )}

            {/* Estadísticas */}
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pageMeta?.totalElements || posts.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {posts.length === 1 ? 'publicación' : 'publicaciones'}
                </div>
              </div>
              {profile.totalLikes !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {profile.totalLikes}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {profile.totalLikes === 1 ? 'like' : 'likes'}
                  </div>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <a
                href="/settings"
                className="btn-primary inline-flex items-center gap-2"
              >
                Editar Perfil
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid - Instagram Style */}
      <div>
        {isLoadingPosts ? (
          <LoadingOverlay message="Cargando publicaciones" />
        ) : posts.length === 0 ? (
          <EmptyState
            title="Sin publicaciones"
            description={isOwnProfile ? "Aún no has publicado nada. ¡Comparte algo con la comunidad!" : "Este usuario aún no ha publicado nada."}
          />
        ) : (
          <>
            {/* Grid estilo Instagram - 3 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
              {posts.map((post: Post) => {
                const imageUrl = post.mediaUrl ? (() => {
                  const url = post.mediaUrl!.trim();
                  if (url.startsWith('http://') || url.startsWith('https://')) {
                    return url;
                  }
                  if (url.startsWith('/api/files/')) {
                    return `${window.location.origin}${url}`;
                  }
                  if (url.startsWith('/')) {
                    return `${window.location.origin}${url}`;
                  }
                  const baseUrl = apiClient.defaults.baseURL || window.location.origin;
                  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                })() : null;

                return (
                  <Link
                    key={post.id}
                    to={`/posts`}
                    className="group relative aspect-square bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.content || 'Publicación'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600">
                        <div className="text-center p-4">
                          <p className="text-white text-sm font-medium line-clamp-3">
                            {post.content || 'Publicación'}
                          </p>
                          {post.musicUrl && (
                            <div className="mt-2">
                              <span className="text-white/80 text-xs">🎵 Música</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Overlay con información al hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <HeartIcon className="h-5 w-5" />
                        <span className="font-semibold">{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="font-semibold">0</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pageMeta && pageMeta.totalPages > 1 && (
              <div className="mt-8">
                <PaginationControls
                  page={pageMeta.page}
                  size={pageMeta.size}
                  totalElements={pageMeta.totalElements}
                  totalPages={pageMeta.totalPages}
                  onPageChange={setPage}
                  onSizeChange={(newSize) => {
                    setSize(newSize);
                    setPage(0);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

