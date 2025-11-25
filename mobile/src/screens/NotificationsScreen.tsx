// NotificationsScreen with different notification types
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'event' | 'mention';
    user: {
        name: string;
        profilePictureUrl?: string;
    };
    message: string;
    time: string;
    read: boolean;
}

export const NotificationsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'like',
            user: { name: 'María García' },
            message: 'le dio like a tu publicación',
            time: 'Hace 5 min',
            read: false,
        },
        {
            id: '2',
            type: 'comment',
            user: { name: 'Juan Pérez' },
            message: 'comentó en tu post',
            time: 'Hace 15 min',
            read: false,
        },
        {
            id: '3',
            type: 'follow',
            user: { name: 'Ana López' },
            message: 'comenzó a seguirte',
            time: 'Hace 1 hora',
            read: true,
        },
        {
            id: '4',
            type: 'event',
            user: { name: 'Carlos Ruiz' },
            message: 'te invitó a un evento',
            time: 'Hace 2 horas',
            read: true,
        },
    ]);

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'like':
                return '❤️';
            case 'comment':
                return '💬';
            case 'follow':
                return '👤';
            case 'event':
                return '📅';
            case 'mention':
                return '@';
            default:
                return '🔔';
        }
    };

    const renderNotification = ({ item, index }: { item: Notification; index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable onPress={() => markAsRead(item.id)}>
                <Card
                    variant={item.read ? 'glass' : 'premium'}
                    style={[styles.notificationCard, !item.read && styles.unreadCard]}
                >
                    <View style={styles.notificationContent}>
                        <Avatar uri={item.user.profilePictureUrl} name={item.user.name} size={48} />
                        <View style={styles.notificationText}>
                            <Text style={styles.notificationMessage}>
                                <Text style={styles.userName}>{item.user.name}</Text>{' '}
                                {item.message}
                            </Text>
                            <Text style={styles.notificationTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.notificationIcon}>{getIcon(item.type)}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                </Card>
            </Pressable>
        </Animated.View>
    );

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={theme.colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <Pressable style={styles.markAllButton}>
                    <Text style={styles.markAllText}>Marcar todas</Text>
                </Pressable>
            </LinearGradient>

            {/* Filters */}
            <View style={styles.filters}>
                <Pressable style={[styles.filter, styles.filterActive]}>
                    <Text style={[styles.filterText, styles.filterTextActive]}>Todas</Text>
                </Pressable>
                <Pressable style={styles.filter}>
                    <Text style={styles.filterText}>Likes</Text>
                </Pressable>
                <Pressable style={styles.filter}>
                    <Text style={styles.filterText}>Comentarios</Text>
                </Pressable>
                <Pressable style={styles.filter}>
                    <Text style={styles.filterText}>Eventos</Text>
                </Pressable>
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={styles.emptyText}>No hay notificaciones</Text>
                    </View>
                }
            />
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backIcon: {
            fontSize: 28,
            color: '#ffffff',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        markAllButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        markAllText: {
            fontSize: 14,
            color: '#ffffff',
            fontWeight: '600',
        },
        filters: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 16,
            gap: 8,
        },
        filter: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
        },
        filterActive: {
            backgroundColor: theme.colors.primary,
        },
        filterText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        filterTextActive: {
            color: '#ffffff',
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        notificationCard: {
            marginBottom: 12,
            padding: 16,
            position: 'relative',
        },
        unreadCard: {
            borderLeftWidth: 3,
            borderLeftColor: theme.colors.primary,
        },
        notificationContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        notificationText: {
            flex: 1,
        },
        notificationMessage: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 20,
        },
        userName: {
            fontWeight: 'bold',
        },
        notificationTime: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        notificationIcon: {
            fontSize: 24,
        },
        unreadDot: {
            position: 'absolute',
            top: 16,
            right: 16,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 80,
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: 16,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
    });
