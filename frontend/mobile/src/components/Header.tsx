import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Hola, {user?.name ?? 'visitante'}</Text>
        <Text style={styles.subtitle}>Explora los eventos y notificaciones más recientes.</Text>
      </View>
      <Text onPress={toggleTheme} style={styles.theme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569'
  },
  theme: {
    fontSize: 24
  }
});

export default Header;
