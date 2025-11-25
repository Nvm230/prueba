// ChatMessagesScreen for direct messages
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from '../../components/ui/Avatar';
import Animated, { FadeInRight } from 'react-native-reanimated';

export const ChatMessagesScreen = ({ route, navigation }: any) => {
    const { chatId, userName } = route.params;
    const { theme } = useTheme();
    const [message, setMessage] = useState('');

    const mockMessages = [
        { id: '1', content: 'Hola! ¿Cómo estás?', isMine: false, timestamp: '10:30' },
        { id: '2', content: 'Muy bien, gracias! ¿Y tú?', isMine: true, timestamp: '10:31' },
        { id: '3', content: 'Todo bien! ¿Nos vemos en el evento?', isMine: false, timestamp: '10:32' },
        { id: '4', content: 'Claro! Nos vemos allá', isMine: true, timestamp: '10:33' },
    ];

    const handleSend = () => {
        if (message.trim()) {
            setMessage('');
        }
    };

    const renderMessage = ({ item, index }: any) => (
        <Animated.View
            entering={FadeInRight.delay(index * 50)}
            style={[styles.messageContainer, item.isMine && styles.myMessageContainer]}
        >
            {!item.isMine && <Avatar name={userName} size={32} style={styles.avatar} />}
            <View style={[styles.messageBubble, item.isMine && styles.myMessageBubble]}>
                <Text style={[styles.messageText, item.isMine && styles.myMessageText]}>
                    {item.content}
                </Text>
                <Text style={[styles.messageTime, item.isMine && styles.myMessageTime]}>
                    {item.timestamp}
                </Text>
            </View>
        </Animated.View>
    );

    const styles = createStyles(theme);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
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
                <Avatar name={userName} size={36} />
                <Text style={styles.headerTitle}>{userName}</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            {/* Messages */}
            <FlatList
                data={mockMessages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                inverted={false}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor={theme.colors.textTertiary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                <Pressable
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!message.trim()}
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
            paddingBottom: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        backButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backIcon: {
            fontSize: 24,
            color: '#ffffff',
        },
        headerTitle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: '#ffffff',
        },
        placeholder: {
            width: 32,
        },
        messagesList: {
            padding: 16,
        },
        messageContainer: {
            flexDirection: 'row',
            marginBottom: 12,
            gap: 8,
        },
        myMessageContainer: {
            justifyContent: 'flex-end',
        },
        avatar: {
            marginTop: 4,
        },
        messageBubble: {
            maxWidth: '70%',
            padding: 12,
            borderRadius: 16,
            backgroundColor: theme.colors.surfaceVariant,
        },
        myMessageBubble: {
            backgroundColor: theme.colors.primary,
        },
        messageText: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 20,
        },
        myMessageText: {
            color: '#ffffff',
        },
        messageTime: {
            fontSize: 11,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        myMessageTime: {
            color: 'rgba(255, 255, 255, 0.7)',
        },
        inputContainer: {
            flexDirection: 'row',
            padding: 12,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.card,
        },
        input: {
            flex: 1,
            maxHeight: 100,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
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
