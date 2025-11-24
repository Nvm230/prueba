import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { useProximity } from '@/contexts/ProximityContext';
import { LiquidCrystalEffect } from '@/components/LiquidCrystalEffect';
import * as Location from 'expo-location';

const DashboardScreen = () => {
  const { user } = useAuth();
  const { data, isLoading } = useEvents({ page: 0, size: 5, status: 'PENDING' });
  const [city, setCity] = useState<string | null>(null);
  const { shouldHideData } = useProximity();

  useEffect(() => {
    const requestLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
      const [address] = await Location.reverseGeocodeAsync(coords.coords);
      if (address?.city) setCity(address.city);
    };
    requestLocation();
  }, []);

  if (isLoading) {
    return <LoadingOverlay message="Sincronizando datos" />;
  }

  const events = data?.content ?? [];

  return (
    <LiquidCrystalEffect>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, gap: 24 }}>
        <Header />
      <View style={styles.summary}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Eventos registrados</Text>
          <Text style={styles.statValue}>{shouldHideData ? '•••' : user?.points ?? 0}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Rol</Text>
          <Text style={styles.statValue}>{shouldHideData ? '•••' : user?.role}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Ubicación</Text>
          <Text style={styles.statValue}>{city ?? 'Detectando…'}</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos eventos</Text>
        <Text style={styles.sectionSubtitle}>Descubre lo que viene para ti.</Text>
      </View>
      {events.length === 0 ? (
        <EmptyState title="Sin eventos" description="No hay eventos próximos. Revisa más tarde." />
      ) : (
        <View style={styles.list}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      )}
      </ScrollView>
    </LiquidCrystalEffect>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  summary: {
    flexDirection: 'row',
    gap: 12
  },
  stat: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#EEF2FF'
  },
  statLabel: {
    fontSize: 12,
    color: '#6366F1',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937'
  },
  sectionHeader: {
    gap: 4
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A'
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#475569'
  },
  list: {
    gap: 12
  }
});

export default DashboardScreen;
