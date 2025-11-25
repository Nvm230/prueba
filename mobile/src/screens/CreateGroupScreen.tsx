import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Switch,
    Platform,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService, CreateGroupRequest } from '../services/groups';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

export const CreateGroupScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const isIOS = Platform.OS === 'ios';

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [imageUrl, setImageUrl] = useState('');

    const createMutation = useMutation({
        mutationFn: (data: CreateGroupRequest) => groupService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            Alert.alert('¡Éxito!', 'Grupo creado correctamente');
            navigation.goBack();
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo crear el grupo');
        },
    });

    const handleCreate = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre del grupo es obligatorio');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'La descripción es obligatoria');
            return;
        }

        createMutation.mutate({
            name: name.trim(),
            description: description.trim(),
            isPublic,
            imageUrl: imageUrl.trim() || undefined,
        });
    };

    const styles = createStyles(theme, isIOS);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                {isIOS ? (
                    <LinearGradient
                        colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                        style={styles.header}
                    >
                        <Text style={styles.headerTitle}>Crear Grupo</Text>
                        <Text style={styles.headerSubtitle}>Crea una nueva comunidad</Text>
                    </LinearGradient>
                ) : (
                    <View style={styles.headerAndroid}>
                        <Text style={styles.headerTitleAndroid}>Crear Grupo</Text>
                        <Text style={styles.headerSubtitleAndroid}>Crea una nueva comunidad</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre del Grupo *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Estudiantes de Ingeniería"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={name}
                            onChangeText={setName}
                            maxLength={50}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descripción *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe de qué trata el grupo..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>URL de Imagen (Opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={imageUrl}
                            onChangeText={setImageUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <View style={styles.switchLabel}>
                            <Text style={styles.label}>Grupo Público</Text>
                            <Text style={styles.switchDescription}>
                                {isPublic
                                    ? 'Cualquiera puede unirse'
                                    : 'Requiere aprobación para unirse'}
                            </Text>
                        </View>
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{ false: '#cbd5e1', true: theme.colors.primary }}
                            thumbColor={isPublic ? '#f8fafc' : '#ffffff'}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                        />
                        <Button
                            title={createMutation.isLoading ? 'Creando...' : 'Crear Grupo'}
                            onPress={handleCreate}
                            disabled={createMutation.isLoading}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 32,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ffffffcc',
    },
    headerAndroid: {
        paddingTop: 80,
        paddingBottom: 32,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    headerTitleAndroid: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitleAndroid: {
        fontSize: 14,
        color: '#ffffffdd',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    switchLabel: {
        flex: 1,
        marginRight: 16,
    },
    switchDescription: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});
