import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const RegisterScreen: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const { register, loading } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    if (!name || !email || !password) {
      show({ title: 'Completa todos los campos' });
      return;
    }
    try {
      await register({ name, email, password });
    } catch (error: any) {
      show({ title: 'Error', message: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Personaliza tu experiencia y registra tus eventos favoritos.</Text>
        <TextField label="Nombre" value={name} onChangeText={setName} />
        <TextField label="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton title={loading ? 'Creando…' : 'Registrarme'} onPress={onSubmit} />
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC'
  },
  card: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 24,
    gap: 16,
    elevation: 6
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A'
  },
  subtitle: {
    fontSize: 14,
    color: '#475569'
  },
  link: {
    marginTop: 12,
    color: '#4F46E5',
    textAlign: 'center'
  }
});

export default RegisterScreen;
