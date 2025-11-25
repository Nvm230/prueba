import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { chatService, Chat } from '../../services/chat';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export const ChatScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: () => chatService.getConversations(),
    });

    const styles = createStyles(theme, isIOS);

    const renderChat = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
        >
            <View style={styles.avatarContainer}>
                {item.otherUser.profilePictureUrl ? (
                    <Image
                        source={{ uri: item.otherUser.profilePictureUrl }}
                        style={styles.avatar}
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
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.otherUser.name}</Text>
                    <Text style={styles.chatTime}>
                        {new Date(item.lastMessage?.createdAt || item.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                        })}
                    </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage?.content || 'Sin mensajes'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text>Cargando conversaciones...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Mensajes</Text>
                    <Text style={styles.headerSubtitle}>Conversaciones</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>Mensajes</Text>
                    <Text style={styles.headerSubtitleAndroid}>Conversaciones</Text>
                </View>
            )}

            <FlatList
                data={chats || []}
                renderItem={renderChat}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyText}>No hay conversaciones</Text>
                        <Text style={styles.emptySubtext}>Inicia una conversación</Text>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    listContent: {
        padding: 16,
    },
    chatCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    badge: {
        backgroundColor: '#8b5cf6',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeIOS: {
        borderRadius: 12,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
