import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { chatService, Chat } from '../../services/chat';
import { useTheme } from '../../contexts/ThemeContext';

export const ChatScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

    const { data: chats, isLoading, error, refetch } = useQuery({
        queryKey: ['chats'],
        queryFn: () => chatService.getConversations(),
    });

    const styles = createStyles(theme);

    const renderChat = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('ChatDetail', {
                userId: item.otherUser.id,
                userName: item.otherUser.name
            })}
        >
            <View style={styles.avatarContainer}>
                {item.otherUser.profilePictureUrl ? (
                    <Image
                        source={{ uri: item.otherUser.profilePictureUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {item.otherUser.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                            {item.unreadCount > 99 ? '99+' : item.unreadCount}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName} numberOfLines={1}>
                        {item.otherUser.name}
                    </Text>
                    {item.lastMessage?.createdAt && (
                        <Text style={styles.chatTime}>
                            {formatTime(item.lastMessage.createdAt)}
                        </Text>
                    )}
                </View>
                <Text
                    style={[
                        styles.lastMessage,
                        item.unreadCount > 0 && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                >
                    {item.lastMessage?.content || 'Sin mensajes'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Helper function to format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
        });
    };

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mensajes</Text>
                    <Text style={styles.headerSubtitle}>Conversaciones</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>Error al cargar conversaciones</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mensajes</Text>
                <Text style={styles.headerSubtitle}>Conversaciones</Text>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Cargando conversaciones...</Text>
                </View>
            ) : (
                <FlatList
                    data={chats || []}
                    renderItem={renderChat}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={chats && chats.length > 0 ? styles.listContent : styles.emptyListContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>💬</Text>
                            <Text style={styles.emptyText}>No hay conversaciones</Text>
                            <Text style={styles.emptySubtext}>
                                Ve a la sección de amigos para iniciar una conversación
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    listContent: {
        padding: 16,
    },
    chatCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.surfaceVariant,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginRight: 8,
    },
    chatTime: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    lastMessage: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    unreadMessage: {
        fontWeight: '600',
        color: theme.colors.text,
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
    // Empty state
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
