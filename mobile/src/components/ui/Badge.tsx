// Premium Badge Component with Enhanced Pulse
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
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
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        if (pulse) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 800, easing: Easing.ease }),
                    withTiming(1, { duration: 800, easing: Easing.ease })
                ),
                -1
            );
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1
            );
        }
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const styles = createStyles(theme, variant);

    if (count === 0) return null;

    return (
        <Animated.View style={[styles.container, pulse && animatedStyle, style]}>
            <View style={styles.badge}>
                <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
            </View>
            {pulse && <View style={styles.pulseRing} />}
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
        container: {
            position: 'relative',
        },
        badge: {
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: bgColor,
            paddingHorizontal: 6,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: bgColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 4,
        },
        text: {
            color: '#ffffff',
            fontSize: 11,
            fontWeight: '700',
        },
        pulseRing: {
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: bgColor,
            opacity: 0.3,
        },
    });
};
