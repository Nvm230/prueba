// Simplified Avatar Component
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarProps {
    uri?: string;
    name: string;
    size?: number;
    showRing?: boolean;
    online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    name,
    size = 40,
    showRing = false,
    online = false,
}) => {
    const { theme } = useTheme();

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const styles = createStyles(theme, size, showRing);

    return (
        <View style={styles.container}>
            {uri ? (
                <Image source={{ uri }} style={styles.image} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.initials}>{initials}</Text>
                </View>
            )}
            {online && <View style={styles.onlineIndicator} />}
        </View>
    );
};

const createStyles = (theme: any, size: number, showRing: boolean) =>
    StyleSheet.create({
        container: {
            width: size + (showRing ? 8 : 0),
            height: size + (showRing ? 8 : 0),
            borderRadius: (size + (showRing ? 8 : 0)) / 2,
            overflow: 'visible',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: showRing ? 2 : 0,
            borderColor: theme.colors.primary,
        },
        image: {
            width: size,
            height: size,
            borderRadius: size / 2,
        },
        placeholder: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        initials: {
            color: '#ffffff',
            fontSize: size * 0.4,
            fontWeight: '600',
        },
        onlineIndicator: {
            position: 'absolute',
            bottom: showRing ? 4 : 0,
            right: showRing ? 4 : 0,
            width: size * 0.25,
            height: size * 0.25,
            borderRadius: size * 0.125,
            backgroundColor: '#10b981',
            borderWidth: 2,
            borderColor: theme.colors.background,
        },
    });
