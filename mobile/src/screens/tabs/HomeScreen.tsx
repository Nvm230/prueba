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

export const HomeScreen = ({ navigation }: any) => {
    const { data: events } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getAll,
    });

    const isIOS = Platform.OS === 'ios';
    const upcomingEvents = events?.slice(0, 3) || [];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
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
                {upcomingEvents.map((event) => (
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
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#8b5cf6',
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
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionCardIOS: {
        borderRadius: 16,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    section: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    sectionTitleIOS: {
        fontSize: 24,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    eventCardIOS: {
        borderRadius: 16,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    eventImage: {
        width: 100,
        height: 100,
        backgroundColor: '#e0e0e0',
    },
    eventInfo: {
        flex: 1,
        padding: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    eventLocation: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    eventTime: {
        fontSize: 13,
        color: '#8b5cf6',
        fontWeight: '500',
    },
});
