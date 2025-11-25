import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '../../utils/toast';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const isIOS = Platform.OS === 'ios';

    const loginMutation = useMutation({
        mutationFn: () => login(email, password),
        onSuccess: () => {
            showToast.success('¡Bienvenido!', 'Inicio de sesión exitoso');
        },
        onError: (error: any) => {
            console.error('Login error:', error);
            const message = error.message || 'Error al iniciar sesión';
            showToast.error('Error', message);
        },
    });

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            showToast.error('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            showToast.error('Error', 'Por favor ingresa un email válido');
            return;
        }

        loginMutation.mutate();
    };

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LinearGradient
                    colors={['#5b21b6', '#6d28d9', '#7c3aed']}
                    style={styles.gradient}
                >
                    {isIOS ? (
                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Bienvenido</Text>
                                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#9ca3af"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!loginMutation.isPending}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Contraseña"
                                        placeholderTextColor="#9ca3af"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        editable={!loginMutation.isPending}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        loginMutation.isPending && styles.buttonDisabled,
                                    ]}
                                    onPress={handleLogin}
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Register')}
                                    disabled={loginMutation.isPending}
                                >
                                    <Text style={styles.registerText}>
                                        ¿No tienes cuenta? Regístrate
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    ) : (
                        <View style={styles.formContainerAndroid}>
                            <Text style={styles.titleAndroid}>Bienvenido</Text>
                            <Text style={styles.subtitleAndroid}>Inicia sesión para continuar</Text>

                            <View style={styles.inputContainerAndroid}>
                                <TextInput
                                    style={styles.inputAndroid}
                                    placeholder="Email"
                                    placeholderTextColor="#9ca3af"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loginMutation.isPending}
                                />
                            </View>

                            <View style={styles.inputContainerAndroid}>
                                <TextInput
                                    style={styles.inputAndroid}
                                    placeholder="Contraseña"
                                    placeholderTextColor="#9ca3af"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loginMutation.isPending}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.buttonAndroid,
                                    loginMutation.isPending && styles.buttonDisabled,
                                ]}
                                onPress={handleLogin}
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.buttonTextAndroid}>Iniciar Sesión</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Register')}
                                disabled={loginMutation.isPending}
                            >
                                <Text style={styles.registerTextAndroid}>
                                    ¿No tienes cuenta? Regístrate
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    blurContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 400,
    },
    formContainer: {
        padding: 32,
    },
    formContainerAndroid: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    titleAndroid: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#e5e7eb',
        marginBottom: 32,
        textAlign: 'center',
    },
    subtitleAndroid: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputContainerAndroid: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
    },
    inputAndroid: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    button: {
        backgroundColor: '#8b5cf6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    buttonAndroid: {
        backgroundColor: '#8b5cf6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonTextAndroid: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    registerText: {
        color: '#e5e7eb',
        fontSize: 14,
        textAlign: 'center',
    },
    registerTextAndroid: {
        color: '#6b7280',
        fontSize: 14,
        textAlign: 'center',
    },
});
