// CreateAnnouncementScreen for group admins
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
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const CreateAnnouncementScreen = ({ route, navigation }: any) => {
    const { groupId } = route.params;
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const validate = () => {
        const newErrors: any = {};
        if (!title.trim()) newErrors.title = 'El título es requerido';
        if (!content.trim()) newErrors.content = 'El contenido es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = () => {
        if (!validate()) return;
        Alert.alert('Éxito', 'Anuncio creado correctamente');
        navigation.goBack();
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
                <Text style={styles.headerTitle}>Crear Anuncio</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView style={styles.scrollView}>
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Card variant="default" style={styles.card}>
                        <Input
                            label="Título *"
                            placeholder="Título del anuncio"
                            value={title}
                            onChangeText={setTitle}
                            error={errors.title}
                        />

                        <Input
                            label="Contenido *"
                            placeholder="Escribe el contenido del anuncio..."
                            value={content}
                            onChangeText={setContent}
                            error={errors.content}
                            multiline
                            numberOfLines={6}
                            style={styles.textArea}
                        />

                        <View style={styles.optionRow}>
                            <View style={styles.optionInfo}>
                                <Text style={styles.optionLabel}>Fijar Anuncio</Text>
                                <Text style={styles.optionDescription}>
                                    Aparecerá al inicio de la lista
                                </Text>
                            </View>
                            <Switch value={isPinned} onValueChange={setIsPinned} />
                        </View>
                    </Card>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <View style={styles.actions}>
                        <Button
                            title="Cancelar"
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            style={styles.cancelButton}
                        />
                        <Button
                            title="Publicar"
                            onPress={handleCreate}
                            variant="primary"
                            style={styles.createButton}
                        />
                    </View>
                </Animated.View>
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
        card: {
            margin: 20,
            padding: 20,
        },
        textArea: {
            minHeight: 120,
            textAlignVertical: 'top',
        },
        optionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        optionInfo: {
            flex: 1,
        },
        optionLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        optionDescription: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginHorizontal: 20,
            marginBottom: 40,
        },
        cancelButton: {
            flex: 1,
        },
        createButton: {
            flex: 2,
        },
    });
