import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSpotifyTracks, SpotifyTrack } from '@/services/spotifyService';
import { MusicalNoteIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface MusicSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const MusicSelector: React.FC<MusicSelectorProps> = ({
  value,
  onChange,
  label = 'Música'
}) => {
  const [spotifyQuery, setSpotifyQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const debouncedQuery = useDebouncedValue(spotifyQuery, 500);

  // Si hay un valor pero no hay track seleccionado, limpiar
  useEffect(() => {
    if (!value && selectedTrack) {
      setSelectedTrack(null);
      setSpotifyQuery('');
    }
  }, [value, selectedTrack]);

  const { data: spotifyTracks = [], isLoading: searchingSpotify } = useQuery({
    queryKey: ['spotify-search', debouncedQuery],
    queryFn: ({ signal }) => searchSpotifyTracks(debouncedQuery, 10, signal),
    enabled: debouncedQuery.length > 2
  });

  // Log para debugging
  useEffect(() => {
    if (spotifyTracks.length > 0) {
      const tracksWithPreview = spotifyTracks.filter(track => track.preview_url);
      console.log('[MusicSelector] Total tracks:', spotifyTracks.length);
      console.log('[MusicSelector] Tracks with preview:', tracksWithPreview.length);
      console.log('[MusicSelector] Tracks:', tracksWithPreview);
    }
  }, [spotifyTracks]);

  useEffect(() => {
    if (selectedTrack) {
      // Usar preview_url si existe, sino usar external_url de Spotify para la canción completa
      const musicUrl = selectedTrack.preview_url || selectedTrack.external_urls?.spotify || '';
      console.log('[MusicSelector] Setting music URL:', musicUrl, 'preview_url:', selectedTrack.preview_url, 'external_url:', selectedTrack.external_urls?.spotify);
      onChange(musicUrl);
    }
  }, [selectedTrack, onChange]);

  const handleTrackSelect = (track: SpotifyTrack) => {
    console.log('[MusicSelector] Track selected:', track);
    // Actualizar el track seleccionado y el query
    setSelectedTrack(track);
    setSpotifyQuery(track.name);
    // Actualizar el valor inmediatamente para evitar el bug de doble clic
    const musicUrl = track.preview_url || track.external_urls?.spotify || '';
    console.log('[MusicSelector] Setting music URL immediately:', musicUrl);
    onChange(musicUrl);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>

        {/* Búsqueda de Spotify */}
        <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={spotifyQuery}
                onChange={(e) => setSpotifyQuery(e.target.value)}
                placeholder="Buscar en Spotify..."
                className="input-field pl-10"
              />
            </div>

            {selectedTrack && (
              <div className="p-3 bg-slate-800 dark:bg-slate-700 rounded-lg border border-slate-700 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {selectedTrack.album.images[0] && (
                      <img
                        src={selectedTrack.album.images[0].url}
                        alt={selectedTrack.album.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {selectedTrack.name}
                      </p>
                      <p className="text-sm text-slate-300 truncate">
                        {selectedTrack.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrack(null);
                      onChange('');
                    }}
                    className="p-1 rounded hover:bg-slate-700 dark:hover:bg-slate-600 text-white"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {!selectedTrack && spotifyTracks.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-700 dark:border-slate-600 rounded-lg p-2 bg-slate-800 dark:bg-slate-800 z-50 relative">
                {spotifyTracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('[MusicSelector] Button clicked for track:', track);
                      handleTrackSelect(track);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
                  >
                    {track.album.images[0] && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate text-sm">
                        {track.name}
                      </p>
                      <p className="text-xs text-slate-300 truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchingSpotify && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                Buscando...
              </p>
            )}

            {!searchingSpotify && spotifyTracks.length === 0 && debouncedQuery.length > 2 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                No se encontraron canciones
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default MusicSelector;

