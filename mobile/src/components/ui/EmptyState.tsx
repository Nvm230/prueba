// Premium EmptyState Component with Animations
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'search' | 'error' | 'success';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '📭',
    title,
    description,
    actionLabel,
    onAction,
    variant = 'default',
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    React.useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1
        );
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const styles = createStyles(theme);

    const getIcon = () => {
        if (variant === 'search') return '🔍';
        if (variant === 'error') return '⚠️';
        if (variant === 'success') return '✅';
        return icon;
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.container}
        >
            <LinearGradient
                colors={[
                    theme.colors.background,
                    theme.colors.surfaceVariant,
                    theme.colors.background,
                ]}
                style={styles.gradient}
            >
                <Animated.Text style={[styles.icon, animatedIconStyle]}>
                    {getIcon()}
                </Animated.Text>

                <Text style={styles.title}>{title}</Text>

                {description && (
                    <Text style={styles.description}>{description}</Text>
                )}

                {actionLabel && onAction && (
                    <Button
                        title={actionLabel}
                        onPress={onAction}
                        variant="primary"
                        size="medium"
                        style={styles.button}
                    />
                )}
            </LinearGradient>
        </Animated.View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
        },
        gradient: {
            alignItems: 'center',
            padding: 32,
            borderRadius: 24,
        },
        icon: {
            fontSize: 80,
            marginBottom: 24,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 12,
        },
        description: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 24,
            maxWidth: 300,
        },
        button: {
            marginTop: 8,
        },
    });
