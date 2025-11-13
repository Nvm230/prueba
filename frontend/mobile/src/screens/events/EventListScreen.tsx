import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import TextField from '@/components/TextField';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { useEvents } from '@/hooks/useEvents';
import LoadingOverlay from '@/components/LoadingOverlay';
import PrimaryButton from '@/components/PrimaryButton';
import { Event } from '@/types';
import { useNavigation } from '@react-navigation/native';

const filters = ['Todos', 'PENDING', 'LIVE', 'FINISHED'] as const;

type FilterOption = (typeof filters)[number];

const EventListScreen = () => {
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<FilterOption>('Todos');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Event[]>([]);

  const query = useEvents({ page, size: 10, status: status === 'Todos' ? undefined : status, search: search || undefined });

  useEffect(() => {
    if (query.data) {
      setItems((prev) => (page === 0 ? query.data.content : [...prev, ...query.data!.content]));
    }
  }, [query.data, page]);

  useEffect(() => {
    setPage(0);
  }, [status, search]);

  const loadMore = () => {
    if (query.data && page + 1 < query.data.totalPages && !query.isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  if (query.isLoading && page === 0 && items.length === 0) {
    return <LoadingOverlay message="Cargando eventos" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextField label="Buscar" value={search} onChangeText={setSearch} placeholder="Hackathon" />
        <View style={styles.filterRow}>
          {filters.map((option) => (
            <PrimaryButton
              key={option}
              title={option === 'Todos' ? 'Todos' : option}
              onPress={() => setStatus(option)}
              style={{
                backgroundColor: status === option ? '#4F46E5' : '#E0E7FF',
                flex: 1
              }}
            />
          ))}
        </View>
      </View>
      {items.length === 0 ? (
        <EmptyState title="Sin eventos" description="No encontramos resultados con los filtros aplicados." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          refreshControl={<RefreshControl refreshing={query.isFetching} onRefresh={() => setPage(0)} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    gap: 16
  },
  filters: {
    gap: 16
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8
  }
});

export default EventListScreen;
