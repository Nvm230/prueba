// PostDetailScreen with comments
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const PostDetailScreen = ({ route, navigation }: any) => {
    const { postId } = route.params;
    const { theme } = useTheme();
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);

    const mockPost = {
        id: postId,
        content: 'Este es un post de ejemplo con contenido interesante',
        imageUrl: null,
        author: { name: 'María García', profilePictureUrl: null },
        createdAt: 'Hace 2 horas',
        likes: 42,
        comments: 8,
    };

    const mockComments = [
        {
            id: '1',
            content: '¡Excelente post!',
            author: { name: 'Juan Pérez' },
            createdAt: 'Hace 1 hora',
        },
        {
            id: '2',
            content: 'Muy interesante, gracias por compartir',
            author: { name: 'Ana López' },
            createdAt: 'Hace 30 min',
        },
    ];

    const handleComment = () => {
        if (comment.trim()) {
            setComment('');
        }
    };

    const styles = createStyles(theme);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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
                <Text style={styles.headerTitle}>Post</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView style={styles.scrollView}>
                {/* Post */}
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Card variant="default" style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <Avatar name={mockPost.author.name} size={48} />
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{mockPost.author.name}</Text>
                                <Text style={styles.timestamp}>{mockPost.createdAt}</Text>
                            </View>
                        </View>

                        <Text style={styles.content}>{mockPost.content}</Text>

                        {mockPost.imageUrl && (
                            <Image source={{ uri: mockPost.imageUrl }} style={styles.image} />
                        )}

                        <View style={styles.stats}>
                            <Text style={styles.stat}>❤️ {mockPost.likes} likes</Text>
                            <Text style={styles.stat}>💬 {mockPost.comments} comentarios</Text>
                        </View>

                        <View style={styles.actions}>
                            <Pressable
                                style={styles.actionButton}
                                onPress={() => setLiked(!liked)}
                            >
                                <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
                                <Text style={styles.actionText}>Like</Text>
                            </Pressable>
                            <Pressable style={styles.actionButton}>
                                <Text style={styles.actionIcon}>💬</Text>
                                <Text style={styles.actionText}>Comentar</Text>
                            </Pressable>
                            <Pressable style={styles.actionButton}>
                                <Text style={styles.actionIcon}>↗️</Text>
                                <Text style={styles.actionText}>Compartir</Text>
                            </Pressable>
                        </View>
                    </Card>
                </Animated.View>

                {/* Comments */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comentarios</Text>
                    {mockComments.map((c, index) => (
                        <Animated.View key={c.id} entering={FadeInDown.delay(200 + index * 50)}>
                            <Card variant="default" style={styles.commentCard}>
                                <View style={styles.commentHeader}>
                                    <Avatar name={c.author.name} size={32} />
                                    <View style={styles.commentInfo}>
                                        <Text style={styles.commentAuthor}>{c.author.name}</Text>
                                        <Text style={styles.commentTime}>{c.createdAt}</Text>
                                    </View>
                                </View>
                                <Text style={styles.commentContent}>{c.content}</Text>
                            </Card>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Escribe un comentario..."
                    placeholderTextColor={theme.colors.textTertiary}
                    value={comment}
                    onChangeText={setComment}
                />
                <Pressable
                    style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
                    onPress={handleComment}
                    disabled={!comment.trim()}
                >
                    <Text style={styles.sendIcon}>➤</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
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
        postCard: {
            margin: 20,
            padding: 16,
        },
        postHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
        },
        authorInfo: {
            flex: 1,
        },
        authorName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        timestamp: {
            fontSize: 13,
            color: theme.colors.textSecondary,
        },
        content: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 22,
            marginBottom: 12,
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
        },
        stats: {
            flexDirection: 'row',
            gap: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.border,
        },
        stat: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        actions: {
            flexDirection: 'row',
            paddingTop: 12,
        },
        actionButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
        },
        actionIcon: {
            fontSize: 20,
        },
        actionText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        commentsSection: {
            padding: 20,
        },
        commentsTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 16,
        },
        commentCard: {
            marginBottom: 12,
            padding: 12,
        },
        commentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
        },
        commentInfo: {
            flex: 1,
        },
        commentAuthor: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        commentTime: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        commentContent: {
            fontSize: 14,
            color: theme.colors.text,
            lineHeight: 20,
        },
        commentInputContainer: {
            flexDirection: 'row',
            padding: 12,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.card,
        },
        commentInput: {
            flex: 1,
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.text,
        },
        sendButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        sendButtonDisabled: {
            opacity: 0.5,
        },
        sendIcon: {
            fontSize: 18,
            color: '#ffffff',
        },
    });
