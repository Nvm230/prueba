import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { eventService, Event } from '../../services/events';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { EmptyState } from '../../components/ui/EmptyState';

export const EventsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const { data: events, isLoading, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: () => eventService.getAll(),
    });

    const styles = createStyles(theme, isIOS);

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
                    <Text style={styles.eventLocation}>📍 {item.location}</Text>
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
            <LinearGradient
                colors={theme.colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Eventos</Text>
            </LinearGradient>

            <FlatList
                data={events || []}
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
                        description="No se encontraron eventos disponibles"
                    />
                }
            />
        </View>
    );
};

const createStyles = (theme: any, isIOS: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            paddingTop: isIOS ? 60 : 40,
            paddingBottom: 20,
            paddingHorizontal: 20,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        list: {
            padding: 20,
        },
        eventCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
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
        eventLocation: {
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
