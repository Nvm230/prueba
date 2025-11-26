// Simplified Button Component - Minimalist Design
import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const styles = createStyles(theme, size, variant, disabled);
    const isDisabled = disabled || loading;

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            style={[styles.button, animatedStyle, style]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : theme.colors.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={styles.text}>{title}</Text>
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

    const variantStyles = {
        primary: {
            backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.primary,
            borderWidth: 0,
            textColor: '#ffffff',
        },
        secondary: {
            backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            textColor: disabled ? theme.colors.textTertiary : theme.colors.text,
        },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: disabled ? theme.colors.border : theme.colors.primary,
            textColor: disabled ? theme.colors.textTertiary : theme.colors.primary,
        },
        ghost: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            textColor: disabled ? theme.colors.textTertiary : theme.colors.primary,
        },
    };

    const currentVariant = variantStyles[variant as keyof typeof variantStyles];

    return StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: 12,
            backgroundColor: currentVariant.backgroundColor,
            borderWidth: currentVariant.borderWidth,
            borderColor: currentVariant.borderColor,
        },
        text: {
            color: currentVariant.textColor,
            fontSize: currentSize.fontSize,
            fontWeight: '600',
        },
    });
};
