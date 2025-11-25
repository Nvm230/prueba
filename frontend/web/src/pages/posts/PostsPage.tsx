import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import { getPosts, createPost, toggleLikePost, deletePost, Post, getComments, createComment, deleteComment, Comment } from '@/services/postService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { getSpotifyTrack, SpotifyTrack } from '@/services/spotifyService';
import { PlusIcon, XMarkIcon, TrashIcon, HeartIcon, PlayIcon, PauseIcon, ChatBubbleLeftIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/display/Avatar';
import { formatDateTime } from '@/utils/formatters';
import PaginationControls from '@/components/data/PaginationControls';
import MusicSelector from '@/components/forms/MusicSelector';
import ImageUploader from '@/components/forms/ImageUploader';
import PostComments from '@/components/social/PostComments';
import apiClient from '@/services/apiClient';

const PostsPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', { page, size }],
    queryFn: ({ signal }) => getPosts({ page, size }, signal)
  });

  const createMutation = useMutation({
    mutationFn: () => {
      console.log('[POSTS] Creating post with:', {
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? 'IMAGE' : null,
        musicUrl: musicUrl || null,
        musicUrlLength: musicUrl?.length || 0,
        musicUrlTrimmed: musicUrl?.trim() || null
      });
      return createPost({
        content,
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaUrl ? 'IMAGE' : undefined,
        musicUrl: musicUrl && musicUrl.trim() !== '' ? musicUrl.trim() : undefined
      });
    },
    onSuccess: (data) => {
      console.log('[POSTS] Post created successfully:', data);
      pushToast({ type: 'success', title: 'Publicación creada', description: 'Tu publicación ha sido compartida.' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setShowCreateModal(false);
      setContent('');
      setMediaUrl(null);
      setMusicUrl('');
    },
    onError: (error: any) => {
      console.error('[POSTS] Error creating post:', error);
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo crear la publicación.' });
    }
  });

  // Detener música cuando cambia el post activo
  useEffect(() => {
    audioRefs.current.forEach((audio, postId) => {
      if (postId !== playingMusicId) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, [playingMusicId]);

  // Helper para verificar si una URL es válida para reproducir
  const isValidMusicUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    // Permitir cualquier URL HTTPS (previews de Spotify, enlaces de Spotify, archivos de audio, etc.)
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Helper para verificar si es un enlace de Spotify
  const isSpotifyLink = (url: string): boolean => {
    return url.includes('open.spotify.com/track/') || url.includes('open.spotify.com/album/');
  };

  // Helper para convertir enlace de Spotify a embed URL
  const getSpotifyEmbedUrl = (url: string): string => {
    // Extraer el ID del track o album del enlace
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/);

    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`;
    } else if (albumMatch) {
      return `https://open.spotify.com/embed/album/${albumMatch[1]}?utm_source=generator`;
    }
    return url;
  };

  // Helper para extraer track ID de URL de Spotify
  const getSpotifyTrackId = (url: string): string | null => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Componente para mostrar el reproductor de música (memoizado para evitar re-renders)
  const MusicPlayer = React.memo(({ post }: { post: Post }) => {
    const [trackInfo, setTrackInfo] = useState<SpotifyTrack | null>(null);
    const trackId = post.musicUrl ? getSpotifyTrackId(post.musicUrl) : null;
    const hasImage = post.mediaUrl && post.mediaUrl.trim() !== '';

    useEffect(() => {
      if (trackId) {
        getSpotifyTrack(trackId)
          .then((track) => {
            if (track) setTrackInfo(track);
          })
          .catch((error) => {
            console.error('Error fetching track info:', error);
          });
      }
    }, [trackId]);

    if (!isValidMusicUrl(post.musicUrl)) return null;

    const isSpotify = isSpotifyLink(post.musicUrl!);
    const embedUrl = isSpotify ? getSpotifyEmbedUrl(post.musicUrl!) : null;
    const albumImage = trackInfo?.album?.images?.[0]?.url;

    if (isSpotify && embedUrl) {
      // Tamaño específico para publicaciones: más pequeño cuando hay imagen
      const height = hasImage ? '152' : '232';
      return (
        <div className={`${hasImage ? 'mb-3' : 'mb-4'} mx-6 rounded-2xl overflow-hidden shadow-lg`}>
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-2xl w-full block"
            style={{ border: 'none', display: 'block', margin: 0, padding: 0 }}
          ></iframe>
        </div>
      );
    }

    // Para previews de audio, mostrar un reproductor personalizado
    // Más pequeño cuando hay imagen
    const padding = hasImage ? 'p-2' : 'p-4';
    const imageSize = hasImage ? 'w-12 h-12' : 'w-16 h-16';
    const textSize = hasImage ? 'text-sm' : 'text-base';
    const iconSize = hasImage ? 'h-6 w-6' : 'h-8 w-8';

    return (
      <div className={`${hasImage ? 'mb-3' : 'mb-4'} mx-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 ${padding} shadow-xl ring-1 ring-primary-500/20`}>
        <div className="flex items-center gap-3">
          {albumImage ? (
            <img src={albumImage} alt={trackInfo?.album.name || 'Album'} className={`${imageSize} rounded-xl object-cover flex-shrink-0 shadow-lg ring-2 ring-white/20`} />
          ) : (
            <div className={`${imageSize} bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20`}>
              <MusicalNoteIcon className={`${iconSize} text-white`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className={`text-white font-bold ${textSize} mb-0.5 truncate drop-shadow-sm`}>
              {trackInfo?.name || 'Canción'}
            </h4>
            <p className={`text-white/90 ${hasImage ? 'text-xs' : 'text-sm'} mb-2 truncate drop-shadow-sm`}>
              {trackInfo?.artists.map(a => a.name).join(', ') || 'Artista'}
            </p>
            {!hasImage && (
              <button
                onClick={() => handlePlayMusic(post.id, post.musicUrl!)}
                className="flex items-center gap-2 text-white hover:text-white transition-all duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105"
              >
                {playingMusicId === post.id ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold">Pausar</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold">Reproducir</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  const handlePlayMusic = (postId: number, musicUrl: string) => {
    console.log('[POSTS] handlePlayMusic called with:', { postId, musicUrl });

    // Si la URL está vacía o no es válida, no intentar reproducir
    if (!musicUrl || musicUrl.trim() === '') {
      console.log('[POSTS] Music URL is empty');
      pushToast({
        type: 'warning',
        title: 'Música no disponible',
        description: 'No hay música disponible para reproducir.'
      });
      return;
    }

    // Para enlaces de Spotify, el embed se muestra directamente en el post
    // No necesitamos hacer nada aquí, el embed se renderiza automáticamente

    console.log('[POSTS] Attempting to play music with URL:', musicUrl);

    // Detener todas las demás músicas
    audioRefs.current.forEach((audio, id) => {
      if (id !== postId) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Obtener o crear el audio element
    let audio = audioRefs.current.get(postId);
    if (!audio) {
      // Construir URL completa si es relativa
      const fullUrl = (() => {
        if (musicUrl.startsWith('http://') || musicUrl.startsWith('https://')) {
          return musicUrl;
        }
        // Para URLs de Spotify preview, usar directamente
        if (musicUrl.includes('spotify') || musicUrl.includes('preview')) {
          return musicUrl;
        }
        // Para URLs relativas
        if (musicUrl.startsWith('/')) {
          return `${window.location.origin}${musicUrl}`;
        }
        // Construir URL completa
        const baseUrl = apiClient.defaults.baseURL || window.location.origin;
        return `${baseUrl}${musicUrl.startsWith('/') ? '' : '/'}${musicUrl}`;
      })();

      console.log('Creando audio con URL:', fullUrl);

      audio = new Audio(fullUrl);
      audio.loop = true;
      audio.crossOrigin = 'anonymous';

      // Manejar errores de reproducción
      audio.addEventListener('error', (e) => {
        console.error('Error al reproducir música:', {
          error: e,
          url: fullUrl,
          originalUrl: musicUrl
        });
        pushToast({
          type: 'error',
          title: 'Error de reproducción',
          description: 'No se pudo reproducir la música. Verifica que la URL sea válida.'
        });
        setPlayingMusicId(null);
      });

      audio.addEventListener('canplay', () => {
        console.log('Audio listo para reproducir:', fullUrl);
      });

      audio.addEventListener('loadstart', () => {
        console.log('Cargando audio:', fullUrl);
      });

      audioRefs.current.set(postId, audio);
    }

    if (playingMusicId === postId) {
      // Si ya está reproduciendo, pausar
      audio.pause();
      setPlayingMusicId(null);
    } else {
      // Reproducir
      audio.play()
        .then(() => {
          console.log('Música reproduciéndose:', musicUrl);
          setPlayingMusicId(postId);
        })
        .catch((error) => {
          console.error('Error al reproducir:', {
            error,
            url: audio.src,
            originalUrl: musicUrl
          });
          pushToast({
            type: 'error',
            title: 'Error de reproducción',
            description: 'No se pudo reproducir la música. Puede ser un problema de CORS o la URL no es válida.'
          });
        });
    }
  };

  const likeMutation = useMutation({
    mutationFn: (postId: number) => toggleLikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Publicación eliminada', description: 'La publicación ha sido eliminada.' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo eliminar la publicación.' });
    }
  });

  const posts = postsData?.content || [];
  const pageMeta = postsData ? {
    totalElements: postsData.totalElements,
    totalPages: postsData.totalPages,
    page: postsData.page,
    size: postsData.size
  } : null;

  if (isLoading) {
    return <LoadingOverlay message="Cargando publicaciones" />;
  }

  return (
    <div className="animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Publicaciones' }]} />

      {/* Header */}
      <div className="mb-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Publicaciones</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comparte tus pensamientos y momentos con la comunidad
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva Publicación
            </button>
          )}
        </div>
      </div>

      {/* Contenedor centrado estilo Instagram */}
      <div className="max-w-2xl mx-auto">
        {posts.length === 0 ? (
          <EmptyState
            title="Sin publicaciones"
            description="Aún no hay publicaciones. ¡Sé el primero en compartir algo!"
          />
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="card glow-on-hover group animate-fade-in-up rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                  {/* Header del post - usuario y fecha */}
                  <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50/80 via-purple-50/30 to-cyan-50/20 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 backdrop-blur-sm rounded-t-3xl">
                    <Link to={`/profile/${post.user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <Avatar user={post.user} size="md" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {post.user.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDateTime(post.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <div className="ml-auto">
                      {(user && (user.id === post.user.id || user.role === 'ADMIN')) && (
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta publicación?')) {
                              deleteMutation.mutate(post.id);
                            }
                          }}
                          className="p-2.5 rounded-xl hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 hover:text-error-600 transition-all duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Música - arriba de la imagen */}
                  {isValidMusicUrl(post.musicUrl) && (
                    <div className="mb-5 mt-4">
                      <MusicPlayer post={post} />
                    </div>
                  )}

                  {/* Imagen */}
                  {post.mediaUrl && post.mediaUrl.trim() !== '' && (() => {
                    const imageUrl = (() => {
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
                    })();

                    return (
                      <div className="w-full relative mb-3 flex justify-center">
                        {/* Fondo difuminado de la imagen */}
                        <div
                          className="absolute inset-0 blur-3xl opacity-40 -z-10 rounded-2xl"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: 'scale(1.2)'
                          }}
                        />

                        {/* Contenedor interno con bordes redondeados y sombra mejorada */}
                        <div className="relative overflow-hidden shadow-2xl rounded-3xl mx-6" style={{ maxHeight: '600px', maxWidth: '100%' }}>
                          <img
                            src={imageUrl}
                            alt="Publicación"
                            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.01]"
                            style={{ maxHeight: '600px', display: 'block' }}
                            onError={(e) => {
                              console.error('[POST] Error loading image:', imageUrl);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.style.display = 'none';
                              }
                            }}
                            onLoad={() => {
                              console.log('[POST] Image loaded successfully:', post.mediaUrl);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Contenido del post - abajo de la imagen */}
                  {post.content && post.content.trim() !== '' && (
                    <div className="px-6 pb-4 mt-1">
                      <div className="glass-card p-5 rounded-2xl shadow-inner border-0 ring-1 ring-primary-500/10 mb-3">
                        <p className="text-slate-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed text-base">{post.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Acciones - dentro del card pero después del contenido */}
                  <div className="px-6 pb-5 rounded-b-3xl bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => likeMutation.mutate(post.id)}
                        disabled={likeMutation.isLoading}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${post.isLiked
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/40'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        <HeartIcon className={`h-5 w-5 ${post.isLiked ? 'fill-current animate-bounce-subtle' : ''}`} />
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </button>
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedComments);
                          if (newExpanded.has(post.id)) {
                            newExpanded.delete(post.id);
                          } else {
                            newExpanded.add(post.id);
                          }
                          setExpandedComments(newExpanded);
                        }}
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm font-semibold">Comentar</span>
                      </button>
                    </div>
                  </div>

                  {/* Comentarios */}
                  {expandedComments.has(post.id) && (
                    <PostComments postId={post.id} />
                  )}
                </div>
              ))}
            </div>

            {pageMeta && (
              <div className="mt-8">
                <div className="card">
                  <PaginationControls
                    page={pageMeta.page}
                    size={pageMeta.size}
                    totalPages={pageMeta.totalPages}
                    totalElements={pageMeta.totalElements}
                    onPageChange={setPage}
                    onSizeChange={(newSize) => {
                      setSize(newSize);
                      setPage(0); // Resetear a la primera página cuando cambia el tamaño
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nueva Publicación</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contenido <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="¿Qué estás pensando?"
                  rows={5}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Imagen (Opcional)
                </label>
                <ImageUploader
                  value={mediaUrl}
                  onChange={setMediaUrl}
                  onError={(error) => pushToast({ type: 'error', title: 'Error', description: error })}
                />
              </div>
              <MusicSelector
                value={musicUrl}
                onChange={(url) => {
                  console.log('[POSTS] MusicSelector onChange:', url);
                  setMusicUrl(url);
                }}
                label="Música"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => createMutation.mutate()}
                  disabled={!content.trim() || createMutation.isLoading}
                  className="flex-1 btn-primary"
                >
                  {createMutation.isLoading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostsPage;

