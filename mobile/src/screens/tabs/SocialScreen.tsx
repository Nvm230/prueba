import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { socialService, Post } from '../../services/social';
import { LinearGradient } from 'expo-linear-gradient';
import { MusicPlayer } from '../../components/features/MusicPlayer';

export const SocialScreen = () => {
    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: socialService.getPosts,
    });

    const isIOS = Platform.OS === 'ios';

    const renderPost = ({ item }: { item: Post }) => (
        <View style={[styles.postCard, isIOS && styles.postCardIOS]}>
            {/* User Header */}
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: item.user.photoUrl || 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <Text style={styles.postTime}>
                        {new Date(item.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                        })}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <Text style={styles.postContent}>{item.content}</Text>

            {/* Media */}
            {item.mediaUrl && (
                <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />
            )}

            {/* Music */}
            {item.musicUrl && (
                <MusicPlayer musicUrl={item.musicUrl} />
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionText}>{item.likedBy?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text>Cargando publicaciones...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isIOS && (
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>👥 Social</Text>
                </LinearGradient>
            )}

            {!isIOS && (
                <View style={styles.headerAndroid}>
                    <Text style={styles.headerTitleAndroid}>👥 Social</Text>
                </View>
            )}

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerAndroid: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#8b5cf6',
    },
    headerTitleAndroid: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listContent: {
        padding: 16,
    },
    postCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    postCardIOS: {
        borderRadius: 20,
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    postTime: {
        fontSize: 12,
        color: '#999',
    },
    postContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    musicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    musicCardIOS: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderRadius: 12,
    },
    musicIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    musicText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionIcon: {
        fontSize: 18,
    },
    actionText: {
        fontSize: 14,
        color: '#666',
    },
});
