// SearchScreen with universal search
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import Animated, { FadeInRight } from 'react-native-reanimated';

type SearchTab = 'all' | 'users' | 'posts' | 'groups' | 'events';

export const SearchScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<SearchTab>('all');

    const mockResults = {
        users: [
            { id: '1', name: 'María García', email: 'maria@example.com' },
            { id: '2', name: 'Juan Pérez', email: 'juan@example.com' },
        ],
        posts: [
            { id: '1', content: 'Este es un post de ejemplo', user: { name: 'Ana' } },
        ],
        groups: [
            { id: '1', name: 'Grupo de Estudio', memberCount: 25 },
        ],
        events: [
            { id: '1', title: 'Evento de Networking', location: 'Auditorio' },
        ],
    };

    const renderUser = ({ item, index }: any) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable onPress={() => navigation.navigate('Profile', { userId: item.id })}>
                <Card variant="default" style={styles.resultCard}>
                    <View style={styles.userResult}>
                        <Avatar name={item.name} size={48} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                        </View>
                        <Text style={styles.resultIcon}>→</Text>
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );

    const renderPost = ({ item, index }: any) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Card variant="default" style={styles.resultCard}>
                <Text style={styles.postAuthor}>{item.user.name}</Text>
                <Text style={styles.postContent} numberOfLines={2}>
                    {item.content}
                </Text>
            </Card>
        </Animated.View>
    );

    const renderGroup = ({ item, index }: any) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}>
                <Card variant="default" style={styles.resultCard}>
                    <View style={styles.groupResult}>
                        <Text style={styles.groupIcon}>👥</Text>
                        <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>{item.name}</Text>
                            <Text style={styles.groupMembers}>{item.memberCount} miembros</Text>
                        </View>
                        <Text style={styles.resultIcon}>→</Text>
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );

    const renderEvent = ({ item, index }: any) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}>
                <Card variant="default" style={styles.resultCard}>
                    <View style={styles.eventResult}>
                        <Text style={styles.eventIcon}>📅</Text>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <Text style={styles.eventLocation}>📍 {item.location}</Text>
                        </View>
                        <Text style={styles.resultIcon}>→</Text>
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );

    const getResults = () => {
        if (!query.trim()) return [];

        switch (activeTab) {
            case 'users':
                return mockResults.users;
            case 'posts':
                return mockResults.posts;
            case 'groups':
                return mockResults.groups;
            case 'events':
                return mockResults.events;
            default:
                return [
                    ...mockResults.users,
                    ...mockResults.posts,
                    ...mockResults.groups,
                    ...mockResults.events,
                ];
        }
    };

    const renderResult = ({ item, index }: any) => {
        if (item.email) return renderUser({ item, index });
        if (item.content) return renderPost({ item, index });
        if (item.memberCount !== undefined) return renderGroup({ item, index });
        if (item.location) return renderEvent({ item, index });
        return null;
    };

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
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar..."
                        placeholderTextColor={theme.colors.textTertiary}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </Pressable>
                    )}
                </View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabs}>
                {(['all', 'users', 'posts', 'groups', 'events'] as SearchTab[]).map((tab) => (
                    <Pressable
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab === 'all' ? 'Todos' :
                                tab === 'users' ? 'Usuarios' :
                                    tab === 'posts' ? 'Posts' :
                                        tab === 'groups' ? 'Grupos' : 'Eventos'}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Results */}
            <FlatList
                data={getResults()}
                renderItem={renderResult}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.results}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>
                            {query.trim() ? '🔍' : '💡'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {query.trim() ? 'No se encontraron resultados' : 'Busca usuarios, posts, grupos o eventos'}
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
            paddingBottom: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
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
        searchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
        },
        searchIcon: {
            fontSize: 20,
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: '#ffffff',
        },
        clearIcon: {
            fontSize: 20,
            color: '#ffffff',
            padding: 4,
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
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
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
        results: {
            padding: 20,
        },
        resultCard: {
            marginBottom: 12,
            padding: 16,
        },
        userResult: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        userEmail: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        postAuthor: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        postContent: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
        },
        groupResult: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        groupIcon: {
            fontSize: 32,
        },
        groupInfo: {
            flex: 1,
        },
        groupName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        groupMembers: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        eventResult: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        eventIcon: {
            fontSize: 32,
        },
        eventInfo: {
            flex: 1,
        },
        eventTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        eventLocation: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        resultIcon: {
            fontSize: 20,
            color: theme.colors.textSecondary,
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
            textAlign: 'center',
            paddingHorizontal: 40,
        },
    });
