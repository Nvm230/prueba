// CreateEventScreen matching web version
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, CreateEventRequest } from '../../services/events';

const categories = [
    'Technology',
    'Wellness',
    'Sports',
    'Entrepreneurship',
    'Art',
    'Science',
    'Education',
    'Networking',
    'Workshop',
    'Conference'
];

export const CreateEventScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        faculty: '',
        career: '',
        visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
        maxCapacity: '',
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // +2 hours
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [hasMaxCapacity, setHasMaxCapacity] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const createMutation = useMutation({
        mutationFn: (data: CreateEventRequest) => eventService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            Alert.alert('Éxito', 'Evento creado correctamente');
            navigation.goBack();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al crear evento';
            Alert.alert('Error', errorMessage);
            console.error('Error creating event:', error);
        },
    });

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.title.trim() || formData.title.length < 3) {
            newErrors.title = 'El título debe tener al menos 3 caracteres';
        }

        if (!formData.category) {
            newErrors.category = 'Selecciona una categoría';
        }

        if (!formData.description.trim() || formData.description.length < 10) {
            newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        // Validate dates
        if (endDate <= startDate) {
            newErrors.endTime = 'La fecha de fin debe ser posterior a la de inicio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload: CreateEventRequest = {
            title: formData.title.trim(),
            category: formData.category,
            description: formData.description.trim(),
            faculty: formData.faculty.trim() || undefined,
            career: formData.career.trim() || undefined,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            visibility: formData.visibility,
            maxCapacity: hasMaxCapacity && formData.maxCapacity ? parseInt(formData.maxCapacity) : undefined,
        };

        createMutation.mutate(payload);
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowStartPicker(false);
        }
        if (selectedDate) {
            setStartDate(selectedDate);
            if (pickerMode === 'date' && Platform.OS === 'ios') {
                // On iOS, show time picker after date
                setPickerMode('time');
            } else if (pickerMode === 'time') {
                setShowStartPicker(false);
                setPickerMode('date');
            }
        }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowEndPicker(false);
        }
        if (selectedDate) {
            setEndDate(selectedDate);
            if (pickerMode === 'date' && Platform.OS === 'ios') {
                setPickerMode('time');
            } else if (pickerMode === 'time') {
                setShowEndPicker(false);
                setPickerMode('date');
            }
        }
    };

    const showStartDatePicker = () => {
        setPickerMode('date');
        setShowStartPicker(true);
    };

    const showEndDatePicker = () => {
        setPickerMode('date');
        setShowEndPicker(true);
    };

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const styles = createStyles(theme);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>
                    <Text style={styles.headerTitle}>Crear Evento</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.formContainer}>
                    {/* Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título del Evento *</Text>
                        <TextInput
                            style={[styles.input, errors.title && styles.inputError]}
                            placeholder="Ej: Taller de Programación Web"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={formData.title}
                            onChangeText={(value) => updateField('title', value)}
                        />
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                    </View>

                    {/* Category */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría *</Text>
                        <View style={styles.pickerContainer}>
                            {categories.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        formData.category === cat && styles.categoryChipSelected
                                    ]}
                                    onPress={() => updateField('category', cat)}
                                >
                                    <Text style={[
                                        styles.categoryChipText,
                                        formData.category === cat && styles.categoryChipTextSelected
                                    ]}>
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                            placeholder="Describe el evento, sus objetivos..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={formData.description}
                            onChangeText={(value) => updateField('description', value)}
                            multiline
                            numberOfLines={5}
                        />
                        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                    </View>

                    {/* Faculty */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Facultad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Facultad de Ingeniería"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={formData.faculty}
                            onChangeText={(value) => updateField('faculty', value)}
                        />
                    </View>

                    {/* Career */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Carrera</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Ingeniería en Informática"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={formData.career}
                            onChangeText={(value) => updateField('career', value)}
                        />
                    </View>

                    {/* Start Time */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha y Hora de Inicio *</Text>
                        <Pressable
                            style={[styles.dateButton, errors.startTime && styles.inputError]}
                            onPress={showStartDatePicker}
                        >
                            <Text style={styles.dateButtonText}>
                                📅 {formatDateTime(startDate)}
                            </Text>
                        </Pressable>
                        {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
                    </View>

                    {/* End Time */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha y Hora de Fin *</Text>
                        <Pressable
                            style={[styles.dateButton, errors.endTime && styles.inputError]}
                            onPress={showEndDatePicker}
                        >
                            <Text style={styles.dateButtonText}>
                                📅 {formatDateTime(endDate)}
                            </Text>
                        </Pressable>
                        {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
                    </View>

                    {/* Date Pickers */}
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode={pickerMode}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onStartDateChange}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode={pickerMode}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onEndDateChange}
                        />
                    )}

                    {/* Visibility */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Visibilidad</Text>
                        <View style={styles.switchContainer}>
                            <View style={styles.switchOption}>
                                <Pressable
                                    style={[
                                        styles.visibilityButton,
                                        formData.visibility === 'PUBLIC' && styles.visibilityButtonActive
                                    ]}
                                    onPress={() => updateField('visibility', 'PUBLIC')}
                                >
                                    <Text style={[
                                        styles.visibilityButtonText,
                                        formData.visibility === 'PUBLIC' && styles.visibilityButtonTextActive
                                    ]}>
                                        Público
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.visibilityButton,
                                        formData.visibility === 'PRIVATE' && styles.visibilityButtonActive
                                    ]}
                                    onPress={() => updateField('visibility', 'PRIVATE')}
                                >
                                    <Text style={[
                                        styles.visibilityButtonText,
                                        formData.visibility === 'PRIVATE' && styles.visibilityButtonTextActive
                                    ]}>
                                        Privado
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Max Capacity */}
                    <View style={styles.inputGroup}>
                        <View style={styles.checkboxContainer}>
                            <Pressable
                                style={styles.checkbox}
                                onPress={() => setHasMaxCapacity(!hasMaxCapacity)}
                            >
                                <View style={[styles.checkboxBox, hasMaxCapacity && styles.checkboxBoxChecked]}>
                                    {hasMaxCapacity && <Text style={styles.checkboxCheck}>✓</Text>}
                                </View>
                                <Text style={styles.checkboxLabel}>Establecer límite de aforo</Text>
                            </Pressable>
                        </View>
                        {hasMaxCapacity && (
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 50"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={formData.maxCapacity}
                                onChangeText={(value) => updateField('maxCapacity', value)}
                                keyboardType="number-pad"
                            />
                        )}
                        <Text style={styles.hint}>
                            {hasMaxCapacity
                                ? 'Establece el número máximo de participantes'
                                : 'Deja sin marcar para inscripciones ilimitadas'}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.actions}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={createMutation.isPending ? 'Creando...' : 'Crear Evento'}
                            onPress={handleSubmit}
                            disabled={createMutation.isPending}
                            style={styles.submitButton}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollView: {
            flex: 1,
        },
        header: {
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.primary,
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
        formContainer: {
            padding: 20,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        input: {
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            padding: 12,
            fontSize: 15,
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        inputError: {
            borderColor: '#ef4444',
        },
        textArea: {
            minHeight: 100,
            textAlignVertical: 'top',
        },
        errorText: {
            color: '#ef4444',
            fontSize: 12,
            marginTop: 4,
        },
        hint: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 4,
            fontStyle: 'italic',
        },
        dateButton: {
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flexDirection: 'row',
            alignItems: 'center',
        },
        dateButtonText: {
            fontSize: 15,
            color: theme.colors.text,
        },
        pickerContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        categoryChip: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        categoryChipSelected: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        categoryChipText: {
            fontSize: 13,
            color: theme.colors.text,
        },
        categoryChipTextSelected: {
            color: '#ffffff',
            fontWeight: '600',
        },
        switchContainer: {
            marginTop: 4,
        },
        switchOption: {
            flexDirection: 'row',
            gap: 8,
        },
        visibilityButton: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
        },
        visibilityButtonActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        visibilityButtonText: {
            fontSize: 14,
            color: theme.colors.text,
        },
        visibilityButtonTextActive: {
            color: '#ffffff',
            fontWeight: '600',
        },
        checkboxContainer: {
            marginBottom: 12,
        },
        checkbox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        checkboxBox: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: theme.colors.border,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkboxBoxChecked: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        checkboxCheck: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
        },
        checkboxLabel: {
            fontSize: 14,
            color: theme.colors.text,
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 24,
        },
        cancelButton: {
            flex: 1,
        },
        submitButton: {
            flex: 2,
        },
    });
