// Simplified Badge Component
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
    count?: number;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    pulse?: boolean;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    count = 0,
    variant = 'primary',
    pulse = false,
    style,
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    React.useEffect(() => {
        if (pulse) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 600 }),
                    withTiming(1, { duration: 600 })
                ),
                -1
            );
        }
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const styles = createStyles(theme, variant);

    if (count === 0) return null;

    return (
        <Animated.View style={[styles.badge, pulse && animatedStyle, style]}>
            <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
        </Animated.View>
    );
};

const createStyles = (theme: any, variant: string) => {
    const colors = {
        primary: theme.colors.primary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        info: theme.colors.info,
    };

    const bgColor = colors[variant as keyof typeof colors];

    return StyleSheet.create({
        badge: {
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: bgColor,
            paddingHorizontal: 6,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: '#ffffff',
            fontSize: 11,
            fontWeight: '700',
        },
    });
};
