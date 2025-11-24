import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';

export const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const isIOS = Platform.OS === 'ios';

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={['#667eea', '#764ba2', '#f093fb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerIOS}
                >
                    <Image
                        source={{ uri: user?.photoUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatarLarge}
                    />
                    <Text style={styles.nameIOS}>{user?.name}</Text>
                    <Text style={styles.emailIOS}>{user?.email}</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Image
                        source={{ uri: user?.photoUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatarLarge}
                    />
                    <Text style={styles.nameAndroid}>{user?.name}</Text>
                    <Text style={styles.emailAndroid}>{user?.email}</Text>
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
                    <Text style={styles.menuText}>Amigos</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, isIOS && styles.menuItemIOS]}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#8b5cf6',
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
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statsContainerIOS: {
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8b5cf6',
        marginBottom: 4,
    },
    statNumberIOS: {
        fontSize: 28,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
    },
    menuContainer: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuContainerIOS: {
        borderRadius: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemIOS: {
        padding: 18,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    menuArrow: {
        fontSize: 24,
        color: '#999',
    },
    logoutContainer: {
        padding: 16,
        marginTop: 24,
        marginBottom: 40,
    },
});
