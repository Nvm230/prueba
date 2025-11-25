// StoriesListScreen for viewing all stories
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from '../../components/ui/Avatar';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const StoriesListScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

    const mockStories = [
        { id: '1', user: { name: 'María García' }, hasViewed: false },
        { id: '2', user: { name: 'Juan Pérez' }, hasViewed: true },
        { id: '3', user: { name: 'Ana López' }, hasViewed: false },
    ];

    const renderStory = ({ item, index }: any) => (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
            <Pressable
                style={styles.storyItem}
                onPress={() => navigation.navigate('StoryViewer', { storyId: item.id })}
            >
                <LinearGradient
                    colors={item.hasViewed ? ['#ccc', '#999'] : theme.colors.primaryGradient as any}
                    style={styles.storyRing}
                >
                    <Avatar name={item.user.name} size={70} />
                </LinearGradient>
                <Text style={styles.storyName} numberOfLines={1}>
                    {item.user.name}
                </Text>
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
                <Text style={styles.headerTitle}>Historias</Text>
                <Pressable
                    onPress={() => navigation.navigate('CreateStory')}
                    style={styles.addButton}
                >
                    <Text style={styles.addIcon}>+</Text>
                </Pressable>
            </LinearGradient>

            <FlatList
                data={mockStories}
                renderItem={renderStory}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.list}
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
        addButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        addIcon: {
            fontSize: 32,
            color: '#ffffff',
        },
        list: {
            padding: 16,
        },
        storyItem: {
            flex: 1,
            alignItems: 'center',
            marginBottom: 20,
            maxWidth: '33.33%',
        },
        storyRing: {
            padding: 3,
            borderRadius: 40,
            marginBottom: 8,
        },
        storyName: {
            fontSize: 12,
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: 4,
        },
    });
