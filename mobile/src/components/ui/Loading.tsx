// Premium Loading Component with Animated Spinner
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'spinner' | 'gradient' | 'pulse';
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Loading: React.FC<LoadingProps> = ({
    message,
    size = 'medium',
    variant = 'spinner',
}) => {
    const { theme } = useTheme();
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1
        );

        if (variant === 'pulse') {
            scale.value = withRepeat(
                withTiming(1.2, {
                    duration: 800,
                    easing: Easing.ease,
                }),
                -1,
                true
            );
        }
    }, [variant]);

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const sizes = {
        small: 24,
        medium: 40,
        large: 60,
    };

    const spinnerSize = sizes[size];
    const styles = createStyles(theme, spinnerSize);

    // Gradient Spinner
    if (variant === 'gradient') {
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.gradientContainer, rotationStyle]}>
                    <LinearGradient
                        colors={theme.colors.primaryGradient as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientSpinner}
                    >
                        <View style={styles.gradientInner} />
                    </LinearGradient>
                </Animated.View>
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    // Pulse Spinner
    if (variant === 'pulse') {
        return (
            <View style={styles.container}>
                <Animated.View style={pulseStyle}>
                    <LinearGradient
                        colors={theme.colors.primaryGradient as any}
                        style={styles.pulse}
                    >
                        <Text style={styles.pulseIcon}>⚡</Text>
                    </LinearGradient>
                </Animated.View>
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    // Default Spinner
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={theme.colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const createStyles = (theme: any, size: number) =>
    StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        gradientContainer: {
            width: size,
            height: size,
        },
        gradientSpinner: {
            width: size,
            height: size,
            borderRadius: size / 2,
            padding: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gradientInner: {
            width: size - 6,
            height: size - 6,
            borderRadius: (size - 6) / 2,
            backgroundColor: theme.colors.background,
        },
        pulse: {
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pulseIcon: {
            fontSize: size * 0.5,
        },
        message: {
            marginTop: 12,
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
    });
