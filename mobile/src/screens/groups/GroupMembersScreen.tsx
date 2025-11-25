// GroupMembersScreen for member management
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    RefreshControl,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import Animated, { FadeInRight } from 'react-native-reanimated';

type MemberRole = 'admin' | 'moderator' | 'member';

interface Member {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    role: MemberRole;
    joinedAt: string;
}

export const GroupMembersScreen = ({ route, navigation }: any) => {
    const { groupId, isAdmin } = route.params;
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'admin' | 'moderator' | 'member'>('all');

    const mockMembers: Member[] = [
        {
            id: '1',
            name: 'Admin Principal',
            email: 'admin@example.com',
            role: 'admin',
            joinedAt: 'Hace 6 meses',
        },
        {
            id: '2',
            name: 'María García',
            email: 'maria@example.com',
            role: 'moderator',
            joinedAt: 'Hace 3 meses',
        },
        {
            id: '3',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'member',
            joinedAt: 'Hace 1 mes',
        },
        {
            id: '4',
            name: 'Ana López',
            email: 'ana@example.com',
            role: 'member',
            joinedAt: 'Hace 2 semanas',
        },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getFilteredMembers = () => {
        if (filter === 'all') return mockMembers;
        return mockMembers.filter((m) => m.role === filter);
    };

    const getRoleBadgeVariant = (role: MemberRole) => {
        switch (role) {
            case 'admin':
                return 'error';
            case 'moderator':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role: MemberRole) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'moderator':
                return 'Mod';
            default:
                return 'Miembro';
        }
    };

    const handleMemberAction = (member: Member) => {
        if (!isAdmin) return;

        Alert.alert(
            member.name,
            'Selecciona una acción',
            [
                {
                    text: 'Ver Perfil',
                    onPress: () => navigation.navigate('Profile', { userId: member.id }),
                },
                {
                    text: member.role === 'moderator' ? 'Quitar Moderador' : 'Hacer Moderador',
                    onPress: () => {
                        Alert.alert('Éxito', `Rol actualizado para ${member.name}`);
                    },
                },
                {
                    text: 'Expulsar',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Confirmación', `¿Expulsar a ${member.name}?`, [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                                text: 'Expulsar',
                                style: 'destructive',
                                onPress: () => Alert.alert('Éxito', `${member.name} ha sido expulsado`),
                            },
                        ]);
                    },
                },
                { text: 'Cancelar', style: 'cancel' },
            ]
        );
    };

    const renderMember = ({ item, index }: { item: Member; index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 50)}>
            <Pressable onPress={() => handleMemberAction(item)}>
                <Card variant="default" style={styles.memberCard}>
                    <View style={styles.memberContent}>
                        <Avatar uri={item.profilePictureUrl} name={item.name} size={48} />
                        <View style={styles.memberInfo}>
                            <View style={styles.memberNameRow}>
                                <Text style={styles.memberName}>{item.name}</Text>
                                <Badge
                                    count={getRoleLabel(item.role)}
                                    variant={getRoleBadgeVariant(item.role)}
                                />
                            </View>
                            <Text style={styles.memberEmail}>{item.email}</Text>
                            <Text style={styles.memberJoined}>Se unió {item.joinedAt}</Text>
                        </View>
                        {isAdmin && item.role !== 'admin' && (
                            <Text style={styles.chevron}>⋮</Text>
                        )}
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );

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
                <Text style={styles.headerTitle}>Miembros ({mockMembers.length})</Text>
                <Pressable style={styles.searchButton}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </Pressable>
            </LinearGradient>

            {/* Filters */}
            <View style={styles.filters}>
                {(['all', 'admin', 'moderator', 'member'] as const).map((f) => (
                    <Pressable
                        key={f}
                        style={[styles.filter, filter === f && styles.filterActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all' ? 'Todos' :
                                f === 'admin' ? 'Admins' :
                                    f === 'moderator' ? 'Mods' : 'Miembros'}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Members List */}
            <FlatList
                data={getFilteredMembers()}
                renderItem={renderMember}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>👥</Text>
                        <Text style={styles.emptyText}>No hay miembros en esta categoría</Text>
                    </View>
                }
            />
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
        searchButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchIcon: {
            fontSize: 24,
        },
        filters: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        filter: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
        },
        filterActive: {
            backgroundColor: theme.colors.primary,
        },
        filterText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        filterTextActive: {
            color: '#ffffff',
        },
        list: {
            padding: 20,
        },
        memberCard: {
            marginBottom: 12,
            padding: 12,
        },
        memberContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        memberInfo: {
            flex: 1,
        },
        memberNameRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        memberName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        memberEmail: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 2,
        },
        memberJoined: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        chevron: {
            fontSize: 20,
            color: theme.colors.textSecondary,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 80,
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: 16,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
    });
