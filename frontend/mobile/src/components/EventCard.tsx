import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Event } from '@/types';
import { format } from 'date-fns';

const EventCard: React.FC<{ event: Event; onPress?: () => void }> = ({ event, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{event.title}</Text>
    <Text style={styles.description}>{event.description}</Text>
    <View style={styles.row}>
      <Text style={styles.tag}>{event.category}</Text>
      <Text style={styles.meta}>{format(new Date(event.startTime), 'dd MMM HH:mm')}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A'
  },
  description: {
    fontSize: 14,
    color: '#475569'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tag: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600'
  },
  meta: {
    fontSize: 12,
    color: '#64748B'
  }
});

export default EventCard;
