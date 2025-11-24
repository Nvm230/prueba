import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';

interface MusicPlayerProps {
    musicUrl: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl }) => {
    const isIOS = Platform.OS === 'ios';

    // Extract Spotify track ID from URL
    const getSpotifyTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    const handlePlayMusic = () => {
        // Open Spotify URL
        Linking.openURL(musicUrl).catch(() => {
            // If Spotify app is not installed, open in browser
            Linking.openURL(`https://open.spotify.com/track/${getSpotifyTrackId(musicUrl)}`);
        });
    };

    const trackId = getSpotifyTrackId(musicUrl);

    if (!trackId) {
        return null;
    }

    return (
        <TouchableOpacity
            style={[styles.container, isIOS && styles.containerIOS]}
            onPress={handlePlayMusic}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.spotifyIcon}>🎵</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Música de Spotify</Text>
                <Text style={styles.subtitle}>Toca para reproducir</Text>
            </View>
            <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1DB954',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    containerIOS: {
        borderRadius: 16,
        shadowColor: '#1DB954',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    spotifyIcon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        fontSize: 16,
    },
});
