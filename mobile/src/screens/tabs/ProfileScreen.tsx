// Modern ProfileScreen with Stats and Tabs
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const ProfileScreen = ({ navigation }: any) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'events'>('posts');
    const [refreshing, setRefreshing] = useState(false);

    const stats = {
        posts: 24,
        followers: 156,
        following: 89,
        events: 12,
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Cover Image with Gradient */}
                <View style={styles.coverContainer}>
                    <LinearGradient
                        colors={theme.colors.primaryGradient as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cover}
                    />

                    {/* Settings Button */}
                    <Pressable
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </Pressable>
                </View>

                {/* Profile Info */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={theme.colors.primaryGradient as any}
                            style={styles.avatarRing}
                        >
                            <Avatar
                                uri={user?.profilePictureUrl}
                                name={user?.name || 'Usuario'}
                                size={100}
                            />
                        </LinearGradient>
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
                </Animated.View>

                {/* Stats Cards */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
                    <Card variant="premium" style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.posts}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </Card>
                    <Card variant="premium" style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.followers}</Text>
                        <Text style={styles.statLabel}>Seguidores</Text>
                    </Card>
                    <Card variant="premium" style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.following}</Text>
                        <Text style={styles.statLabel}>Siguiendo</Text>
                    </Card>
                    <Card variant="premium" style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.events}</Text>
                        <Text style={styles.statLabel}>Eventos</Text>
                    </Card>
                </Animated.View>

                {/* Tabs */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.tabs}>
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
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    {activeTab === 'posts' && (
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
