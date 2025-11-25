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

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            console.log('[LOGIN] Attempting login for:', email);
            await login(email, password);
            console.log('[LOGIN] Login successful');
        } catch (error: any) {
            console.error('[LOGIN] Login error:', error);
            console.error('[LOGIN] Error response:', error.response?.data);

            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Credenciales incorrectas';
            } else if (error.response?.status === 404) {
                errorMessage = 'Usuario no encontrado';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Error de inicio de sesión', errorMessage);
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
                        {/* Logo/Title */}
                        <View style={styles.header}>
                            <Text style={styles.logo}>🎓</Text>
                            <Text style={styles.title}>UniVibe</Text>
                            <Text style={styles.subtitle}>
                                Tu comunidad universitaria
                            </Text>
                        </View>

                        {/* Login Form */}
                        {isIOS ? (
                            <BlurView intensity={20} tint="light" style={styles.formContainer}>
                                <View style={styles.formInner}>
                                    <Text style={styles.formTitle}>Iniciar Sesión</Text>

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

                                    <Button
                                        title={isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                    />

                                    <TouchableOpacity
                                        style={styles.registerLink}
                                        onPress={() => navigation.navigate('Register')}
                                    >
                                        <Text style={styles.registerText}>
                                            ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        ) : (
                            <View style={[styles.formContainer, styles.formContainerAndroid]}>
                                <Text style={[styles.formTitle, styles.formTitleAndroid]}>Iniciar Sesión</Text>

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

                                <Button
                                    title={isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                />

                                <TouchableOpacity
                                    style={styles.registerLink}
                                    onPress={() => navigation.navigate('Register')}
                                >
                                    <Text style={[styles.registerText, styles.registerTextAndroid]}>
                                        ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
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
        marginBottom: 48,
    },
    logo: {
        fontSize: 72,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    title: {
        fontSize: 52,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 12,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
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
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 32,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    formTitleAndroid: {
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 16,
        padding: 18,
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
    registerLink: {
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 8,
    },
    registerText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
    },
    registerTextAndroid: {
        color: '#666',
    },
    registerTextBold: {
        fontWeight: '700',
        color: '#ffffff',
    },
});
