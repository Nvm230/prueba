// Premium Card Component with Liquid Crystal Glassmorphism
import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'gradient' | 'premium';
    elevated?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    elevated = false,
    onPress,
    style,
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glow.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15 });
        glow.value = withTiming(1, { duration: 200 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
        glow.value = withTiming(0, { duration: 300 });
    };

    const styles = createStyles(theme, elevated);

    // Premium Liquid Crystal Card
    if (variant === 'premium') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!onPress}
                style={[animatedStyle, style]}
            >
                <View style={styles.premiumContainer}>
                    {/* Glow Effect */}
                    <Animated.View style={[styles.glowLayer, glowStyle]}>
                        <LinearGradient
                            colors={[
                                `${theme.colors.primary}40`,
                                `${theme.colors.primaryLight}30`,
                                `${theme.colors.primary}40`,
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                    </Animated.View>

                    {/* Gradient Border */}
                    <LinearGradient
                        colors={[
                            `${theme.colors.primary}60`,
                            `${theme.colors.primaryLight}40`,
                            `${theme.colors.primary}60`,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBorder}
                    >
                        {/* Glass Content */}
                        <BlurView intensity={25} tint={theme.isDark ? 'dark' : 'light'} style={styles.blurContainer}>
                            <View style={styles.premiumContent}>{children}</View>
                        </BlurView>
                    </LinearGradient>
                </View>
            </AnimatedPressable>
        );
    }

    // Advanced Glass Card
    if (variant === 'glass') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!onPress}
                style={[animatedStyle, style]}
            >
                <View style={styles.glassContainer}>
                    <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={styles.blurContainer}>
                        <View style={styles.glassContent}>{children}</View>
                    </BlurView>
                </View>
            </AnimatedPressable>
        );
    }

    // Gradient Card
    if (variant === 'gradient') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!onPress}
                style={[animatedStyle, style]}
            >
                <LinearGradient
                    colors={theme.colors.primaryGradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientCard, style]}
                >
                    {children}
                </LinearGradient>
            </AnimatedPressable>
        );
    }

    // Default Card
    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            style={[styles.defaultCard, animatedStyle, style]}
        >
            {children}
        </AnimatedPressable>
    );
};

const createStyles = (theme: any, elevated: boolean) =>
    StyleSheet.create({
        // Premium Liquid Crystal
        premiumContainer: {
            position: 'relative',
            borderRadius: 20,
        },
        glowLayer: {
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 24,
            opacity: 0,
        },
        gradientBorder: {
            padding: 1.5,
            borderRadius: 20,
        },
        premiumContent: {
            backgroundColor: theme.isDark
                ? 'rgba(15, 23, 42, 0.6)'
                : 'rgba(255, 255, 255, 0.6)',
            borderRadius: 19,
            overflow: 'hidden',
        },

        // Advanced Glass
        glassContainer: {
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: theme.isDark ? 0.4 : 0.1,
            shadowRadius: 16,
            elevation: 8,
        },
        blurContainer: {
            overflow: 'hidden',
            borderRadius: 16,
        },
        glassContent: {
            backgroundColor: theme.isDark
                ? 'rgba(30, 41, 59, 0.4)'
                : 'rgba(255, 255, 255, 0.7)',
            borderRadius: 16,
        },

        // Gradient Card
        gradientCard: {
            borderRadius: 16,
            padding: 16,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },

        // Default Card
        defaultCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: elevated ? 4 : 2,
        },
    });
