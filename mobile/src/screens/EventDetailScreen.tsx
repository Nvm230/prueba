import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, Event } from '../services/events';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/ui/Button';

export const EventDetailScreen = ({ route, navigation }: any) => {
    const { eventId } = route.params;
    const queryClient = useQueryClient();

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => eventService.getById(eventId),
    });

    const registerMutation = useMutation({
        mutationFn: () => eventService.register(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            navigation.navigate('QRScanner', { eventId });
        },
    });

    const isIOS = Platform.OS === 'ios';

    if (isLoading || !event) {
        return (
            <View style={styles.centered}>
                <Text>Cargando evento...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Event Image */}
            {event.imageUrl && (
                <Image source={{ uri: event.imageUrl }} style={styles.image} />
            )}

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.title, isIOS && styles.titleIOS]}>{event.title}</Text>

                <View style={[styles.infoCard, isIOS && styles.infoCardIOS]}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Ubicación</Text>
                            <Text style={styles.infoValue}>{event.location}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>🕐</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Fecha y hora</Text>
                            <Text style={styles.infoValue}>
                                {new Date(event.startTime).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>

                    {event.maxCapacity && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>👥</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Capacidad</Text>
                                <Text style={styles.infoValue}>
                                    {event.currentAttendees || 0} / {event.maxCapacity} personas
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={[styles.descriptionCard, isIOS && styles.descriptionCardIOS]}>
                    <Text style={styles.descriptionTitle}>Descripción</Text>
                    <Text style={styles.description}>{event.description}</Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title={registerMutation.isPending ? 'Registrando...' : 'Registrarse al Evento'}
                        onPress={() => registerMutation.mutate()}
                        disabled={registerMutation.isPending}
                    />

                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => navigation.navigate('QRScanner', { eventId })}
                    >
                        <Text style={styles.scanButtonText}>📷 Escanear QR para Check-in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: '#e0e0e0',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    titleIOS: {
        fontSize: 32,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoCardIOS: {
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    descriptionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    descriptionCardIOS: {
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    actions: {
        gap: 12,
        marginBottom: 40,
    },
    scanButton: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8b5cf6',
    },
    scanButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8b5cf6',
    },
});
