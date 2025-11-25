// FriendsScreen with tabs for friends, requests, and suggestions
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
import { Button } from '../components/ui/Button';
import Animated, { FadeInRight } from 'react-native-reanimated';

type FriendTab = 'friends' | 'requests' | 'suggestions';

interface Friend {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    mutualFriends?: number;
}

export const FriendsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<FriendTab>('friends');
    const [refreshing, setRefreshing] = useState(false);

    const mockFriends: Friend[] = [
        { id: '1', name: 'María García', email: 'maria@example.com' },
        { id: '2', name: 'Juan Pérez', email: 'juan@example.com' },
        { id: '3', name: 'Ana López', email: 'ana@example.com' },
    ];

    const mockRequests: Friend[] = [
        { id: '4', name: 'Carlos Ruiz', email: 'carlos@example.com', mutualFriends: 5 },
        { id: '5', name: 'Laura Martínez', email: 'laura@example.com', mutualFriends: 3 },
    ];

    const mockSuggestions: Friend[] = [
        { id: '6', name: 'Pedro Sánchez', email: 'pedro@example.com', mutualFriends: 8 },
        { id: '7', name: 'Sofia Torres', email: 'sofia@example.com', mutualFriends: 12 },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getData = () => {
        switch (activeTab) {
            case 'friends':
                return mockFriends;
            case 'requests':
                return mockRequests;
            case 'suggestions':
                return mockSuggestions;
            default:
                return [];
        }
    };

    const renderFriend = ({ item, index }: { item: Friend; index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Card variant="default" style={styles.friendCard}>
                <Pressable
                    style={styles.friendContent}
                    onPress={() => navigation.navigate('Profile', { userId: item.id })}
                >
                    <Avatar uri={item.profilePictureUrl} name={item.name} size={56} />
                    <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{item.name}</Text>
                        <Text style={styles.friendEmail}>{item.email}</Text>
                        {item.mutualFriends !== undefined && (
                            <Text style={styles.mutualFriends}>
                                {item.mutualFriends} amigos en común
                            </Text>
                        )}
                    </View>
                    <View style={styles.friendActions}>
                        {activeTab === 'friends' && (
                            <Pressable style={styles.iconButton}>
                                <Text style={styles.iconButtonText}>💬</Text>
                            </Pressable>
                        )}
                        {activeTab === 'requests' && (
                            <View style={styles.requestActions}>
                                <Pressable style={[styles.actionButton, styles.acceptButton]}>
                                    <Text style={styles.actionButtonText}>✓</Text>
                                </Pressable>
                                <Pressable style={[styles.actionButton, styles.rejectButton]}>
                                    <Text style={styles.actionButtonText}>✕</Text>
                                </Pressable>
                            </View>
                        )}
                        {activeTab === 'suggestions' && (
                            <Button
                                title="Agregar"
                                onPress={() => { }}
                                variant="primary"
                                size="small"
                                style={styles.addButton}
                            />
                        )}
                    </View>
                </Pressable>
            </Card>
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
                <Text style={styles.headerTitle}>Amigos</Text>
                <Pressable style={styles.searchButton}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </Pressable>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabs}>
                <Pressable
                    style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
                    onPress={() => setActiveTab('friends')}
                >
                    <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
                        Amigos
                    </Text>
                    <View style={[styles.tabBadge, activeTab === 'friends' && styles.tabBadgeActive]}>
                        <Text style={[styles.tabBadgeText, activeTab === 'friends' && styles.tabBadgeTextActive]}>
                            {mockFriends.length}
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
                        Solicitudes
                    </Text>
                    {mockRequests.length > 0 && (
                        <View style={[styles.tabBadge, activeTab === 'requests' && styles.tabBadgeActive]}>
                            <Text style={[styles.tabBadgeText, activeTab === 'requests' && styles.tabBadgeTextActive]}>
                                {mockRequests.length}
                            </Text>
                        </View>
                    )}
                </Pressable>

                <Pressable
                    style={[styles.tab, activeTab === 'suggestions' && styles.tabActive]}
                    onPress={() => setActiveTab('suggestions')}
                >
                    <Text style={[styles.tabText, activeTab === 'suggestions' && styles.tabTextActive]}>
                        Sugerencias
                    </Text>
                </Pressable>
            </View>

            {/* List */}
            <FlatList
                data={getData()}
                renderItem={renderFriend}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>
                            {activeTab === 'friends' ? '👥' : activeTab === 'requests' ? '📬' : '✨'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {activeTab === 'friends'
                                ? 'No tienes amigos aún'
                                : activeTab === 'requests'
                                    ? 'No hay solicitudes pendientes'
                                    : 'No hay sugerencias'}
                        </Text>
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
        searchButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchIcon: {
            fontSize: 24,
        },
        tabs: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            gap: 6,
        },
        tabActive: {
            backgroundColor: theme.colors.primary,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        tabTextActive: {
            color: '#ffffff',
        },
        tabBadge: {
            backgroundColor: theme.colors.surfaceVariant,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 10,
            minWidth: 20,
            alignItems: 'center',
        },
        tabBadgeActive: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        tabBadgeText: {
            fontSize: 11,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        tabBadgeTextActive: {
            color: '#ffffff',
        },
        list: {
            padding: 20,
        },
        friendCard: {
            marginBottom: 12,
            padding: 12,
        },
        friendContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        friendInfo: {
            flex: 1,
        },
        friendName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        friendEmail: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 2,
        },
        mutualFriends: {
            fontSize: 12,
            color: theme.colors.primary,
            marginTop: 4,
        },
        friendActions: {
            flexDirection: 'row',
            gap: 8,
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconButtonText: {
            fontSize: 20,
        },
        requestActions: {
            flexDirection: 'row',
            gap: 8,
        },
        actionButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
        },
        acceptButton: {
            backgroundColor: theme.colors.success,
        },
        rejectButton: {
            backgroundColor: theme.colors.error,
        },
        actionButtonText: {
            fontSize: 18,
            color: '#ffffff',
            fontWeight: 'bold',
        },
        addButton: {
            minWidth: 80,
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
