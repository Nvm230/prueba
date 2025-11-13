import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import PrimaryButton from '@/components/PrimaryButton';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Apariencia</Text>
        <Text style={styles.description}>Elige el modo que prefieras para usar UniVibe.</Text>
        <PrimaryButton title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} onPress={toggleTheme} />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Sesión</Text>
        <Text style={styles.description}>Cierra tu sesión actual de manera segura.</Text>
        <PrimaryButton title="Cerrar sesión" onPress={logout} />
      </View>
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
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  card: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    gap: 12,
    elevation: 2
  },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  description: { fontSize: 13, color: '#475569' }
});

export default SettingsScreen;
