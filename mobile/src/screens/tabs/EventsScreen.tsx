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

export const EventsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const { data: events, isLoading, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getEvents,
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
                    <Text style={styles.eventCategory}>📍 {item.category}</Text>
                    <Text style={styles.eventTime}>
                        🕐 {new Date(item.startTime).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Eventos</Text>
                    <Text style={styles.headerSubtitle}>Próximos eventos</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>Eventos</Text>
                    <Text style={styles.headerSubtitleAndroid}>Próximos eventos</Text>
                </View>
            )}

            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading ? true : false}
                        onRefresh={refetch}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
                        <Text style={styles.emptyText}>No hay eventos próximos</Text>
                    </View>
                }
            />
        </View>
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
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerAndroid: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#8b5cf6',
    },
    headerTitleAndroid: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listContent: {
        padding: 16,
    },
    eventCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    eventCardIOS: {
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    eventImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#e0e0e0',
    },
    eventContent: {
        padding: 16,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    eventTitleIOS: {
        fontSize: 20,
        fontWeight: '700',
    },
    eventLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    eventCapacity: {
        fontSize: 14,
        color: '#8b5cf6',
        fontWeight: '500',
    },
    textIOS: {
        fontSize: 15,
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
