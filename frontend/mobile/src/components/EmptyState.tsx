import { StyleSheet, Text, View } from 'react-native';

const EmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5F5',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B'
  },
  description: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center'
  }
});

export default EmptyState;
