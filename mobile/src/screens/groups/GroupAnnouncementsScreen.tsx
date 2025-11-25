// GroupAnnouncementsScreen for admin announcements
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
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: {
        name: string;
        profilePictureUrl?: string;
    };
    createdAt: string;
    isPinned: boolean;
}

export const GroupAnnouncementsScreen = ({ route, navigation }: any) => {
    const { groupId, isAdmin } = route.params;
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const mockAnnouncements: Announcement[] = [
        {
            id: '1',
            title: 'Reunión General - Viernes 3pm',
            content: 'Se convoca a todos los miembros a la reunión general este viernes a las 3pm en el auditorio principal.',
            author: { name: 'Admin Principal' },
            createdAt: 'Hace 2 horas',
            isPinned: true,
        },
        {
            id: '2',
            title: 'Nuevo Material Disponible',
            content: 'Ya está disponible el material de estudio para el próximo examen en la carpeta compartida.',
            author: { name: 'María García' },
            createdAt: 'Hace 1 día',
            isPinned: false,
        },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleCreateAnnouncement = () => {
        navigation.navigate('CreateAnnouncement', { groupId });
    };

    const handleDeleteAnnouncement = (id: string) => {
        Alert.alert(
            'Eliminar Anuncio',
            '¿Estás seguro de que deseas eliminar este anuncio?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Éxito', 'Anuncio eliminado');
                    },
                },
            ]
        );
    };

    const renderAnnouncement = ({ item, index }: { item: Announcement; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
            <Card
                variant={item.isPinned ? 'gradient' : 'default'}
                style={styles.announcementCard}
            >
                {item.isPinned && (
                    <View style={styles.pinnedBadge}>
                        <Text style={styles.pinnedIcon}>📌</Text>
                        <Text style={styles.pinnedText}>Fijado</Text>
                    </View>
                )}

                <View style={styles.announcementHeader}>
                    <Avatar uri={item.author.profilePictureUrl} name={item.author.name} size={40} />
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>{item.author.name}</Text>
                        <Text style={styles.timestamp}>{item.createdAt}</Text>
                    </View>
                    {isAdmin && (
                        <Pressable
                            style={styles.menuButton}
                            onPress={() => handleDeleteAnnouncement(item.id)}
                        >
                            <Text style={styles.menuIcon}>⋮</Text>
                        </Pressable>
                    )}
                </View>

                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementContent}>{item.content}</Text>
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
                <Text style={styles.headerTitle}>Anuncios</Text>
                {isAdmin ? (
                    <Pressable onPress={handleCreateAnnouncement} style={styles.addButton}>
                        <Text style={styles.addIcon}>+</Text>
                    </Pressable>
                ) : (
                    <View style={styles.placeholder} />
                )}
            </LinearGradient>

            {/* Announcements List */}
            <FlatList
                data={mockAnnouncements}
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📢</Text>
                        <Text style={styles.emptyText}>No hay anuncios aún</Text>
                        {isAdmin && (
                            <Button
                                title="Crear Anuncio"
                                onPress={handleCreateAnnouncement}
                                variant="primary"
                                style={styles.emptyButton}
                            />
                        )}
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
        placeholder: {
            width: 40,
        },
        list: {
            padding: 20,
        },
        announcementCard: {
            marginBottom: 16,
            padding: 16,
        },
        pinnedBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 12,
            alignSelf: 'flex-start',
        },
        pinnedIcon: {
            fontSize: 14,
        },
        pinnedText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.text,
        },
        announcementHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
        },
        authorInfo: {
            flex: 1,
        },
        authorName: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        timestamp: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        menuButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        menuIcon: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
        announcementTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 8,
        },
        announcementContent: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 22,
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
