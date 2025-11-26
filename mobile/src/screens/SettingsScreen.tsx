// Simplified SettingsScreen - Minimalist Design
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { useTheme, COLOR_PRESETS, ColorPreset, ThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';

export const SettingsScreen = ({ navigation }: any) => {
    const { theme, mode, colorPreset, setMode, setColorPreset } = useTheme();
    const { logout } = useAuth();
    const [pushNotifications, setPushNotifications] = React.useState(true);
    const [sound, setSound] = React.useState(true);
    const [privateProfile, setPrivateProfile] = React.useState(false);
    const [showInSearch, setShowInSearch] = React.useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {/* Simple Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Configuración</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Theme Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎨 Apariencia</Text>

                    <Card variant="elevated" style={styles.card}>
                        <Text style={styles.cardTitle}>Modo de Tema</Text>
                        <View style={styles.themeOptions}>
                            {(['dark', 'light', 'auto'] as ThemeMode[]).map((m) => (
                                <Pressable
                                    key={m}
                                    style={[
                                        styles.themeOption,
                                        mode === m && styles.themeOptionActive,
                                    ]}
                                    onPress={() => setMode(m)}
                                >
                                    <Text
                                        style={[
                                            styles.themeOptionText,
                                            mode === m && styles.themeOptionTextActive,
                                        ]}
                                    >
                                        {m === 'dark' ? '🌙 Oscuro' : m === 'light' ? '☀️ Claro' : '🔄 Auto'}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Card variant="elevated" style={styles.card}>
                        <Text style={styles.cardTitle}>Color Principal</Text>
                        <Text style={styles.cardSubtitle}>
                            Elige tu color favorito para personalizar la app
                        </Text>
                        <View style={styles.colorGrid}>
                            {(Object.keys(COLOR_PRESETS) as ColorPreset[]).map((preset) => {
                                const color = COLOR_PRESETS[preset];
                                return (
                                    <Pressable
                                        key={preset}
                                        style={styles.colorOption}
                                        onPress={() => setColorPreset(preset)}
                                    >
                                        <View
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: color.primary },
                                                colorPreset === preset && styles.colorCircleActive,
                                            ]}
                                        >
                                            {colorPreset === preset && (
                                                <Text style={styles.colorCheck}>✓</Text>
                                            )}
                                        </View>
                                        <Text style={styles.colorName}>{color.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Push Notifications</Text>
                                <Text style={styles.settingDescription}>
                                    Recibe notificaciones de eventos, mensajes y más
                                </Text>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Sonido</Text>
                                <Text style={styles.settingDescription}>
                                    Reproducir sonido con las notificaciones
                                </Text>
                            </View>
                            <Switch
                                value={sound}
                                onValueChange={setSound}
                            />
                        </View>
                    </Card>
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔒 Privacidad</Text>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Perfil Privado</Text>
                                <Text style={styles.settingDescription}>
                                    Solo tus amigos pueden ver tu perfil
                                </Text>
                            </View>
                            <Switch
                                value={privateProfile}
                                onValueChange={setPrivateProfile}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Mostrar en Búsquedas</Text>
                                <Text style={styles.settingDescription}>
                                    Permitir que otros te encuentren
                                </Text>
                            </View>
                            <Switch
                                value={showInSearch}
                                onValueChange={setShowInSearch}
                            />
                        </View>
                    </Card>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ Acerca de</Text>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Versión</Text>
                            <Text style={styles.aboutValue}>1.0.0</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Build</Text>
                            <Text style={styles.aboutValue}>2024.11.25</Text>
                        </View>
                    </Card>

                    <Card variant="elevated" style={styles.card}>
                        <Pressable style={styles.linkRow}>
                            <Text style={styles.linkText}>📄 Términos de Servicio</Text>
                            <Text style={styles.linkArrow}>→</Text>
                        </Pressable>
                        <View style={styles.divider} />
                        <Pressable style={styles.linkRow}>
                            <Text style={styles.linkText}>🔐 Política de Privacidad</Text>
                            <Text style={styles.linkArrow}>→</Text>
                        </Pressable>
                        <View style={styles.divider} />
                        <Pressable style={styles.linkRow}>
                            <Text style={styles.linkText}>❓ Ayuda y Soporte</Text>
                            <Text style={styles.linkArrow}>→</Text>
                        </Pressable>
                    </Card>
                </View>

                {/* Logout Button */}
                <View style={styles.section}>
                    <Button
                        title="Cerrar Sesión"
                        onPress={handleLogout}
                        variant="outline"
                        size="large"
                        style={styles.logoutButton}
                    />
                </View>

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
            backgroundColor: theme.colors.primary,
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
        section: {
            marginTop: 24,
            paddingHorizontal: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 12,
        },
        card: {
            marginBottom: 12,
            padding: 16,
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        cardSubtitle: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 16,
        },
        themeOptions: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 12,
        },
        themeOption: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: 'center',
        },
        themeOptionActive: {
            backgroundColor: theme.colors.primary,
        },
        themeOptionText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        themeOptionTextActive: {
            color: '#ffffff',
        },
        colorGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 8,
        },
        colorOption: {
            alignItems: 'center',
            width: '30%',
        },
        colorCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        colorCircleActive: {
            borderWidth: 3,
            borderColor: theme.colors.text,
        },
        colorCheck: {
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
        },
        colorName: {
            fontSize: 12,
            color: theme.colors.text,
            textAlign: 'center',
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
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 8,
        },
        aboutRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
        },
        aboutLabel: {
            fontSize: 16,
            color: theme.colors.text,
        },
        aboutValue: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        linkRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
        },
        linkText: {
            fontSize: 16,
            color: theme.colors.text,
        },
        linkArrow: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
        logoutButton: {
            borderColor: theme.colors.error,
        },
        bottomSpacing: {
            height: 40,
        },
    });
