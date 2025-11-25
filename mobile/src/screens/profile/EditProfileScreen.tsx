// EditProfileScreen for editing user profile
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const EditProfileScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        profilePictureUrl: user?.profilePictureUrl || '',
        coverImageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // TODO: Implement API call to update profile
            await new Promise((resolve) => setTimeout(resolve, 1000));
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={theme.colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Card variant="glass" style={styles.avatarCard}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={theme.colors.primaryGradient as any}
                                style={styles.avatarRing}
                            >
                                <Avatar
                                    uri={formData.profilePictureUrl}
                                    name={formData.name}
                                    size={100}
                                />
                            </LinearGradient>
                            <Pressable style={styles.changePhotoButton}>
                                <Text style={styles.changePhotoText}>Cambiar Foto</Text>
                            </Pressable>
                        </View>
                    </Card>
                </Animated.View>

                {/* Basic Info */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Información Básica</Text>

                        <Input
                            label="Nombre Completo *"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChangeText={(value) => updateField('name', value)}
                            error={errors.name}
                        />

                        <Input
                            label="Email *"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChangeText={(value) => updateField('email', value)}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Input
                            label="Biografía"
                            placeholder="Cuéntanos sobre ti..."
                            value={formData.bio}
                            onChangeText={(value) => updateField('bio', value)}
                            multiline
                            numberOfLines={4}
                            style={styles.textArea}
                        />
                    </Card>
                </Animated.View>

                {/* Profile Images */}
                <Animated.View entering={FadeInDown.delay(300)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Imágenes</Text>

                        <Input
                            label="URL de Foto de Perfil"
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={formData.profilePictureUrl}
                            onChangeText={(value) => updateField('profilePictureUrl', value)}
                            autoCapitalize="none"
                        />

                        <Input
                            label="URL de Imagen de Portada"
                            placeholder="https://ejemplo.com/portada.jpg"
                            value={formData.coverImageUrl}
                            onChangeText={(value) => updateField('coverImageUrl', value)}
                            autoCapitalize="none"
                        />

                        <Text style={styles.hint}>
                            💡 Puedes usar URLs de imágenes públicas
                        </Text>
                    </Card>
                </Animated.View>

                {/* Privacy Settings */}
                <Animated.View entering={FadeInDown.delay(400)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Privacidad</Text>

                        <Pressable style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Perfil Privado</Text>
                                <Text style={styles.settingDescription}>
                                    Solo tus amigos pueden ver tu perfil
                                </Text>
                            </View>
                            <View style={styles.toggle}>
                                <Text>🔒</Text>
                            </View>
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Mostrar Email</Text>
                                <Text style={styles.settingDescription}>
                                    Permitir que otros vean tu email
                                </Text>
                            </View>
                            <View style={styles.toggle}>
                                <Text>👁️</Text>
                            </View>
                        </Pressable>
                    </Card>
                </Animated.View>

                {/* Actions */}
                <Animated.View entering={FadeInDown.delay(500)}>
                    <View style={styles.actions}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            size="large"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={loading ? 'Guardando...' : 'Guardar Cambios'}
                            onPress={handleSave}
                            variant="primary"
                            size="large"
                            loading={loading}
                            disabled={loading}
                            style={styles.saveButton}
                        />
                    </View>
                </Animated.View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backIcon: {
            fontSize: 28,
            color: '#ffffff',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        placeholder: {
            width: 40,
        },
        scrollView: {
            flex: 1,
        },
        avatarCard: {
            marginHorizontal: 20,
            marginTop: 16,
            padding: 24,
        },
        avatarContainer: {
            alignItems: 'center',
        },
        avatarRing: {
            padding: 4,
            borderRadius: 56,
            marginBottom: 16,
        },
        changePhotoButton: {
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
        },
        changePhotoText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        formCard: {
            marginHorizontal: 20,
            marginTop: 16,
            padding: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        textArea: {
            minHeight: 100,
            textAlignVertical: 'top',
        },
        hint: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginTop: 8,
            fontStyle: 'italic',
        },
        settingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
        },
        settingInfo: {
            flex: 1,
        },
        settingLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        settingDescription: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        toggle: {
            fontSize: 24,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 8,
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginHorizontal: 20,
            marginTop: 24,
        },
        cancelButton: {
            flex: 1,
        },
        saveButton: {
            flex: 2,
        },
        bottomSpacing: {
            height: 40,
        },
    });
