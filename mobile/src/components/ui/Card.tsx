// Simplified Card Component - Minimalist Design
import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated';
    onPress?: () => void;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    onPress,
    style,
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const styles = createStyles(theme, variant);

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            style={[styles.card, animatedStyle, style]}
        >
            {children}
        </AnimatedPressable>
    );
};

const createStyles = (theme: any, variant: 'default' | 'elevated') =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            // Removed elevation to avoid black shadows
        },
    });
