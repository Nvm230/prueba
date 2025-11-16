import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation } from '@tanstack/react-query';
import LoadingOverlay from '@/components/LoadingOverlay';
import PrimaryButton from '@/components/PrimaryButton';
import EmptyState from '@/components/EmptyState';
import { fetchEvent, registerForEvent } from '@/services/eventService';
import { format } from 'date-fns';
import { useToast } from '@/contexts/ToastContext';

const EventDetailScreen = () => {
  const route = useRoute<any>();
  const eventId = Number(route.params?.eventId);
  const { show } = useToast();
  const [ticket, setTicket] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['event-detail', eventId],
    queryFn: ({ signal }) => fetchEvent(eventId, signal),
    enabled: Boolean(eventId)
  });

  const mutation = useMutation({
    mutationFn: () => registerForEvent(eventId),
    onSuccess: (response) => {
      setTicket(response.qrBase64);
      show({ title: 'Registro completo', message: 'Tu código QR está disponible.' });
    },
    onError: (error: any) => show({ title: 'Error', message: error.message })
  });

  if (query.isLoading) {
    return <LoadingOverlay message="Cargando evento" />;
  }

  const event = query.data;

  if (!event) {
    return <EmptyState title="Evento no disponible" description="No encontramos este evento." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, gap: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.date}>{format(new Date(event.startTime), 'dd MMMM yyyy • HH:mm')}</Text>
      </View>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.details}>
        <Text style={styles.detailLabel}>Facultad</Text>
        <Text style={styles.detailValue}>{event.faculty ?? 'General'}</Text>
        <Text style={styles.detailLabel}>Carrera</Text>
        <Text style={styles.detailValue}>{event.career ?? 'Multi-disciplinaria'}</Text>
        <Text style={styles.detailLabel}>Etiquetas</Text>
        <Text style={styles.detailValue}>{event.tags.join(', ') || 'Sin etiquetas'}</Text>
      </View>
      {event.status !== 'FINISHED' && (
        <PrimaryButton
          title={mutation.isPending ? 'Generando…' : 'Registrar y generar QR'}
          onPress={() => mutation.mutate()}
        />
      )}
      {ticket && (
        <View style={styles.ticket}>
          <Image source={{ uri: `data:image/png;base64,${ticket}` }} style={styles.qr} />
          <Text style={styles.ticketLabel}>Muestra este código al ingresar.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  hero: { gap: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#0F172A' },
  category: { fontSize: 14, color: '#6366F1' },
  date: { fontSize: 13, color: '#475569' },
  description: { fontSize: 15, color: '#1F2937', lineHeight: 22 },
  details: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  detailLabel: { fontSize: 12, color: '#64748B', textTransform: 'uppercase' },
  detailValue: { fontSize: 15, color: '#0F172A', fontWeight: '600' },
  ticket: {
    marginTop: 16,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  qr: { width: 200, height: 200 },
  ticketLabel: { fontSize: 13, color: '#475569' }
});

export default EventDetailScreen;
