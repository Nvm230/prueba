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
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, Post } from '../../services/posts';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export const SocialScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isIOS = Platform.OS === 'ios';
    const [page, setPage] = useState(0);

    const { data: postsData, isLoading, refetch } = useQuery({
        queryKey: ['posts', page],
        queryFn: ({ signal }) => postService.getAll({ page, size: 10 }, signal),
    });

    const likeMutation = useMutation({
        mutationFn: (postId: number) => postService.toggleLike(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const styles = createStyles(theme, isIOS);

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.postCard}>
            {/* User Header */}
            <View style={styles.postHeader}>
                {item.user.profilePictureUrl ? (
                    <Image source={{ uri: item.user.profilePictureUrl }} style={styles.avatar} />
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
                <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />
            )}

            {/* Music */}
            {item.musicUrl && (
                <View style={styles.musicCard}>
                    <Text style={styles.musicIcon}>🎵</Text>
                    <Text style={styles.musicText}>Música adjunta</Text>
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => likeMutation.mutate(item.id)}
                >
                    <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
                    <Text style={styles.actionText}>{item.likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{item.commentsCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Social</Text>
                    <Text style={styles.headerSubtitle}>Publicaciones</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>Social</Text>
                    <Text style={styles.headerSubtitleAndroid}>Publicaciones</Text>
                </View>
            )}

            {/* Create Post Button */}
            <View style={styles.createContainer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreatePost')}
                >
                    <Text style={styles.createButtonText}>+ Nueva Publicación</Text>
                </TouchableOpacity>
            </View>

            {/* Posts List */}
            <FlatList
                data={postsData?.content || []}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📱</Text>
                        <Text style={styles.emptyText}>No hay publicaciones</Text>
                        <Text style={styles.emptySubtext}>Sé el primero en publicar</Text>
                    </View>
                }
            />
        </View>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ffffffcc',
    },
    headerAndroid: {
        paddingTop: 80,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    headerTitleAndroid: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitleAndroid: {
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
        borderRadius: 16,
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
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
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
        gap: 24,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        fontSize: 22,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
