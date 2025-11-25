import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { groupService, Group } from '../../services/groups';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export const GroupsScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const isIOS = Platform.OS === 'ios';

    const { data: groups, isLoading, refetch } = useQuery({
        queryKey: ['groups'],
        queryFn: ({ signal }) => groupService.getAll(signal),
    });

    const styles = createStyles(theme, isIOS);

    const renderGroupCard = ({ item }: { item: Group }) => (
        <TouchableOpacity
            style={styles.groupCard}
            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
        >
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.groupImage} />
            ) : (
                <View style={styles.groupImagePlaceholder}>
                    <Text style={styles.groupImagePlaceholderText}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}
            <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.groupMeta}>
                    <Text style={styles.groupMembers}>
                        👥 {item.memberCount} {item.memberCount === 1 ? 'miembro' : 'miembros'}
                    </Text>
                    <View style={[styles.badge, item.isPublic ? styles.badgePublic : styles.badgePrivate]}>
                        <Text style={styles.badgeText}>
                            {item.isPublic ? '🌐 Público' : '🔒 Privado'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            {isIOS ? (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerIOS}
                >
                    <Text style={styles.headerTitle}>Grupos</Text>
                    <Text style={styles.headerSubtitle}>Únete a comunidades</Text>
                </LinearGradient>
            ) : (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>Grupos</Text>
                    <Text style={styles.headerSubtitleAndroid}>Únete a comunidades</Text>
                </View>
            )}

            {/* Create Button */}
            <View style={styles.createButtonContainer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreateGroup')}
                >
                    <Text style={styles.createButtonText}>+ Crear Grupo</Text>
                </TouchableOpacity>
            </View>

            {/* Groups List */}
            <FlatList
                data={groups || []}
                renderItem={renderGroupCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={refetch}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>👥</Text>
                        <Text style={styles.emptyText}>No hay grupos disponibles</Text>
                        <Text style={styles.emptySubtext}>Crea el primero o espera a que otros lo hagan</Text>
                    </View>
                }
            />
        </View>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerIOS: {
        paddingTop: 80,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 36,
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
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
    },
    headerTitleAndroid: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitleAndroid: {
        fontSize: 14,
        color: '#ffffffdd',
    },
    createButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    groupCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    groupImage: {
        width: 100,
        height: 100,
        backgroundColor: theme.colors.surfaceVariant,
    },
    groupImagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupImagePlaceholderText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    groupInfo: {
        flex: 1,
        padding: 12,
    },
    groupName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    groupDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
    },
    groupMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    groupMembers: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgePublic: {
        backgroundColor: theme.isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7',
    },
    badgePrivate: {
        backgroundColor: theme.isDark ? 'rgba(251, 191, 36, 0.2)' : '#fef3c7',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
