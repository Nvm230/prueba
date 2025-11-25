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
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

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
            console.log('[REGISTER] Attempting registration for:', email);
            await register(name, email, password);
            console.log('[REGISTER] Registration successful');
        } catch (error: any) {
            console.error('[REGISTER] Registration error:', error);
            console.error('[REGISTER] Error response:', error.response?.data);

            let errorMessage = 'Error al registrarse';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 409 || error.response?.status === 400) {
                errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Error de registro', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isIOS = Platform.OS === 'ios';

    return (
        <LinearGradient
            colors={['#5b21b6', '#7c3aed', '#a855f7']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.logo}>🎓</Text>
                            <Text style={styles.title}>Crear Cuenta</Text>
                            <Text style={styles.subtitle}>
                                Únete a la comunidad universitaria
                            </Text>
                        </View>

                        {/* Register Form */}
                        {isIOS ? (
                            <BlurView intensity={20} tint="light" style={styles.formContainer}>
                                <View style={styles.formInner}>
                                    <Text style={styles.formTitle}>Regístrate</Text>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nombre completo"
                                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Correo electrónico"
                                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Contraseña"
                                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirmar contraseña"
                                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                        />
                                    </View>

                                    <Button
                                        title={isLoading ? 'Registrando...' : 'Registrarse'}
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                    />

                                    <TouchableOpacity
                                        style={styles.loginLink}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        <Text style={styles.loginText}>
                                            ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        ) : (
                            <View style={[styles.formContainer, styles.formContainerAndroid]}>
                                <Text style={[styles.formTitle, styles.formTitleAndroid]}>Regístrate</Text>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.inputAndroid]}
                                        placeholder="Nombre completo"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.inputAndroid]}
                                        placeholder="Correo electrónico"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.inputAndroid]}
                                        placeholder="Contraseña"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.inputAndroid]}
                                        placeholder="Confirmar contraseña"
                                        placeholderTextColor="#999"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <Button
                                    title={isLoading ? 'Registrando...' : 'Registrarse'}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                />

                                <TouchableOpacity
                                    style={styles.loginLink}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={[styles.loginText, styles.loginTextAndroid]}>
                                        ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 64,
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    title: {
        fontSize: 44,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 12,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 17,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    formContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    formContainerAndroid: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    formInner: {
        padding: 28,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 28,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    formTitleAndroid: {
        color: '#333',
    },
    inputContainer: {
        marginBottom: 14,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '500',
    },
    inputAndroid: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        borderColor: '#e0e0e0',
    },
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 8,
    },
    loginText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
    },
    loginTextAndroid: {
        color: '#666',
    },
    loginTextBold: {
        fontWeight: '700',
        color: '#ffffff',
    },
});
