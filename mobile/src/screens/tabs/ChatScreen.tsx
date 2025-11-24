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
import { chatService, Conversation } from '../../services/chat';
import { LinearGradient } from 'expo-linear-gradient';

export const ChatScreen = ({ navigation }: any) => {
    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: chatService.getConversations,
    });

    const isIOS = Platform.OS === 'ios';

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={[styles.conversationItem, isIOS && styles.conversationItemIOS]}
            onPress={() => navigation.navigate('ChatDetail', { userId: item.userId, userName: item.userName })}
        >
            <Image
                source={{ uri: item.userPhoto || 'https://via.placeholder.com/50' }}
                style={styles.avatar}
            />
            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.time}>
                        {new Date(item.lastMessageTime).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
                <View style={styles.messagePreview}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={[styles.badge, isIOS && styles.badgeIOS]}>
                            <Text style={styles.badgeText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
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
            {isIOS && (
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>💬 Mensajes</Text>
                </LinearGradient>
            )}

            {!isIOS && (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>💬 Mensajes</Text>
                </View>
            )}

            <FlatList
                data={conversations}
                renderItem={renderConversation}
                keyExtractor={(item) => item.userId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No tienes conversaciones</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerAndroid: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#8b5cf6',
    },
    headerTitleAndroid: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listContent: {
        padding: 16,
    },
    conversationItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    conversationItemIOS: {
        borderRadius: 16,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    avatar: {
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
