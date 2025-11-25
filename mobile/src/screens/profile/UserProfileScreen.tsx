// UserProfileScreen for viewing other users
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const UserProfileScreen = ({ route, navigation }: any) => {
    const { userId } = route.params;
    const { theme } = useTheme();

    const mockUser = {
        id: userId,
        name: 'María García',
        email: 'maria@example.com',
        bio: 'Estudiante de Ingeniería | Amante de la tecnología',
        stats: {
            posts: 45,
            followers: 234,
            following: 189,
            events: 12,
        },
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={theme.colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
                    <LinearGradient
                        colors={theme.colors.primaryGradient as any}
                        style={styles.avatarRing}
                    >
                        <Avatar name={mockUser.name} size={100} />
                    </LinearGradient>

                    <Text style={styles.name}>{mockUser.name}</Text>
                    <Text style={styles.email}>{mockUser.email}</Text>
                    {mockUser.bio && <Text style={styles.bio}>{mockUser.bio}</Text>}

                    {/* Stats */}
                    <View style={styles.stats}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{mockUser.stats.posts}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{mockUser.stats.followers}</Text>
                            <Text style={styles.statLabel}>Seguidores</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{mockUser.stats.following}</Text>
                            <Text style={styles.statLabel}>Siguiendo</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{mockUser.stats.events}</Text>
                            <Text style={styles.statLabel}>Eventos</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button title="Seguir" variant="primary" style={styles.followButton} />
                        <Button title="Mensaje" variant="outline" style={styles.messageButton} />
                    </View>
                </Animated.View>

                {/* Posts */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.postsSection}>
                    <Text style={styles.sectionTitle}>Posts Recientes</Text>
                    <Card variant="default" style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyText}>No hay posts aún</Text>
                    </Card>
                </Animated.View>
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
        header: {
            height: 200,
            paddingTop: 60,
            paddingHorizontal: 20,
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
        profileSection: {
            alignItems: 'center',
            marginTop: -50,
            paddingHorizontal: 20,
        },
        avatarRing: {
            padding: 4,
            borderRadius: 56,
            marginBottom: 16,
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
            marginBottom: 12,
        },
        bio: {
            fontSize: 15,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 24,
        },
        stats: {
            flexDirection: 'row',
            gap: 24,
            marginBottom: 24,
        },
        stat: {
            alignItems: 'center',
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        statLabel: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            width: '100%',
        },
        followButton: {
            flex: 2,
        },
        messageButton: {
            flex: 1,
        },
        postsSection: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        emptyCard: {
            padding: 40,
            alignItems: 'center',
        },
        emptyIcon: {
            fontSize: 48,
            marginBottom: 12,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
    });
