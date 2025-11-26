import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, Post } from '../../services/posts';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { MusicPlayer } from '../../components/features/MusicPlayer';
import { getAbsoluteUrl } from '../../utils/url';

export const SocialScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);

    const { data: postsData, isLoading, error, refetch } = useQuery({
        queryKey: ['posts', page],
        queryFn: ({ signal }) => postService.getAll({ page, size: 10 }, signal),
    });

    const likeMutation = useMutation({
        mutationFn: (postId: number) => postService.toggleLike(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const styles = createStyles(theme);

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.postCard}>
            {/* User Header */}
            <View style={styles.postHeader}>
                {item.user.profilePictureUrl ? (
                    <Image
                        source={{ uri: getAbsoluteUrl(item.user.profilePictureUrl) }}
                        style={styles.avatar}
                        resizeMode="cover"
                        onError={(e) => console.log('Avatar load error:', e.nativeEvent.error)}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <Text style={styles.postTime}>
                        {new Date(item.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            </View>

            {/* Content */}
            {item.content && (
                <Text style={styles.postContent}>{item.content}</Text>
            )}

            {/* Media */}
            {item.mediaUrl && (
                <Image
                    source={{ uri: getAbsoluteUrl(item.mediaUrl) }}
                    style={styles.postImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Post image load error:', e.nativeEvent.error)}
                />
            )}

            {/* Music */}
            {item.musicUrl && (
                <MusicPlayer musicUrl={item.musicUrl} />
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => likeMutation.mutate(item.id)}
                    disabled={likeMutation.isPending}
                >
                    <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
                    <Text style={styles.actionText}>{item.likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
                >
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{item.commentsCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Social</Text>
                    <Text style={styles.headerSubtitle}>Publicaciones</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>Error al cargar publicaciones</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Simple Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Social</Text>
                <Text style={styles.headerSubtitle}>Publicaciones</Text>
            </View>

            {/* New Post Button */}
            <TouchableOpacity
                style={styles.newPostButton}
                onPress={() => navigation.navigate('CreatePost')}
            >
                <Text style={styles.newPostText}>+ Nueva Publicación</Text>
            </TouchableOpacity>

            {/* Posts List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Cargando publicaciones...</Text>
                </View>
            ) : postsData?.content && postsData.content.length > 0 ? (
                <FlatList
                    data={postsData.content}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyText}>No hay publicaciones aún</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('CreatePost')}
                    >
                        <Text style={styles.createButtonText}>Crear Primera Publicación</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#ffffffdd',
    },
    createContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    postCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: theme.colors.surfaceVariant,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    postTime: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    postContent: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: theme.colors.surfaceVariant,
    },
    musicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    musicIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    musicText: {
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionIcon: {
        fontSize: 20,
    },
    actionText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    // Error states
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Loading states
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    // New post button
    newPostButton: {
        backgroundColor: theme.colors.primary,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    newPostText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    // List
    listContainer: {
        padding: 16,
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
