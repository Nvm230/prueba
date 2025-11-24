import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, Message } from '../services/chat';
import { useAuth } from '../contexts/AuthContext';

export const ChatDetailScreen = ({ route, navigation }: any) => {
    const { userId, userName } = route.params;
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const queryClient = useQueryClient();

    const { data: messages } = useQuery({
        queryKey: ['messages', userId],
        queryFn: () => chatService.getMessages(userId),
        refetchInterval: 3000, // Poll every 3 seconds
    });

    const sendMutation = useMutation({
        mutationFn: (content: string) => chatService.sendMessage(userId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', userId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setMessage('');
        },
    });

    const handleSend = () => {
        if (message.trim()) {
            sendMutation.mutate(message.trim());
        }
    };

    useEffect(() => {
        navigation.setOptions({ title: userName });
    }, [userName]);

    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.senderId === user?.id;
        const isIOS = Platform.OS === 'ios';

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myMessage : styles.theirMessage,
                        isIOS && (isMyMessage ? styles.myMessageIOS : styles.theirMessageIOS),
                    ]}
                >
                    <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.messageTime, isMyMessage && styles.myMessageTime]}>
                        {new Date(item.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                inverted={false}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        Platform.OS === 'ios' && styles.sendButtonIOS,
                        !message.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!message.trim() || sendMutation.isPending}
                >
                    <Text style={styles.sendButtonText}>
                        {sendMutation.isPending ? '...' : '📤'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
    },
    myMessageContainer: {
        alignItems: 'flex-end',
    },
    theirMessageContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        backgroundColor: '#8b5cf6',
        borderBottomRightRadius: 4,
    },
    myMessageIOS: {
        borderRadius: 20,
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
    },
    theirMessageIOS: {
        borderRadius: 20,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    myMessageText: {
        color: '#ffffff',
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
    },
    myMessageTime: {
        color: '#ffffffcc',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 15,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonIOS: {
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        fontSize: 20,
    },
});
