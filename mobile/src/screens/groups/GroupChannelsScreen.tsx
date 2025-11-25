// GroupChannelsScreen for group communication channels
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    RefreshControl,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Channel {
    id: string;
    name: string;
    description: string;
    unreadCount: number;
    lastMessage?: {
        content: string;
        timestamp: string;
    };
}

export const GroupChannelsScreen = ({ route, navigation }: any) => {
    const { groupId } = route.params;
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const mockChannels: Channel[] = [
        {
            id: '1',
            name: 'general',
            description: 'Canal general del grupo',
            unreadCount: 5,
            lastMessage: {
                content: 'Hola a todos!',
                timestamp: 'Hace 5 min',
            },
        },
        {
            id: '2',
            name: 'anuncios',
            description: 'Anuncios importantes',
            unreadCount: 2,
            lastMessage: {
                content: 'Nueva reunión programada',
                timestamp: 'Hace 1 hora',
            },
        },
        {
            id: '3',
            name: 'recursos',
            description: 'Compartir recursos y materiales',
            unreadCount: 0,
            lastMessage: {
                content: 'Documento compartido',
                timestamp: 'Hace 2 horas',
            },
        },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleCreateChannel = () => {
        Alert.prompt(
            'Crear Canal',
            'Ingresa el nombre del canal',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Crear',
                    onPress: (name) => {
                        if (name?.trim()) {
                            Alert.alert('Éxito', `Canal "${name}" creado`);
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    const renderChannel = ({ item, index }: { item: Channel; index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable
                onPress={() =>
                    navigation.navigate('ChannelMessages', {
                        channelId: item.id,
                        channelName: item.name,
                    })
                }
            >
                <Card variant="default" style={styles.channelCard}>
                    <View style={styles.channelHeader}>
                        <View style={styles.channelIcon}>
                            <Text style={styles.channelIconText}>#</Text>
                        </View>
                        <View style={styles.channelInfo}>
                            <View style={styles.channelTitleRow}>
                                <Text style={styles.channelName}>{item.name}</Text>
                                {item.unreadCount > 0 && (
                                    <Badge count={item.unreadCount} variant="primary" pulse />
                                )}
                            </View>
                            <Text style={styles.channelDescription}>{item.description}</Text>
                            {item.lastMessage && (
                                <View style={styles.lastMessage}>
                                    <Text style={styles.lastMessageContent} numberOfLines={1}>
                                        {item.lastMessage.content}
                                    </Text>
                                    <Text style={styles.lastMessageTime}>
                                        • {item.lastMessage.timestamp}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.chevron}>→</Text>
                    </View>
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
                <Text style={styles.headerTitle}>Canales</Text>
                <Pressable onPress={handleCreateChannel} style={styles.addButton}>
                    <Text style={styles.addIcon}>+</Text>
                </Pressable>
            </LinearGradient>

            {/* Channels List */}
            <FlatList
                data={mockChannels}
                renderItem={renderChannel}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyText}>No hay canales aún</Text>
                        <Button
                            title="Crear Canal"
                            onPress={handleCreateChannel}
                            variant="primary"
                            style={styles.emptyButton}
                        />
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
            padding: 20,
        },
        channelCard: {
            marginBottom: 12,
            padding: 16,
        },
        channelHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        channelIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        channelIconText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        channelInfo: {
            flex: 1,
        },
        channelTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        channelName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        channelDescription: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 6,
        },
        lastMessage: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        lastMessageContent: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            flex: 1,
        },
        lastMessageTime: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        chevron: {
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
            marginBottom: 24,
        },
        emptyButton: {
            minWidth: 150,
        },
    });
