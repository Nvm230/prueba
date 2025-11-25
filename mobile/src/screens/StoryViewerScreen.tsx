import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storyService, Story } from '../../services/stories';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const StoryViewerScreen = ({ route, navigation }: any) => {
    const { storyId } = route.params;
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [progress, setProgress] = useState(0);

    const { data: story } = useQuery({
        queryKey: ['story', storyId],
        queryFn: ({ signal }) => storyService.getAll(signal).then(stories =>
            stories.find(s => s.id === storyId)
        ),
    });

    const markViewedMutation = useMutation({
        mutationFn: () => storyService.markAsViewed(storyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });

    useEffect(() => {
        if (story && !story.hasViewed) {
            markViewedMutation.mutate();
        }
    }, [story]);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    navigation.goBack();
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // 5 seconds total

        return () => clearInterval(timer);
    }, []);

    const styles = createStyles(theme);

    if (!story) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Story Image/Video */}
            <Image
                source={{ uri: story.mediaUrl }}
                style={styles.media}
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
                style={styles.overlay}
            />

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {story.user.profilePictureUrl ? (
                        <Image
                            source={{ uri: story.user.profilePictureUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {story.user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{story.user.name}</Text>
                        <Text style={styles.storyTime}>
                            {new Date(story.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Music Indicator */}
            {story.musicUrl && (
                <View style={styles.musicIndicator}>
                    <Text style={styles.musicIcon}>🎵</Text>
                    <Text style={styles.musicText}>Música</Text>
                </View>
            )}

            {/* View Count */}
            <View style={styles.footer}>
                <Text style={styles.viewCount}>👁️ {story.viewCount} vistas</Text>
            </View>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    media: {
        width: width,
        height: height,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
    progressContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 8,
        right: 8,
    },
    progressBar: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ffffff',
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 80 : 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 2,
    },
    storyTime: {
        fontSize: 13,
        color: '#ffffffcc',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    musicIndicator: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    musicIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    musicText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 16,
        alignItems: 'center',
    },
    viewCount: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
});
