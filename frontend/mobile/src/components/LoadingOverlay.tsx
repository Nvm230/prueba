import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#090914' : '#ffffff' }] }>
      <ActivityIndicator size="large" color="#6366F1" />
      {message && <Text style={[styles.message, theme === 'dark' && { color: '#CBD5F5' }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#1F2937'
  }
});

export default LoadingOverlay;
