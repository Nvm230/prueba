// Simplified ProfileScreen - Minimalist Design
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    FlatList,
    Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { userService } from '../../services/users';
import { postService, Post } from '../../services/posts';

export const ProfileScreen = ({ navigation }: any) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'events'>('posts');

    // Load user stats from backend
    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
        queryKey: ['userStats', user?.id],
        queryFn: () => userService.getStats(user?.id),
        enabled: !!user?.id,
    });

    // Load user posts
    const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = useQuery({
        queryKey: ['userPosts', user?.id],
        queryFn: ({ signal }) => postService.getAll({ page: 0, size: 20 }, signal),
        enabled: !!user?.id && activeTab === 'posts',
    });

    const onRefresh = async () => {
        await Promise.all([refetchStats(), refetchPosts()]);
    };

    const styles = createStyles(theme);

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.postCard}>
            {item.content && (
                <Text style={styles.postContent}>{item.content}</Text>
            )}
            {item.mediaUrl && (
                <Image
                    source={{ uri: item.mediaUrl }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            )}
            <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ {item.likesCount}</Text>
                <Text style={styles.postStat}>💬 {item.commentsCount}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={statsLoading || postsLoading}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Cover with solid color */}
                <View style={styles.coverContainer}>
                    <View style={styles.cover} />

                    {/* Settings Button */}
                    <Pressable
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </Pressable>
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarRing}>
                            <Avatar
                                uri={user?.profilePictureUrl}
                                name={user?.name || 'Usuario'}
                                size={100}
                            />
                        </View>
                    </View>

                    <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>

                    {user?.bio && (
                        <Text style={styles.bio}>{user.bio}</Text>
                    )}

                    <View style={styles.actions}>
                        <Button
                            title="Editar Perfil"
                            onPress={() => navigation.navigate('EditProfile')}
                            variant="primary"
                            size="medium"
                            style={styles.editButton}
                        />
                        <Button
                            title={theme.isDark ? '☀️' : '🌙'}
                            onPress={toggleTheme}
                            variant="outline"
                            size="medium"
                            style={styles.themeButton}
                        />
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <Card variant="elevated" style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {statsLoading ? '...' : (stats?.postsCount || 0)}
                        </Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </Card>
                    <Card variant="elevated" style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {statsLoading ? '...' : (stats?.followersCount || 0)}
                        </Text>
                        <Text style={styles.statLabel}>Seguidores</Text>
                    </Card>
                    <Card variant="elevated" style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {statsLoading ? '...' : (stats?.followingCount || 0)}
                        </Text>
                        <Text style={styles.statLabel}>Siguiendo</Text>
                    </Card>
                    <Card variant="elevated" style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {statsLoading ? '...' : (stats?.eventsCount || 0)}
                        </Text>
                        <Text style={styles.statLabel}>Eventos</Text>
                    </Card>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <Pressable
                        style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
                        onPress={() => setActiveTab('posts')}
                    >
                        <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
                            Posts
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'media' && styles.tabActive]}
                        onPress={() => setActiveTab('media')}
                    >
                        <Text style={[styles.tabText, activeTab === 'media' && styles.tabTextActive]}>
                            Media
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'events' && styles.tabActive]}
                        onPress={() => setActiveTab('events')}
                    >
                        <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
                            Eventos
                        </Text>
                    </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {activeTab === 'posts' && (
                        <>
                            {postsLoading ? (
                                <Text style={styles.loadingText}>Cargando posts...</Text>
                            ) : postsData?.content && postsData.content.length > 0 ? (
                                <FlatList
                                    data={postsData.content}
                                    renderItem={renderPost}
                                    keyExtractor={(item) => item.id.toString()}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyIcon}>📝</Text>
                                    <Text style={styles.emptyText}>No hay posts aún</Text>
                                    <Button
                                        title="Crear Post"
                                        onPress={() => navigation.navigate('CreatePost')}
                                        variant="primary"
                                        style={styles.emptyButton}
                                    />
                                </View>
                            )}
                        </>
                    )}
                    {activeTab === 'media' && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🖼️</Text>
                            <Text style={styles.emptyText}>No hay media aún</Text>
                        </View>
                    )}
                    {activeTab === 'events' && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📅</Text>
                            <Text style={styles.emptyText}>No hay eventos aún</Text>
                            <Button
                                title="Ver Eventos"
                                onPress={() => navigation.navigate('Events')}
                                variant="primary"
                                style={styles.emptyButton}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        coverContainer: {
            position: 'relative',
        },
        cover: {
            height: 200,
            backgroundColor: theme.colors.primary,
        },
        settingsButton: {
            position: 'absolute',
            top: 60,
            right: 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        settingsIcon: {
            fontSize: 24,
        },
        profileInfo: {
            alignItems: 'center',
            marginTop: -50,
            paddingHorizontal: 20,
        },
        avatarContainer: {
            marginBottom: 16,
        },
        avatarRing: {
            padding: 4,
            borderRadius: 56,
            borderWidth: 3,
            borderColor: theme.colors.primary,
        },
        name: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        email: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        bio: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 16,
            paddingHorizontal: 20,
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 8,
        },
        editButton: {
            flex: 1,
        },
        themeButton: {
            width: 50,
        },
        statsContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginTop: 24,
            gap: 12,
        },
        statCard: {
            flex: 1,
            alignItems: 'center',
            padding: 16,
        },
        statNumber: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        tabs: {
            flexDirection: 'row',
            marginTop: 24,
            marginHorizontal: 20,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 12,
            padding: 4,
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 8,
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
        content: {
            marginTop: 24,
            paddingHorizontal: 20,
        },
        loadingText: {
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginTop: 20,
        },
        postCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        postContent: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 12,
        },
        postImage: {
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: theme.colors.surfaceVariant,
        },
        postStats: {
            flexDirection: 'row',
            gap: 16,
        },
        postStat: {
            fontSize: 14,
            color: theme.colors.textSecondary,
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
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 24,
        },
        emptyButton: {
            minWidth: 150,
        },
        bottomSpacing: {
            height: 40,
        },
    });
