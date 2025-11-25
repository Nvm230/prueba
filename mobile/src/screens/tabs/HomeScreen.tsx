import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/events';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

export const HomeScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { data: events } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getAll,
    });

    const isIOS = Platform.OS === 'ios';

    // Handle both array and paginated response
    const eventsArray = Array.isArray(events) ? events : (events?.content || []);
    const upcomingEvents = eventsArray.slice(0, 3);

    const styles = createStyles(theme, isIOS);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerIOS}
                >
                    <Text style={styles.greeting}>¡Hola! 👋</Text>
                    <Text style={styles.subtitle}>Bienvenido a UniVibe</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.greetingAndroid}>¡Hola! 👋</Text>
                    <Text style={styles.subtitleAndroid}>Bienvenido a UniVibe</Text>
                </View>
            )}

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={[styles.actionCard, isIOS && styles.actionCardIOS]}
                    onPress={() => navigation.navigate('Events')}
                >
                    <Text style={styles.actionIcon}>📅</Text>
                    <Text style={styles.actionText}>Eventos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, isIOS && styles.actionCardIOS]}
                    onPress={() => navigation.navigate('QRScanner')}
                >
                    <Text style={styles.actionIcon}>📷</Text>
                    <Text style={styles.actionText}>Escanear QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, isIOS && styles.actionCardIOS]}
                    onPress={() => navigation.navigate('Social')}
                >
                    <Text style={styles.actionIcon}>👥</Text>
                    <Text style={styles.actionText}>Social</Text>
                </TouchableOpacity>
            </View>

            {/* Upcoming Events */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, isIOS && styles.sectionTitleIOS]}>
                    Próximos Eventos
                </Text>
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event: any) => (
                        <TouchableOpacity
                            key={event.id}
                            style={[styles.eventCard, isIOS && styles.eventCardIOS]}
                            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                        >
                            {event.imageUrl && (
                                <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                            )}
                            <View style={styles.eventInfo}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventLocation}>📍 {event.location}</Text>
                                <Text style={styles.eventTime}>
                                    🕐 {new Date(event.startTime).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
                        <Text style={styles.emptyText}>No hay eventos próximos</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerIOS: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    greeting: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffffcc',
    },
    headerAndroid: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    greetingAndroid: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitleAndroid: {
        fontSize: 16,
        color: '#ffffffdd',
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: -20,
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    actionCardIOS: {
        borderRadius: 16,
        shadowOpacity: theme.isDark ? 0.4 : 0.15,
        shadowRadius: 8,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    section: {
        marginTop: 32,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    sectionTitleIOS: {
        fontSize: 24,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    eventCardIOS: {
        borderRadius: 16,
        shadowOpacity: theme.isDark ? 0.4 : 0.15,
        shadowRadius: 8,
    },
    eventImage: {
        width: 100,
        height: 100,
        backgroundColor: theme.colors.surfaceVariant,
    },
    eventInfo: {
        flex: 1,
        padding: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    eventLocation: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    eventTime: {
        fontSize: 13,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});
