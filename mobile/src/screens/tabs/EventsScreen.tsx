import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { eventService, Event } from '../../services/events';
import { LinearGradient } from 'expo-linear-gradient';

export const EventsScreen = ({ navigation }: any) => {
    const { data: events, isLoading, refetch, isRefreshing } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getAll,
    });

    const isIOS = Platform.OS === 'ios';

    const renderEvent = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={[styles.eventCard, isIOS && styles.eventCardIOS]}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
        >
            {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            )}
            <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, isIOS && styles.eventTitleIOS]}>
                    {item.title}
                </Text>
                <Text style={[styles.eventLocation, isIOS && styles.textIOS]}>
                    📍 {item.location}
                </Text>
                <Text style={[styles.eventTime, isIOS && styles.textIOS]}>
                    🕐 {new Date(item.startTime).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
                {item.maxCapacity && (
                    <Text style={[styles.eventCapacity, isIOS && styles.textIOS]}>
                        👥 {item.currentAttendees || 0}/{item.maxCapacity}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text>Cargando eventos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isIOS && (
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>📅 Eventos</Text>
                </LinearGradient>
            )}

            {!isIOS && (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>📅 Eventos</Text>
                </View>
            )}

            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing ? true : false} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No hay eventos disponibles</Text>
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
