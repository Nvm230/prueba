// EventDetailScreen with map, attendees, and check-in
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { eventService } from '../services/events';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const EventDetailScreen = ({ route, navigation }: any) => {
    const { eventId } = route.params;
    const { theme } = useTheme();
    const [isAttending, setIsAttending] = useState(false);

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: ({ signal }) => eventService.getById(eventId, signal),
    });

    const attendMutation = useMutation({
        mutationFn: () => eventService.attend(eventId),
        onSuccess: () => {
            setIsAttending(true);
        },
    });

    const handleShare = async () => {
        try {
            await Share.share({
                message: `¡Únete a ${event?.title}! ${event?.location}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || !event) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Cargando...</Text>
            </View>
        );
    }

    const styles = createStyles(theme);

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
                    <Text style={styles.title}>{event.title}</Text>

                    {event.description && (
                        <Text style={styles.description}>{event.description}</Text>
                    )}

                    {/* Date & Time Card */}
                    <Card variant="premium" style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📅</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Fecha</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(event.date).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>🕐</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Hora</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(event.startTime).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Location Card */}
                    <Card variant="premium" style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📍</Text>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Ubicación</Text>
                                <Text style={styles.infoValue}>{event.location}</Text>
                            </View>
                        </View>

                        {/* Map Placeholder */}
                        <Pressable style={styles.mapPlaceholder}>
                            <Text style={styles.mapText}>🗺️ Ver en mapa</Text>
                        </Pressable>
                    </Card>

                    {/* Attendees */}
                    <Card variant="premium" style={styles.infoCard}>
                        <View style={styles.attendeesHeader}>
                            <Text style={styles.attendeesTitle}>
                                Asistentes ({event.attendeeCount || 0})
                            </Text>
                            <Pressable>
                                <Text style={styles.seeAll}>Ver todos</Text>
                            </Pressable>
                        </View>

                        <View style={styles.attendeesList}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Avatar
                                    key={i}
                                    name={`Usuario ${i}`}
                                    size={40}
                                    style={styles.attendeeAvatar}
                                />
                            ))}
                            {event.attendeeCount > 5 && (
                                <View style={styles.moreAttendees}>
                                    <Text style={styles.moreAttendeesText}>
                                        +{event.attendeeCount - 5}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Button
                            title={isAttending ? '✓ Asistiendo' : 'Asistir'}
                            onPress={() => attendMutation.mutate()}
                            variant={isAttending ? 'secondary' : 'primary'}
                            size="large"
                            loading={attendMutation.isPending}
                            style={styles.attendButton}
                        />
                        <Button
                            title="📷 Check-in"
                            onPress={() => navigation.navigate('QRScanner')}
                            variant="outline"
                            size="large"
                            style={styles.checkinButton}
                        />
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
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 12,
        },
        description: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            lineHeight: 24,
            marginBottom: 24,
        },
        infoCard: {
            marginBottom: 16,
            padding: 16,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
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
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 12,
        },
        mapPlaceholder: {
            marginTop: 12,
            height: 120,
            borderRadius: 12,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
        },
        mapText: {
            fontSize: 16,
            color: theme.colors.text,
        },
        attendeesHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        attendeesTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        seeAll: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '600',
        },
        attendeesList: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        attendeeAvatar: {
            marginRight: -8,
            borderWidth: 2,
            borderColor: theme.colors.card,
        },
        moreAttendees: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
        },
        moreAttendeesText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 8,
        },
        attendButton: {
            flex: 2,
        },
        checkinButton: {
            flex: 1,
        },
        bottomSpacing: {
            height: 40,
        },
    });
