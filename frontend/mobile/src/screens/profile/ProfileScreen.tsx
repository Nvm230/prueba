import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProximity } from '@/contexts/ProximityContext';
import { LiquidCrystalEffect } from '@/components/LiquidCrystalEffect';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { shouldHideData } = useProximity();
  const navigation = useNavigation<any>();

  if (!user) {
    return null;
  }

  return (
    <LiquidCrystalEffect>
      <View style={styles.container}>
        <View style={styles.card}>
        <Text style={styles.title}>{shouldHideData ? '•••' : user.name}</Text>
        <Text style={styles.subtitle}>{shouldHideData ? '••••••••' : user.email}</Text>
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Rol</Text>
            <Text style={styles.statValue}>{shouldHideData ? '•••' : user.role}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Puntos</Text>
            <Text style={styles.statValue}>{shouldHideData ? '•••' : user.points}</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>Preferencias</Text>
        <Text style={styles.preferences}>{(user.preferredCategories ?? []).join(' · ') || 'Sin preferencias'}</Text>
        <PrimaryButton title="Abrir configuración" onPress={() => navigation.navigate('Settings')} />
        </View>
      </View>
    </LiquidCrystalEffect>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    gap: 16,
    elevation: 4
  },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B' },
  row: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: '#EEF2FF', borderRadius: 20, padding: 16 },
  statLabel: { fontSize: 12, color: '#6366F1', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  sectionLabel: { fontSize: 12, color: '#94A3B8', textTransform: 'uppercase' },
  preferences: { fontSize: 14, color: '#475569' }
});

export default ProfileScreen;
