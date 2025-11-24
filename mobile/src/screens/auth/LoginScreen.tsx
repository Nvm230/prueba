import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const isIOS = Platform.OS === 'ios';

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo/Title */}
                    <View style={styles.header}>
                        <Text style={[styles.title, isIOS && styles.titleIOS]}>🎓 UniVibe</Text>
                        <Text style={[styles.subtitle, isIOS && styles.subtitleIOS]}>
                            Tu comunidad universitaria
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View style={[styles.formContainer, isIOS && styles.formContainerIOS]}>
                        <Text style={styles.formTitle}>Iniciar Sesión</Text>

                        <TextInput
                            style={[styles.input, isIOS && styles.inputIOS]}
                            placeholder="Correo electrónico"
                            placeholderTextColor={isIOS ? '#ffffff80' : '#999'}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <TextInput
                            style={[styles.input, isIOS && styles.inputIOS]}
                            placeholder="Contraseña"
                            placeholderTextColor={isIOS ? '#ffffff80' : '#999'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Button
                            title={isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                            onPress={handleLogin}
                            disabled={isLoading}
                        />

                        <TouchableOpacity
                            style={styles.registerLink}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={[styles.registerText, isIOS && styles.registerTextIOS]}>
                                ¿No tienes cuenta? Regístrate
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    titleIOS: {
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    subtitleIOS: {
        color: '#ffffffcc',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    formContainerIOS: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    inputIOS: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        color: '#ffffff',
    },
    registerLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    registerText: {
        color: '#8b5cf6',
        fontSize: 14,
    },
    registerTextIOS: {
        color: '#ffffff',
    },
});
