// Premium Button Component with Animated Gradients & Glow
import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    style,
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);
    const gradientPosition = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glow.value,
        transform: [{ scale: 1 + glow.value * 0.1 }],
    }));

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: gradientPosition.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15 });
        glow.value = withTiming(1, { duration: 150 });
        if (variant === 'gradient' || variant === 'primary') {
            gradientPosition.value = withSequence(
                withTiming(10, { duration: 150 }),
                withTiming(0, { duration: 150 })
            );
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
        glow.value = withTiming(0, { duration: 200 });
    };

    const styles = createStyles(theme, size, variant, disabled);
    const isDisabled = disabled || loading;

    // Gradient Button (Premium)
    if (variant === 'gradient' || variant === 'primary') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                style={[styles.container, animatedStyle, style]}
            >
                {/* Glow Effect */}
                <Animated.View style={[styles.glowContainer, glowStyle]}>
                    <LinearGradient
                        colors={[
                            `${theme.colors.primary}60`,
                            `${theme.colors.primaryLight}40`,
                            `${theme.colors.primary}60`,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                </Animated.View>

                {/* Gradient Background */}
                <AnimatedLinearGradient
                    colors={
                        isDisabled
                            ? ['#64748b', '#475569', '#64748b']
                            : (theme.colors.primaryGradient as any)
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientButton, gradientStyle]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            {icon}
                            <Text style={styles.gradientText}>{title}</Text>
                        </>
                    )}
                </AnimatedLinearGradient>
            </AnimatedPressable>
        );
    }

    // Outline Button
    if (variant === 'outline') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                style={[styles.container, styles.outlineButton, animatedStyle, style]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} />
                ) : (
                    <>
                        {icon}
                        <Text style={styles.outlineText}>{title}</Text>
                    </>
                )}
            </AnimatedPressable>
        );
    }

    // Ghost Button
    if (variant === 'ghost') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                style={[styles.container, styles.ghostButton, animatedStyle, style]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} />
                ) : (
                    <>
                        {icon}
                        <Text style={styles.ghostText}>{title}</Text>
                    </>
                )}
            </AnimatedPressable>
        );
    }

    // Secondary Button
    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            style={[styles.container, styles.secondaryButton, animatedStyle, style]}
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.text} />
            ) : (
                <>
                    {icon}
                    <Text style={styles.secondaryText}>{title}</Text>
                </>
            )}
        </AnimatedPressable>
    );
};

const createStyles = (theme: any, size: string, variant: string, disabled: boolean) => {
    const sizeStyles = {
        small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
        medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
        large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 },
    };

    const currentSize = sizeStyles[size as keyof typeof sizeStyles];

    return StyleSheet.create({
        container: {
            position: 'relative',
            borderRadius: 12,
            overflow: 'visible',
        },
        glowContainer: {
            position: 'absolute',
            top: -6,
            left: -6,
            right: -6,
            bottom: -6,
            borderRadius: 16,
            opacity: 0,
        },
        gradientButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: 12,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
        gradientText: {
            color: '#ffffff',
            fontSize: currentSize.fontSize,
            fontWeight: '600',
        },
        outlineButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: disabled ? theme.colors.border : theme.colors.primary,
            backgroundColor: 'transparent',
        },
        outlineText: {
            color: disabled ? theme.colors.textTertiary : theme.colors.primary,
            fontSize: currentSize.fontSize,
            fontWeight: '600',
        },
        ghostButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: 12,
            backgroundColor: 'transparent',
        },
        ghostText: {
            color: disabled ? theme.colors.textTertiary : theme.colors.primary,
            fontSize: currentSize.fontSize,
            fontWeight: '600',
        },
        secondaryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: 12,
            backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        secondaryText: {
            color: disabled ? theme.colors.textTertiary : theme.colors.text,
            fontSize: currentSize.fontSize,
            fontWeight: '600',
        },
    });
};
