// Modern RegisterScreen with Glassmorphism and Animations
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';

export const RegisterScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
            valid = false;
        } else if (name.trim().length < 2) {
            newErrors.name = 'Mínimo 2 caracteres';
            valid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'La contraseña es requerida';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
            valid = false;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
            valid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register(email.trim(), password, name.trim());
        } catch (error) {
            console.error('Register error:', error);
        } finally {
            setLoading(false);
        }
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Animated Gradient Background */}
            <LinearGradient
                colors={[
                    theme.colors.primaryGradient[0],
                    theme.colors.primaryGradient[1],
                    theme.colors.primaryGradient[2],
                ] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo/Title Section */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(100)}
                        style={styles.header}
                    >
                        <Text style={styles.logo}>🎓</Text>
                        <Text style={styles.title}>Únete a UniVibe</Text>
                        <Text style={styles.subtitle}>Crea tu cuenta y comienza</Text>
                    </Animated.View>

                    {/* Register Form Card */}
                    <Animated.View
                        entering={FadeInUp.duration(600).delay(200)}
                        style={styles.formContainer}
                    >
                        <Card variant="glass" elevated style={styles.card}>
                            <Input
                                label="Nombre completo"
                                placeholder="Tu nombre"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setErrors({ ...errors, name: '' });
                                }}
                                error={errors.name}
                                autoCapitalize="words"
                            />

                            <Input
                                label="Email"
                                placeholder="tu@email.com"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setErrors({ ...errors, email: '' });
                                }}
                                error={errors.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <Input
                                label="Contraseña"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setErrors({ ...errors, password: '' });
                                }}
                                error={errors.password}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            <Input
                                label="Confirmar contraseña"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setErrors({ ...errors, confirmPassword: '' });
                                }}
                                error={errors.confirmPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            <Button
                                title={loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                onPress={handleRegister}
                                loading={loading}
                                disabled={loading}
                                size="large"
                                style={styles.registerButton}
                            />

                            <Text style={styles.terms}>
                                Al registrarte, aceptas nuestros{' '}
                                <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
                                <Text style={styles.termsLink}>Política de Privacidad</Text>
                            </Text>
                        </Card>
                    </Animated.View>

                    {/* Login Link */}
                    <Animated.View
                        entering={FadeInUp.duration(600).delay(300)}
                        style={styles.footer}
                    >
                        <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Inicia Sesión</Text>
                        </Pressable>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        keyboardView: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: Platform.OS === 'ios' ? 80 : 60,
            paddingBottom: 40,
        },
        header: {
            alignItems: 'center',
            marginBottom: 32,
        },
        logo: {
            fontSize: 64,
            marginBottom: 16,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 8,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        subtitle: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
        },
        formContainer: {
            marginBottom: 24,
        },
        card: {
            padding: 24,
        },
        registerButton: {
            marginBottom: 24,
        },
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        dividerText: {
            color: 'rgba(255, 255, 255, 0.7)',
            paddingHorizontal: 16,
            fontSize: 14,
        },
        socialButtons: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
        },
        socialButton: {
            flex: 1,
        },
        terms: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            lineHeight: 18,
        },
        termsLink: {
            color: '#ffffff',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        footerText: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
        },
        footerLink: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
        },
    });
