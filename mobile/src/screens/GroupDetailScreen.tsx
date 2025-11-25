import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService, Group, GroupMember } from '../services/groups';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/ui/Button';

export const GroupDetailScreen = ({ route, navigation }: any) => {
    const { groupId } = route.params;
    const { theme } = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isIOS = Platform.OS === 'ios';

    const { data: group, isLoading } = useQuery({
        queryKey: ['group', groupId],
        queryFn: ({ signal }) => groupService.getById(groupId, signal),
    });

    const { data: members } = useQuery({
        queryKey: ['groupMembers', groupId],
        queryFn: ({ signal }) => groupService.getMembers(groupId, signal),
    });

    const joinMutation = useMutation({
        mutationFn: () => groupService.join(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            Alert.alert('¡Éxito!', 'Te has unido al grupo');
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo unir al grupo');
        },
    });

    const leaveMutation = useMutation({
        mutationFn: () => groupService.leave(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            navigation.goBack();
            Alert.alert('Grupo abandonado', 'Has salido del grupo');
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo salir del grupo');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => groupService.delete(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            navigation.goBack();
            Alert.alert('Grupo eliminado', 'El grupo ha sido eliminado');
        },
        onError: () => {
            Alert.alert('Error', 'No se pudo eliminar el grupo');
        },
    });

    const handleJoinLeave = () => {
        if (group?.isMember) {
            Alert.alert(
                'Salir del grupo',
                '¿Estás seguro de que quieres salir de este grupo?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Salir', style: 'destructive', onPress: () => leaveMutation.mutate() },
                ]
            );
        } else {
            joinMutation.mutate();
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar grupo',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate() },
            ]
        );
    };

    const styles = createStyles(theme, isIOS);

    if (isLoading || !group) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    const isCreator = user?.id === group.creatorId;

    return (
        <ScrollView style={styles.container}>
            {/* Header Image */}
            {group.imageUrl ? (
                <Image source={{ uri: group.imageUrl }} style={styles.headerImage} />
            ) : (
                <LinearGradient
                    colors={theme.isDark ? ['#5b21b6', '#6d28d9'] : ['#5b21b6', '#7c3aed']}
                    style={styles.headerGradient}
                >
                    <Text style={styles.headerPlaceholder}>
                        {group.name.charAt(0).toUpperCase()}
                    </Text>
                </LinearGradient>
            )}

            {/* Group Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.groupName}>{group.name}</Text>
                <View style={styles.metaRow}>
                    <View style={[styles.badge, group.isPublic ? styles.badgePublic : styles.badgePrivate]}>
                        <Text style={styles.badgeText}>
                            {group.isPublic ? '🌐 Público' : '🔒 Privado'}
                        </Text>
                    </View>
                    <Text style={styles.memberCount}>
                        👥 {group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}
                    </Text>
                </View>
                <Text style={styles.description}>{group.description}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                {!isCreator && (
                    <Button
                        title={group.isMember ? 'Salir del grupo' : 'Unirse'}
                        onPress={handleJoinLeave}
                        variant={group.isMember ? 'secondary' : 'primary'}
                        disabled={joinMutation.isLoading || leaveMutation.isLoading}
                    />
                )}
                {group.isMember && (
                    <TouchableOpacity
                        style={styles.channelButton}
                        onPress={() => navigation.navigate('GroupChannels', { groupId })}
                    >
                        <Text style={styles.channelButtonText}>💬 Ver Canales</Text>
                    </TouchableOpacity>
                )}
                {isCreator && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>🗑️ Eliminar Grupo</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Members List */}
            {members && members.length > 0 && (
                <View style={styles.membersContainer}>
                    <Text style={styles.sectionTitle}>Miembros</Text>
                    {members.map((member: GroupMember) => (
                        <View key={member.id} style={styles.memberCard}>
                            {member.user.profilePictureUrl ? (
                                <Image
                                    source={{ uri: member.user.profilePictureUrl }}
                                    style={styles.memberAvatar}
                                />
                            ) : (
                                <View style={styles.memberAvatarPlaceholder}>
                                    <Text style={styles.memberAvatarText}>
                                        {member.user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{member.user.name}</Text>
                                <Text style={styles.memberEmail}>{member.user.email}</Text>
                            </View>
                            <View style={[styles.roleBadge, styles[`role${member.role}`]]}>
                                <Text style={styles.roleText}>{member.role}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const createStyles = (theme: any, isIOS: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 100,
        fontSize: 16,
    },
    headerImage: {
        width: '100%',
        height: 250,
        backgroundColor: theme.colors.surfaceVariant,
    },
    headerGradient: {
        width: '100%',
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerPlaceholder: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    infoContainer: {
        padding: 20,
    },
    groupName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgePublic: {
        backgroundColor: theme.isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7',
    },
    badgePrivate: {
        backgroundColor: theme.isDark ? 'rgba(251, 191, 36, 0.2)' : '#fef3c7',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text,
    },
    memberCount: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    description: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    actionsContainer: {
        padding: 20,
        gap: 12,
    },
    channelButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    channelButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    deleteButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    membersContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceVariant,
    },
    memberAvatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberAvatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    memberInfo: {
        flex: 1,
        marginLeft: 12,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    memberEmail: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roleADMIN: {
        backgroundColor: theme.isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe',
    },
    roleMODERATOR: {
        backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
    },
    roleMEMBER: {
        backgroundColor: theme.isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6',
    },
    roleText: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text,
    },
});
