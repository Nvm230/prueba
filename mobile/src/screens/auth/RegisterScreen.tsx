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
} from 'react-native';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al registrarse');
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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, isIOS && styles.titleIOS]}>Crear Cuenta</Text>
                        <Text style={[styles.subtitle, isIOS && styles.subtitleIOS]}>
                            Únete a la comunidad universitaria
                        </Text>
                    </View>

                    {/* Register Form */}
                    <View style={[styles.formContainer, isIOS && styles.formContainerIOS]}>
                        <TextInput
                            style={[styles.input, isIOS && styles.inputIOS]}
                            placeholder="Nombre completo"
                            placeholderTextColor={isIOS ? '#ffffff80' : '#999'}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />

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

                        <TextInput
                            style={[styles.input, isIOS && styles.inputIOS]}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={isIOS ? '#ffffff80' : '#999'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <Button
                            title={isLoading ? 'Registrando...' : 'Registrarse'}
                            onPress={handleRegister}
                            disabled={isLoading}
                        />

                        <View style={styles.loginLink}>
                            <Text style={[styles.loginText, isIOS && styles.loginTextIOS]}>
                                ¿Ya tienes cuenta?{' '}
                            </Text>
                            <Text
                                style={[styles.loginButton, isIOS && styles.loginButtonIOS]}
                                onPress={() => navigation.navigate('Login')}
                            >
                                Inicia sesión
                            </Text>
                        </View>
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
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
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
        textAlign: 'center',
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
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginTextIOS: {
        color: '#ffffffcc',
    },
    loginButton: {
        color: '#8b5cf6',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButtonIOS: {
        color: '#ffffff',
    },
});
