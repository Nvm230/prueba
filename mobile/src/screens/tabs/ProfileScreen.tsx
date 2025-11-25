import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
    Switch,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';

export const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const handleLogout = async () => {
        await logout();
    };

    const styles = createStyles(theme, isIOS);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerIOS}
                >
                    <Image
                        source={{ uri: user?.profilePictureUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatarLarge}
                    />
                    <Text style={styles.nameIOS}>{user?.name}</Text>
                    <Text style={styles.emailIOS}>{user?.email}</Text>
                    {user?.points !== undefined && (
                        <View style={styles.pointsBadge}>
                            <Text style={styles.pointsText}>⭐ {user.points} puntos</Text>
                        </View>
                    )}
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Image
                        source={{ uri: user?.profilePictureUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatarLarge}
                    />
                    <Text style={styles.nameAndroid}>{user?.name}</Text>
                    <Text style={styles.emailAndroid}>{user?.email}</Text>
                    {user?.points !== undefined && (
                        <View style={styles.pointsBadge}>
                            <Text style={styles.pointsText}>⭐ {user.points} puntos</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Stats */}
            <View style={[styles.statsContainer, isIOS && styles.statsContainerIOS]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, isIOS && styles.statNumberIOS]}>12</Text>
                    <Text style={styles.statLabel}>Eventos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, isIOS && styles.statNumberIOS]}>45</Text>
                    <Text style={styles.statLabel}>Amigos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, isIOS && styles.statNumberIOS]}>28</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
            </View>

            {/* Menu Options */}
            <View style={[styles.menuContainer, isIOS && styles.menuContainerIOS]}>
                {/* Dark Mode Toggle */}
                <View style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
                    <Text style={styles.menuIcon}>{theme.isDark ? '🌙' : '☀️'}</Text>
                    <Text style={styles.menuText}>Modo Oscuro</Text>
                    <Switch
                        value={theme.isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#cbd5e1', true: theme.colors.primary }}
                        thumbColor={theme.isDark ? '#f8fafc' : '#ffffff'}
                    />
                </View>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
                    <Text style={styles.menuIcon}>👤</Text>
                    <Text style={styles.menuText}>Editar Perfil</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
                    <Text style={styles.menuIcon}>📅</Text>
                    <Text style={styles.menuText}>Mis Eventos</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
                    <Text style={styles.menuIcon}>👥</Text>
                    <Text style={styles.menuText}>Mis Grupos</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
                    <Text style={styles.menuIcon}>👥</Text>
                    <Text style={styles.menuText}>Amigos</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS, styles.menuItemLast]}>
                    <Text style={styles.menuIcon}>⚙️</Text>
                    <Text style={styles.menuText}>Configuración</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerIOS: {
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerAndroid: {
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#ffffff',
        marginBottom: 16,
    },
    nameIOS: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    emailIOS: {
        fontSize: 16,
        color: '#ffffffcc',
    },
    nameAndroid: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    emailAndroid: {
        fontSize: 14,
        color: '#ffffffdd',
    },
    pointsBadge: {
        marginTop: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    pointsText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    statsContainerIOS: {
        borderRadius: 20,
        shadowOpacity: theme.isDark ? 0.4 : 0.15,
        shadowRadius: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    statNumberIOS: {
        fontSize: 28,
    },
    statLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
    },
    menuContainer: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    menuContainerIOS: {
        borderRadius: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuItemIOS: {
        padding: 18,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
    },
    menuArrow: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    logoutContainer: {
        padding: 16,
        marginTop: 24,
        marginBottom: 40,
    },
});
