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
import { postService, CreatePostRequest } from '../../services/posts';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';

export const CreatePostScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const isIOS = Platform.OS === 'ios';

    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [musicUrl, setMusicUrl] = useState('');
    const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

    const createMutation = useMutation({
        mutationFn: (data: CreatePostRequest) => postService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            Alert.alert('¡Éxito!', 'Publicación creada correctamente');
            navigation.goBack();
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo crear la publicación');
        },
    });

    const handleCreate = () => {
        if (!content.trim()) {
            Alert.alert('Error', 'El contenido es obligatorio');
            return;
        }

        createMutation.mutate({
            content: content.trim(),
            mediaUrl: mediaUrl.trim() || undefined,
            mediaType: mediaUrl.trim() ? mediaType : undefined,
            musicUrl: musicUrl.trim() || undefined,
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
                        <Text style={styles.headerTitle}>Nueva Publicación</Text>
                        <Text style={styles.headerSubtitle}>Comparte con la comunidad</Text>
                    </LinearGradient>
                ) : (
                    <View style={styles.headerAndroid}>
                        <Text style={styles.headerTitleAndroid}>Nueva Publicación</Text>
                        <Text style={styles.headerSubtitleAndroid}>Comparte con la comunidad</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contenido *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="¿Qué estás pensando?"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={6}
                            maxLength={1000}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>URL de Imagen/Video (Opcional)</Text>
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

                    {mediaUrl.trim() !== '' && (
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
                    )}

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
                            🎵 Agrega música de Spotify a tu publicación
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
                            title={createMutation.isPending ? 'Publicando...' : 'Publicar'}
                            onPress={handleCreate}
                            disabled={createMutation.isPending}
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
        height: 150,
        textAlignVertical: 'top',
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
        height: 250,
        borderRadius: 16,
        backgroundColor: theme.colors.surfaceVariant,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});
