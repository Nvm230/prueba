// EventDetailScreen matching web version
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Share,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/events';
import Animated, { FadeInDown } from 'react-native-reanimated';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'LIVE':
            return { bg: '#10b981', text: '#ffffff' };
        case 'FINISHED':
            return { bg: '#6b7280', text: '#ffffff' };
        default:
            return { bg: '#f59e0b', text: '#ffffff' };
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'LIVE':
            return '🔴 En vivo';
        case 'FINISHED':
            return 'Finalizado';
        default:
            return 'Próximamente';
    }
};

export const EventDetailScreen = ({ route, navigation }: any) => {
    const { eventId } = route.params;
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [isRegistered, setIsRegistered] = useState(false);

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: ({ signal }) => eventService.getById(eventId, signal),
    });

    const styles = createStyles(theme);

    const registerMutation = useMutation({
        mutationFn: () => eventService.register(eventId),
        onSuccess: () => {
            setIsRegistered(true);
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        },
    });

    const handleShare = async () => {
        try {
            await Share.share({
                message: `¡Únete a ${event?.title}! ${event?.faculty || 'Universidad'}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || !event) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando evento...</Text>
            </View>
        );
    }

    const statusColors = getStatusColor(event.status || 'PENDING');

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    {event.imageUrl ? (
                        <Image source={{ uri: event.imageUrl }} style={styles.image} />
                    ) : (
                        <LinearGradient
                            colors={theme.colors.primaryGradient as any}
                            style={styles.imagePlaceholder}
                        >
                            <Text style={styles.imagePlaceholderText}>📅</Text>
                        </LinearGradient>
                    )}

                    {/* Back Button */}
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <View style={styles.backButtonInner}>
                            <Text style={styles.backIcon}>←</Text>
                        </View>
                    </Pressable>

                    {/* Share Button */}
                    <Pressable style={styles.shareButton} onPress={handleShare}>
                        <View style={styles.shareButtonInner}>
                            <Text style={styles.shareIcon}>↗️</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Event Info */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.content}>
                    {/* Title and Status */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{event.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                            <Text style={[styles.statusText, { color: statusColors.text }]}>
                                {getStatusLabel(event.status || 'PENDING')}
                            </Text>
                        </View>
                    </View>

                    {event.description && (
                        <Text style={styles.description}>{event.description}</Text>
                    )}

                    {/* Category and Tags */}
                    <View style={styles.tagsContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{event.category}</Text>
                        </View>
                        {event.faculty && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>🏛️ {event.faculty}</Text>
                            </View>
                        )}
                        {event.career && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{event.career}</Text>
                            </View>
                        )}
                    </View>

                    {/* Date & Time Card */}
                    <Card style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📅</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Fecha de Inicio</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(event.startTime).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text style={styles.infoSubValue}>
                                    {new Date(event.startTime).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>🕐</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Fecha de Fin</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(event.endTime).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                                <Text style={styles.infoSubValue}>
                                    {new Date(event.endTime).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Event Details Card */}
                    <Card style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>👁️</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Visibilidad</Text>
                                <Text style={styles.infoValue}>
                                    {event.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
                                </Text>
                            </View>
                        </View>

                        {event.maxCapacity && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>👥</Text>
                                    <View style={styles.infoText}>
                                        <Text style={styles.infoLabel}>Capacidad Máxima</Text>
                                        <Text style={styles.infoValue}>
                                            {event.currentAttendees || 0} / {event.maxCapacity} personas
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </Card>

                    {/* Participants Card */}
                    <Card style={styles.infoCard}>
                        <View style={styles.attendeesHeader}>
                            <Text style={styles.attendeesTitle}>
                                Participantes ({event.attendeeCount || event.currentAttendees || 0})
                            </Text>
                        </View>
                        <Text style={styles.participantsSubtext}>
                            {event.attendeeCount || event.currentAttendees || 0} personas inscritas
                        </Text>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        {event.status !== 'FINISHED' && (
                            <Button
                                title={isRegistered ? '✓ Registrado' : 'Registrarse'}
                                onPress={() => registerMutation.mutate()}
                                variant={isRegistered ? 'secondary' : 'primary'}
                                size="large"
                                loading={registerMutation.isPending}
                                disabled={isRegistered}
                                style={styles.registerButton}
                            />
                        )}
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
        imageContainer: {
            position: 'relative',
            height: 300,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        imagePlaceholderText: {
            fontSize: 80,
        },
        backButton: {
            position: 'absolute',
            top: 60,
            left: 20,
        },
        backButtonInner: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        backIcon: {
            fontSize: 24,
            color: '#ffffff',
        },
        shareButton: {
            position: 'absolute',
            top: 60,
            right: 20,
        },
        shareButtonInner: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        shareIcon: {
            fontSize: 20,
        },
        content: {
            padding: 20,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 12,
            gap: 12,
        },
        title: {
            flex: 1,
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        description: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            lineHeight: 24,
            marginBottom: 16,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
        },
        categoryBadge: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
        },
        categoryText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
        },
        tag: {
            backgroundColor: theme.colors.card,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        tagText: {
            color: theme.colors.text,
            fontSize: 14,
        },
        infoCard: {
            marginBottom: 16,
            padding: 16,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
        },
        infoIcon: {
            fontSize: 24,
        },
        infoText: {
            flex: 1,
        },
        infoLabel: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        infoValue: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        infoSubValue: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 12,
        },
        attendeesHeader: {
            marginBottom: 8,
        },
        attendeesTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        participantsSubtext: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        actions: {
            marginTop: 8,
        },
        registerButton: {
            width: '100%',
        },
        loadingText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        bottomSpacing: {
            height: 40,
        },
    });
