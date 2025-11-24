import apiClient from './apiClient';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

/**
 * Buscar canciones en Spotify
 * Nota: Esto requiere un backend que maneje la autenticación con Spotify
 * Por ahora, retorna una función que puede ser implementada cuando se configure el backend
 */
export const searchSpotifyTracks = async (
  query: string,
  limit: number = 20,
  signal?: AbortSignal
): Promise<SpotifyTrack[]> => {
  try {
    // Llamar al backend que tiene la integración con Spotify
    const response = await apiClient.get<SpotifySearchResponse>('/api/spotify/search', {
      params: { q: query, limit },
      signal
    });
    
    // Verificar que la respuesta tenga la estructura correcta
    if (response.data && response.data.tracks && response.data.tracks.items) {
      return response.data.tracks.items;
    }
    
    console.warn('Spotify API response structure unexpected:', response.data);
    return [];
  } catch (error: any) {
    console.error('Error al buscar en Spotify:', error);
    
    // Si el endpoint no existe aún o hay un error, retornar array vacío
    if (error.response?.status === 404 || error.response?.status === 503) {
      console.warn('Spotify API endpoint not configured or unavailable');
      return [];
    }
    
    // Si es un error 401, puede ser que necesite autenticación
    if (error.response?.status === 401) {
      console.warn('Spotify API requires authentication');
      return [];
    }
    
    throw error;
  }
};

/**
 * Obtener información de una canción de Spotify por ID
 */
export const getSpotifyTrack = async (
  trackId: string,
  signal?: AbortSignal
): Promise<SpotifyTrack | null> => {
  try {
    const response = await apiClient.get<SpotifyTrack>(`/api/spotify/tracks/${trackId}`, { signal });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

