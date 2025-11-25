// Premium Skeleton Component with Shimmer Effect
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    variant?: 'text' | 'circular' | 'rectangular';
    style?: ViewStyle;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    variant = 'rectangular',
    style,
}) => {
    const { theme } = useTheme();
    const translateX = useSharedValue(-200);

    React.useEffect(() => {
        translateX.value = withRepeat(
            withTiming(200, {
                duration: 1500,
                easing: Easing.ease,
            }),
            -1
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const getSize = () => {
        if (variant === 'circular') {
            return {
                width: height,
                height: height,
                borderRadius: height / 2,
            };
        }
        if (variant === 'text') {
            return {
                width,
                height: height * 0.6,
                borderRadius: 4,
            };
        }
        return {
            width,
            height,
            borderRadius,
        };
    };

    const styles = createStyles(theme);
    const size = getSize();

    return (
        <View style={[styles.container, size, style]}>
            <AnimatedLinearGradient
                colors={
                    theme.isDark
                        ? ['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.9)', 'rgba(30, 41, 59, 0.8)']
                        : ['rgba(226, 232, 240, 0.8)', 'rgba(241, 245, 249, 0.9)', 'rgba(226, 232, 240, 0.8)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFillObject, animatedStyle]}
            />
        </View>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.isDark
                ? 'rgba(30, 41, 59, 0.6)'
                : 'rgba(226, 232, 240, 0.6)',
            overflow: 'hidden',
        },
    });
