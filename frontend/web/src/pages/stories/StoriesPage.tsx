import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import { getAllStories, createStory, deleteStory, Story } from '@/services/storyService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { PlusIcon, XMarkIcon, TrashIcon, PlayIcon, PauseIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { getSpotifyTrack, SpotifyTrack } from '@/services/spotifyService';
import { useState, useRef, useEffect } from 'react';
import Avatar from '@/components/display/Avatar';
import MusicSelector from '@/components/forms/MusicSelector';
import ImageUploader from '@/components/forms/ImageUploader';

const StoriesPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [musicUrl, setMusicUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null);
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: ({ signal }) => getAllStories(signal),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: () => createStory({
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
      musicUrl: musicUrl || undefined,
      caption: caption || undefined
    }),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Historia creada', description: 'Tu historia ha sido publicada.' });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      setShowCreateModal(false);
      setMediaUrl('');
      setMusicUrl('');
      setCaption('');
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo crear la historia.' });
    }
  });

  // Detener música cuando cambia la historia activa
  useEffect(() => {
    audioRefs.current.forEach((audio, storyId) => {
      if (storyId !== playingMusicId) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, [playingMusicId]);

  // Helper para verificar si una URL es válida para reproducir
  const isValidMusicUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Helper para verificar si es un enlace de Spotify
  const isSpotifyLink = (url: string): boolean => {
    return url.includes('open.spotify.com/track/') || url.includes('open.spotify.com/album/');
  };

  // Helper para convertir enlace de Spotify a embed URL
  const getSpotifyEmbedUrl = (url: string): string => {
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

  // Componente para mostrar el reproductor de música en historias
  const StoryMusicPlayer = ({ story }: { story: Story }) => {
    const [trackInfo, setTrackInfo] = useState<SpotifyTrack | null>(null);
    const trackId = story.musicUrl ? getSpotifyTrackId(story.musicUrl) : null;
    const hasImage = story.mediaUrl && story.mediaUrl.trim() !== '';

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

    if (!isValidMusicUrl(story.musicUrl)) return null;

    const isSpotify = isSpotifyLink(story.musicUrl!);
    const embedUrl = isSpotify ? getSpotifyEmbedUrl(story.musicUrl!) : null;
    const albumImage = trackInfo?.album?.images?.[0]?.url;

    if (isSpotify && embedUrl) {
      // Tamaño específico para historias: más pequeño cuando hay imagen (igual que publicaciones)
      const height = hasImage ? '152' : '232';
      return (
        <div className={`${hasImage ? 'mb-2' : 'mb-3'} mx-4 rounded-xl overflow-hidden`}>
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl w-full block"
            style={{ border: 'none', display: 'block', margin: 0, padding: 0 }}
          ></iframe>
        </div>
      );
    }

    const padding = hasImage ? 'p-2' : 'p-4';
    const imageSize = hasImage ? 'w-10 h-10' : 'w-16 h-16';
    const textSize = hasImage ? 'text-xs' : 'text-base';
    const iconSize = hasImage ? 'h-5 w-5' : 'h-8 w-8';
    
    return (
      <div className={`${hasImage ? 'mb-2' : 'mb-3'} mx-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 ${padding} shadow-xl ring-1 ring-primary-500/20`}>
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
                onClick={() => handlePlayMusic(story.id, story.musicUrl!)}
                className="flex items-center gap-2 text-white hover:text-white transition-all duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105"
              >
                {playingMusicId === story.id ? (
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
  };

  const handlePlayMusic = (storyId: number, musicUrl: string) => {
    // Si la URL está vacía o no es válida, no intentar reproducir
    if (!musicUrl || musicUrl.trim() === '') {
      pushToast({ 
        type: 'warning', 
        title: 'Música no disponible', 
        description: 'No hay música disponible para reproducir.' 
      });
      return;
    }

    // Para enlaces de Spotify, el embed se muestra directamente en la historia
    // No necesitamos hacer nada aquí, el embed se renderiza automáticamente

    // Detener todas las demás músicas
    audioRefs.current.forEach((audio, id) => {
      if (id !== storyId) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Obtener o crear el audio element
    let audio = audioRefs.current.get(storyId);
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
        return `${window.location.origin}${musicUrl.startsWith('/') ? '' : '/'}${musicUrl}`;
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
      });
      
      audioRefs.current.set(storyId, audio);
    }

    if (playingMusicId === storyId) {
      // Si ya está reproduciendo, pausar
      audio.pause();
      setPlayingMusicId(null);
    } else {
      // Reproducir
      audio.play()
        .then(() => {
          console.log('Música reproduciéndose:', musicUrl);
          setPlayingMusicId(storyId);
        })
        .catch((error) => {
          console.error('Error al reproducir:', {
            error,
            url: audio.src,
            originalUrl: musicUrl
          });
        });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (storyId: number) => deleteStory(storyId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Historia eliminada', description: 'La historia ha sido eliminada.' });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo eliminar la historia.' });
    }
  });

  // Group stories by user
  const storiesByUser = stories.reduce((acc, story) => {
    const userId = story.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: []
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {} as Record<number, { user: Story['user']; stories: Story[] }>);

  if (isLoading) {
    return <LoadingOverlay message="Cargando historias" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Historias' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Historias</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comparte momentos que desaparecen en 24 horas
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Crear Historia
          </button>
        )}
      </div>

      {Object.keys(storiesByUser).length === 0 ? (
        <EmptyState
          title="Sin historias"
          description="Aún no hay historias disponibles. ¡Sé el primero en compartir una!"
        />
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {Object.values(storiesByUser).map(({ user: storyUser, stories: userStories }) => (
            <div key={storyUser.id} className="card">
              <div className="flex items-center gap-3 mb-4 px-4 pt-4">
                <Link to={`/profile/${storyUser.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1">
                  <Avatar user={storyUser} size="md" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {storyUser.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {userStories.length} {userStories.length === 1 ? 'historia' : 'historias'}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="space-y-4 pb-4">
                {userStories.map((story) => (
                  <div key={story.id} className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden mx-4 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    {/* Música - arriba de la imagen */}
                    {isValidMusicUrl(story.musicUrl) && (
                      <div className="pt-3">
                        <StoryMusicPlayer story={story} />
                      </div>
                    )}
                    
                    {story.mediaUrl && story.mediaUrl.trim() !== '' && story.mediaType === 'VIDEO' ? (
                      <div className="mx-4 mb-3 overflow-hidden rounded-2xl">
                        <video
                          src={(() => {
                            const url = story.mediaUrl;
                            if (url.startsWith('http://') || url.startsWith('https://')) {
                              return url;
                            }
                            if (url.startsWith('/api/files/')) {
                              return `${window.location.origin}${url}`;
                            }
                            if (url.startsWith('/')) {
                              return `${window.location.origin}${url}`;
                            }
                            const baseUrl = window.location.origin;
                            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                          })()}
                          className="w-full object-contain bg-black rounded-2xl"
                          style={{ maxHeight: '600px', display: 'block' }}
                          controls
                        />
                      </div>
                    ) : story.mediaUrl && story.mediaUrl.trim() !== '' ? (
                      <div className="mx-4 mb-3 overflow-hidden rounded-2xl">
                        <img
                          src={(() => {
                            const url = story.mediaUrl;
                            if (url.startsWith('http://') || url.startsWith('https://')) {
                              return url;
                            }
                            if (url.startsWith('/api/files/')) {
                              return `${window.location.origin}${url}`;
                            }
                            if (url.startsWith('/')) {
                              return `${window.location.origin}${url}`;
                            }
                            const baseUrl = window.location.origin;
                            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                          })()}
                          alt={story.caption || 'Historia'}
                          className="w-full object-contain bg-black rounded-2xl"
                          style={{ maxHeight: '600px', display: 'block' }}
                        />
                      </div>
                    ) : null}
                    {(!story.mediaUrl || !story.mediaUrl.trim()) && (story.caption || story.musicUrl) && (
                      <div className="px-4 py-6 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 rounded-2xl mx-4 mb-3">
                        {story.caption && story.caption.trim() !== '' && (
                          <p className="text-white text-base font-medium whitespace-pre-wrap break-words mb-3 drop-shadow-sm">{story.caption}</p>
                        )}
                        {story.musicUrl && story.musicUrl.trim() !== '' && (
                          <button
                            onClick={() => handlePlayMusic(story.id, story.musicUrl!)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-md hover:shadow-lg"
                            title={playingMusicId === story.id ? 'Pausar música' : 'Reproducir música'}
                          >
                            {playingMusicId === story.id ? (
                              <PauseIcon className="h-5 w-5 text-white" />
                            ) : (
                              <PlayIcon className="h-5 w-5 text-white" />
                            )}
                            <span className="text-white text-sm font-medium">
                              {playingMusicId === story.id ? 'Reproduciendo...' : 'Reproducir música'}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                    {/* Contenido del texto - abajo de la imagen */}
                    {story.mediaUrl && story.mediaUrl.trim() !== '' && story.caption && story.caption.trim() !== '' && (
                      <div className="px-4 pb-3">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-700/80 rounded-xl p-3 shadow-inner border border-slate-200/50 dark:border-slate-600/50">
                          <p className="text-slate-900 dark:text-white text-sm whitespace-pre-wrap break-words leading-relaxed">{story.caption}</p>
                        </div>
                      </div>
                    )}
                    {user && user.id === story.user.id && (
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta historia?')) {
                            deleteMutation.mutate(story.id);
                          }
                        }}
                        className="absolute bottom-3 right-3 bg-error-500 hover:bg-error-600 text-white rounded-full p-2.5 transition-all duration-200 shadow-xl z-10 hover:scale-110"
                        title="Eliminar historia"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Crear Historia</h2>
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
                  Imagen o Video (Opcional)
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Puedes crear una historia solo con texto y música, sin imagen
                </p>
                <ImageUploader
                  value={mediaUrl}
                  onChange={(url) => {
                    setMediaUrl(url);
                    setMediaType('IMAGE');
                  }}
                  onError={(error) => pushToast({ type: 'error', title: 'Error', description: error })}
                />
              </div>
              <MusicSelector
                value={musicUrl}
                onChange={(url) => {
                  console.log('[STORIES] MusicSelector onChange:', url);
                  setMusicUrl(url);
                }}
                label="Música"
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Añade una descripción..."
                  rows={3}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isLoading || (!mediaUrl && !musicUrl && !caption)}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isLoading ? 'Creando...' : 'Crear Historia'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoriesPage;

