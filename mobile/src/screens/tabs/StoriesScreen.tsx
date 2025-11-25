import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { storyService, Story } from '../../services/stories';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const STORY_SIZE = (width - 48) / 4;

export const StoriesScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const { data: stories, isLoading, refetch } = useQuery({
        queryKey: ['stories'],
        queryFn: ({ signal }) => storyService.getAll(signal),
    });

    const styles = createStyles(theme, isIOS);

    const renderStory = ({ item }: { item: Story }) => (
        <TouchableOpacity
            style={styles.storyContainer}
            onPress={() => navigation.navigate('StoryViewer', { storyId: item.id })}
        >
            <View style={[styles.storyRing, item.hasViewed && styles.storyRingViewed]}>
                {item.mediaUrl ? (
                    <Image source={{ uri: item.mediaUrl }} style={styles.storyImage} />
                ) : (
                    <View style={styles.storyPlaceholder}>
                        <Text style={styles.storyPlaceholderText}>
                            {item.user.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={styles.storyName} numberOfLines={1}>
                {item.user.name}
            </Text>
            {item.musicUrl && (
                <Text style={styles.musicIcon}>🎵</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Stories</Text>
                    <Text style={styles.headerSubtitle}>Comparte momentos</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>Stories</Text>
                    <Text style={styles.headerSubtitleAndroid}>Comparte momentos</Text>
                </View>
            )}

            {/* Create Story Button */}
            <View style={styles.createContainer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreateStory')}
                >
                    <Text style={styles.createButtonText}>+ Crear Story</Text>
                </TouchableOpacity>
            </View>

            {/* Stories Grid */}
            <FlatList
                data={stories || []}
                renderItem={renderStory}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={refetch}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📸</Text>
                        <Text style={styles.emptyText}>No hay stories</Text>
                        <Text style={styles.emptySubtext}>Sé el primero en compartir</Text>
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
    createContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 12,
    },
    storyContainer: {
        width: STORY_SIZE,
        marginBottom: 16,
        alignItems: 'center',
    },
    storyRing: {
        padding: 3,
        borderRadius: (STORY_SIZE - 8) / 2,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginBottom: 8,
    },
    storyRingViewed: {
        borderColor: theme.colors.border,
    },
    storyImage: {
        width: STORY_SIZE - 14,
        height: STORY_SIZE - 14,
        borderRadius: (STORY_SIZE - 14) / 2,
        backgroundColor: theme.colors.surfaceVariant,
    },
    storyPlaceholder: {
        width: STORY_SIZE - 14,
        height: STORY_SIZE - 14,
        borderRadius: (STORY_SIZE - 14) / 2,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    storyPlaceholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    storyName: {
        fontSize: 12,
        color: theme.colors.text,
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    musicIcon: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
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
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
