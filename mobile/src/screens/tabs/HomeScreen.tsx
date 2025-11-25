// Modern HomeScreen with Sections and Glassmorphism
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/events';
import { storyService } from '../../services/stories';
import { postService } from '../../services/posts';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const HomeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = React.useState(false);

    const { data: events, refetch: refetchEvents } = useQuery({
        queryKey: ['events'],
        queryFn: () => eventService.getAll(),
    });

    const { data: stories, refetch: refetchStories } = useQuery({
        queryKey: ['stories'],
        queryFn: ({ signal }) => storyService.getAll(signal),
    });

    const { data: posts, refetch: refetchPosts } = useQuery({
        queryKey: ['posts'],
        queryFn: () => postService.getAll({ page: 0, size: 10 }),
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refetchEvents(), refetchStories(), refetchPosts()]);
        setRefreshing(false);
    };

    const upcomingEvents = Array.isArray(events) ? events.slice(0, 5) : (events?.content?.slice(0, 5) || []);
    const recentStories = stories?.slice(0, 10) || [];
    const recentPosts = posts?.content?.slice(0, 3) || [];

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={theme.colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Hola,</Text>
                        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                    </View>
                    <Pressable onPress={() => navigation.navigate('Notifications')}>
                        <View>
                            <Text style={styles.notificationIcon}>🔔</Text>
                            <Badge count={5} variant="error" style={styles.badge} pulse />
                        </View>
                    </Pressable>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stories Section */}
                <Animated.View entering={FadeInDown.delay(100)}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Stories</Text>
                            <Pressable onPress={() => navigation.navigate('Stories')}>
                                <Text style={styles.seeAll}>Ver todas</Text>
                            </Pressable>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        >
                            {recentStories.map((story, index) => (
                                <Pressable
                                    key={story.id}
                                    onPress={() =>
                                        navigation.navigate('StoryViewer', { storyId: story.id })
                                    }
                                    style={styles.storyItem}
                                >
                                    <LinearGradient
                                        colors={theme.colors.primaryGradient as any}
                                        style={styles.storyRing}
                                    >
                                        <Avatar uri={story.user.profilePictureUrl} name={story.user.name} size={56} />
                                    </LinearGradient>
                                    <Text style={styles.storyName} numberOfLines={1}>
                                        {story.user.name.split(' ')[0]}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>

                {/* Upcoming Events Section */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
                            <Pressable onPress={() => navigation.navigate('Events')}>
                                <Text style={styles.seeAll}>Ver todos</Text>
                            </Pressable>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        >
                            {upcomingEvents.map((event: any, index: number) => (
                                <Card
                                    key={event.id}
                                    variant="premium"
                                    elevated
                                    onPress={() =>
                                        navigation.navigate('EventDetail', { eventId: event.id })
                                    }
                                    style={styles.eventCard}
                                >
                                    <Text style={styles.eventDate}>
                                        {new Date(event.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </Text>
                                    <Text style={styles.eventTitle} numberOfLines={2}>
                                        {event.title}
                                    </Text>
                                    <Text style={styles.eventLocation} numberOfLines={1}>
                                        📍 {event.location}
                                    </Text>
                                    <View style={styles.eventFooter}>
                                        <Text style={styles.eventAttendees}>
                                            👥 {event.attendeeCount || 0}
                                        </Text>
                                    </View>
                                </Card>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>

                {/* Recent Posts Section */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Publicaciones Recientes</Text>
                            <Pressable onPress={() => navigation.navigate('Social')}>
                                <Text style={styles.seeAll}>Ver todas</Text>
                            </Pressable>
                        </View>
                        {recentPosts.map((post: any) => (
                            <Card
                                key={post.id}
                                variant="premium"
                                elevated
                                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                                style={styles.postCard}
                            >
                                <View style={styles.postHeader}>
                                    <Avatar
                                        uri={post.user.profilePictureUrl}
                                        name={post.user.name}
                                        size={40}
                                    />
                                    <View style={styles.postUserInfo}>
                                        <Text style={styles.postUserName}>{post.user.name}</Text>
                                        <Text style={styles.postTime}>
                                            {new Date(post.createdAt).toLocaleDateString('es-ES')}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.postContent} numberOfLines={3}>
                                    {post.content}
                                </Text>
                                {post.mediaUrl && (
                                    <Image
                                        source={{ uri: post.mediaUrl }}
                                        style={styles.postImage}
                                    />
                                )}
                                <View style={styles.postFooter}>
                                    <Text style={styles.postStat}>❤️ {post.likesCount || 0}</Text>
                                    <Text style={styles.postStat}>
                                        💬 {post.commentsCount || 0}
                                    </Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </Animated.View>

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
        header: {
            paddingTop: 60,
            paddingBottom: 24,
            paddingHorizontal: 20,
        },
        headerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        greeting: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        notificationIcon: {
            fontSize: 28,
        },
        badge: {
            position: 'absolute',
            top: -4,
            right: -4,
        },
        scrollView: {
            flex: 1,
        },
        section: {
            marginTop: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        seeAll: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '600',
        },
        horizontalScroll: {
            paddingLeft: 20,
        },
        storyItem: {
            alignItems: 'center',
            marginRight: 16,
            width: 70,
        },
        storyRing: {
            padding: 3,
            borderRadius: 32,
            marginBottom: 8,
        },
        storyName: {
            fontSize: 12,
            color: theme.colors.text,
            textAlign: 'center',
        },
        eventCard: {
            width: 200,
            marginRight: 16,
            padding: 16,
        },
        eventDate: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: 8,
        },
        eventTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        eventLocation: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 12,
        },
        eventFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        eventAttendees: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        postCard: {
            marginHorizontal: 20,
            marginBottom: 16,
        },
        postHeader: {
            flexDirection: 'row',
            marginBottom: 12,
        },
        postUserInfo: {
            marginLeft: 12,
            justifyContent: 'center',
        },
        postUserName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        postTime: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        postContent: {
            fontSize: 14,
            color: theme.colors.text,
            lineHeight: 20,
            marginBottom: 12,
        },
        postImage: {
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
        },
        postFooter: {
            flexDirection: 'row',
            gap: 16,
        },
        postStat: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        bottomSpacing: {
            height: 40,
        },
    });
