// CreateEventScreen with form and validation
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
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { eventService } from '../services/events';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const CreateEventScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        imageUrl: '',
    });
    const [errors, setErrors] = useState<any>({});

    const createMutation = useMutation({
        mutationFn: (data: any) => eventService.create(data),
        onSuccess: () => {
            Alert.alert('Éxito', 'Evento creado correctamente');
            navigation.goBack();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.message || 'Error al crear evento');
        },
    });

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La ubicación es requerida';
        }

        if (!formData.date.trim()) {
            newErrors.date = 'La fecha es requerida';
        }

        if (!formData.startTime.trim()) {
            newErrors.startTime = 'La hora de inicio es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        createMutation.mutate({
            ...formData,
            date: new Date(formData.date).toISOString(),
            startTime: new Date(`${formData.date} ${formData.startTime}`).toISOString(),
            endTime: formData.endTime
                ? new Date(`${formData.date} ${formData.endTime}`).toISOString()
                : null,
        });
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
                <Text style={styles.headerTitle}>Crear Evento</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Información Básica</Text>

                        <Input
                            label="Título del Evento *"
                            placeholder="Ej: Networking Tech 2024"
                            value={formData.title}
                            onChangeText={(value) => updateField('title', value)}
                            error={errors.title}
                        />

                        <Input
                            label="Descripción"
                            placeholder="Describe tu evento..."
                            value={formData.description}
                            onChangeText={(value) => updateField('description', value)}
                            multiline
                            numberOfLines={4}
                            style={styles.textArea}
                        />

                        <Input
                            label="Ubicación *"
                            placeholder="Ej: Auditorio Principal"
                            value={formData.location}
                            onChangeText={(value) => updateField('location', value)}
                            error={errors.location}
                        />
                    </Card>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Fecha y Hora</Text>

                        <Input
                            label="Fecha *"
                            placeholder="YYYY-MM-DD"
                            value={formData.date}
                            onChangeText={(value) => updateField('date', value)}
                            error={errors.date}
                        />

                        <View style={styles.timeRow}>
                            <View style={styles.timeField}>
                                <Input
                                    label="Hora Inicio *"
                                    placeholder="HH:MM"
                                    value={formData.startTime}
                                    onChangeText={(value) => updateField('startTime', value)}
                                    error={errors.startTime}
                                />
                            </View>
                            <View style={styles.timeField}>
                                <Input
                                    label="Hora Fin"
                                    placeholder="HH:MM"
                                    value={formData.endTime}
                                    onChangeText={(value) => updateField('endTime', value)}
                                />
                            </View>
                        </View>

                        <Text style={styles.hint}>
                            💡 Formato de fecha: YYYY-MM-DD (Ej: 2024-12-25)
                        </Text>
                        <Text style={styles.hint}>
                            💡 Formato de hora: HH:MM (Ej: 14:30)
                        </Text>
                    </Card>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <Card variant="default" style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Imagen (Opcional)</Text>

                        <Input
                            label="URL de Imagen"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.imageUrl}
                            onChangeText={(value) => updateField('imageUrl', value)}
                            autoCapitalize="none"
                        />

                        {formData.imageUrl && (
                            <View style={styles.imagePreview}>
                                <Text style={styles.previewLabel}>Vista Previa:</Text>
                                <View style={styles.previewPlaceholder}>
                                    <Text style={styles.previewIcon}>🖼️</Text>
                                    <Text style={styles.previewText}>Imagen del evento</Text>
                                </View>
                            </View>
                        )}
                    </Card>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400)}>
                    <View style={styles.actions}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            size="large"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={createMutation.isPending ? 'Creando...' : 'Crear Evento'}
                            onPress={handleSubmit}
                            variant="primary"
                            size="large"
                            loading={createMutation.isPending}
                            disabled={createMutation.isPending}
                            style={styles.submitButton}
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
        timeRow: {
            flexDirection: 'row',
            gap: 12,
        },
        timeField: {
            flex: 1,
        },
        hint: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginTop: 8,
            fontStyle: 'italic',
        },
        imagePreview: {
            marginTop: 16,
        },
        previewLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        previewPlaceholder: {
            height: 150,
            borderRadius: 12,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
        },
        previewIcon: {
            fontSize: 48,
            marginBottom: 8,
        },
        previewText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
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
        submitButton: {
            flex: 2,
        },
        bottomSpacing: {
            height: 40,
        },
    });
