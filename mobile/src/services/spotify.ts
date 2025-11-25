import axios from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

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
}

export interface SpotifySearchResponse {
    tracks: {
        items: SpotifyTrack[];
    };
}

export const spotifyService = {
    // Note: In production, you'd need to implement OAuth flow
    // For now, using client credentials or user token
    async searchTracks(query: string, token: string): Promise<SpotifyTrack[]> {
        try {
            const response = await axios.get<SpotifySearchResponse>(
                `${SPOTIFY_API_BASE}/search`,
                {
                    params: {
                        q: query,
                        type: 'track',
                        limit: 20,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.tracks.items;
        } catch (error) {
            console.error('Spotify search error:', error);
            throw new Error('Error al buscar música en Spotify');
        }
    },

    async getTrack(trackId: string, token: string): Promise<SpotifyTrack> {
        try {
            const response = await axios.get<SpotifyTrack>(
                `${SPOTIFY_API_BASE}/tracks/${trackId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Spotify get track error:', error);
            throw new Error('Error al obtener información de la canción');
        }
    },

    extractTrackId(spotifyUrl: string): string | null {
        // Extract track ID from Spotify URL
        // https://open.spotify.com/track/TRACK_ID
        const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    },

    formatTrackUrl(trackId: string): string {
        return `https://open.spotify.com/track/${trackId}`;
    },
};
