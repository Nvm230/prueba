import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storyService, CreateStoryRequest } from '../services/stories';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';

export const CreateStoryScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();

    const [mediaUrl, setMediaUrl] = useState('');
    const [musicUrl, setMusicUrl] = useState('');
    const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

    const createMutation = useMutation({
        mutationFn: (data: CreateStoryRequest) => storyService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
            Alert.alert('¡Éxito!', 'Story creada correctamente');
            navigation.goBack();
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo crear la story');
        },
    });

    const handleCreate = () => {
        if (!mediaUrl.trim()) {
            Alert.alert('Error', 'La URL de la imagen/video es obligatoria');
            return;
        }

        createMutation.mutate({
            mediaUrl: mediaUrl.trim(),
            mediaType,
            musicUrl: musicUrl.trim() || undefined,
        });
    };

    const styles = createStyles(theme);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Simple Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Crear Story</Text>
                    <Text style={styles.headerSubtitle}>Comparte un momento</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>URL de Imagen/Video *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={mediaUrl}
                            onChangeText={setMediaUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de Media</Text>
                        <View style={styles.typeButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    mediaType === 'IMAGE' && styles.typeButtonActive,
                                ]}
                                onPress={() => setMediaType('IMAGE')}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        mediaType === 'IMAGE' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    📷 Imagen
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    mediaType === 'VIDEO' && styles.typeButtonActive,
                                ]}
                                onPress={() => setMediaType('VIDEO')}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        mediaType === 'VIDEO' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    🎥 Video
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>URL de Música (Opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://open.spotify.com/track/..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={musicUrl}
                            onChangeText={setMusicUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                        <Text style={styles.hint}>
                            🎵 Agrega música de Spotify para tu story
                        </Text>
                    </View>

                    {/* Preview */}
                    {mediaUrl.trim() !== '' && (
                        <View style={styles.preview}>
                            <Text style={styles.previewLabel}>Vista Previa</Text>
                            <Image
                                source={{ uri: mediaUrl }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                        />
                        <Button
                            title={createMutation.isPending ? 'Creando...' : 'Publicar'}
                            onPress={handleCreate}
                            disabled={createMutation.isPending}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
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
    hint: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 6,
    },
    typeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.card,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    typeButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe',
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    typeButtonTextActive: {
        color: theme.colors.primary,
    },
    preview: {
        marginBottom: 24,
    },
    previewLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceVariant,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});
