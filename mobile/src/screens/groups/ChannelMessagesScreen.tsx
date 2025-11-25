// ChannelMessagesScreen for group channel messages
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

export const ChannelMessagesScreen = ({ route, navigation }: any) => {
    const { channelId, channelName } = route.params;
    const { theme } = useTheme();
    const [message, setMessage] = useState('');

    const mockMessages = [
        {
            id: '1',
            content: 'Bienvenidos al canal!',
            author: { name: 'Admin' },
            timestamp: '10:00',
        },
        {
            id: '2',
            content: 'Gracias! Feliz de estar aquí',
            author: { name: 'María' },
            timestamp: '10:05',
        },
    ];

    const handleSend = () => {
        if (message.trim()) {
            setMessage('');
        }
    };

    const renderMessage = ({ item, index }: any) => (
        <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.messageContainer}>
            <Avatar name={item.author.name} size={36} />
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <Text style={styles.authorName}>{item.author.name}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{item.content}</Text>
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
                <Text style={styles.channelIcon}>#</Text>
                <Text style={styles.headerTitle}>{channelName}</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            {/* Messages */}
            <FlatList
                data={mockMessages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={`Mensaje en #${channelName}`}
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
            gap: 8,
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
        channelIcon: {
            fontSize: 24,
            fontWeight: 'bold',
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
            marginBottom: 16,
            gap: 12,
        },
        messageContent: {
            flex: 1,
        },
        messageHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        authorName: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        timestamp: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        messageText: {
            fontSize: 15,
            color: theme.colors.text,
            lineHeight: 20,
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
