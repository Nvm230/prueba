import { StyleSheet, Text, View } from 'react-native';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{notification.title}</Text>
    <Text style={styles.message}>{notification.message}</Text>
    <Text style={styles.meta}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 6,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B'
  },
  message: {
    fontSize: 13,
    color: '#475569'
  },
  meta: {
    fontSize: 11,
    color: '#94A3B8'
  }
});

export default NotificationItem;
