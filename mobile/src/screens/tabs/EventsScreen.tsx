import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Pressable,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { eventService, Event } from '../../services/events';
import { useTheme } from '../../contexts/ThemeContext';
import { EmptyState } from '../../components/ui/EmptyState';

type EventFilter = 'all' | 'live' | 'past';

export const EventsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [filter, setFilter] = useState<EventFilter>('all');

    const { data: events, isLoading, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: () => eventService.getAll(),
    });

    const styles = createStyles(theme);

    const filterEvents = (events: Event[] | undefined) => {
        if (!events) return [];

        const now = new Date();

        switch (filter) {
            case 'live':
                return events.filter(event => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    return start <= now && now <= end;
                });
            case 'past':
                return events.filter(event => {
                    const end = new Date(event.endTime);
                    return end < now;
                });
            default:
                return events;
        }
    };

    const filteredEvents = filterEvents(events);

    const renderEvent = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
        >
            <View style={styles.eventHeader}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateDay}>
                        {new Date(item.startTime).getDate()}
                    </Text>
                    <Text style={styles.dateMonth}>
                        {new Date(item.startTime).toLocaleDateString('es-ES', { month: 'short' })}
                    </Text>
                </View>
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventCategory}>📂 {item.category}</Text>
                    {item.faculty && (
                        <Text style={styles.eventFaculty}>🏛️ {item.faculty}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando eventos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Eventos</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreateEvent')}
                >
                    <Text style={styles.createButtonText}>+ Crear</Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <Pressable
                    style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                        Todos
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.filterButton, filter === 'live' && styles.filterButtonActive]}
                    onPress={() => setFilter('live')}
                >
                    <Text style={[styles.filterText, filter === 'live' && styles.filterTextActive]}>
                        🔴 En vivo
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
                    onPress={() => setFilter('past')}
                >
                    <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
                        Pasados
                    </Text>
                </Pressable>
            </View>

            <FlatList
                data={filteredEvents}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <EmptyState
                        icon="📅"
                        title="No hay eventos"
                        description={
                            filter === 'live'
                                ? 'No hay eventos en vivo en este momento'
                                : filter === 'past'
                                    ? 'No hay eventos pasados'
                                    : 'No se encontraron eventos disponibles'
                        }
                    />
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.primary,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        createButton: {
            backgroundColor: '#ffffff',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        createButtonText: {
            color: theme.colors.primary,
            fontSize: 14,
            fontWeight: '600',
        },
        filtersContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 8,
            backgroundColor: theme.colors.background,
        },
        filterButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        filterButtonActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        filterText: {
            fontSize: 14,
            color: theme.colors.text,
            fontWeight: '500',
        },
        filterTextActive: {
            color: '#ffffff',
            fontWeight: '600',
        },
        list: {
            padding: 20,
        },
        eventCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        eventHeader: {
            flexDirection: 'row',
            gap: 16,
        },
        dateBox: {
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dateDay: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        dateMonth: {
            fontSize: 12,
            color: '#ffffff',
            textTransform: 'uppercase',
        },
        eventInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        eventTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        eventCategory: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 2,
        },
        eventFaculty: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        loadingText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 40,
        },
    });
