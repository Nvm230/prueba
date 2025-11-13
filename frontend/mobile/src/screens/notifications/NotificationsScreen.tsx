import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import NotificationItem from '@/components/NotificationItem';
import EmptyState from '@/components/EmptyState';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '@/services/notificationService';

const NotificationsScreen = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const query = useQuery({
    queryKey: ['notifications', user?.id, page],
    queryFn: ({ signal }) => fetchNotifications(user!.id, { page, size: 10 }, signal),
    enabled: Boolean(user)
  });

  if (query.isLoading) {
    return <LoadingOverlay message="Cargando notificaciones" />;
  }

  const notifications = query.data?.content ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length === 0 ? (
        <EmptyState title="Sin novedades" description="No tienes mensajes pendientes." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ gap: 12, paddingBottom: 120 }}
          renderItem={({ item }) => <NotificationItem notification={item} />}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A'
  }
});

export default NotificationsScreen;
