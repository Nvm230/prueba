// Premium Switch Component with Smooth Animation
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Switch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    disabled = false,
}) => {
    const { theme } = useTheme();
    const translateX = useSharedValue(value ? 22 : 2);
    const colorProgress = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
        translateX.value = withSpring(value ? 22 : 2, {
            damping: 15,
            stiffness: 150,
        });
        colorProgress.value = withTiming(value ? 1 : 0, { duration: 200 });
    }, [value]);

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const trackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            colorProgress.value,
            [0, 1],
            [theme.colors.border, theme.colors.primary]
        );
        return { backgroundColor };
    });

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const styles = createStyles(theme, disabled);

    return (
        <Pressable onPress={handlePress} disabled={disabled}>
            <Animated.View style={[styles.track, trackStyle]}>
                {value && (
                    <LinearGradient
                        colors={theme.colors.primaryGradient as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}
                <Animated.View style={[styles.thumb, thumbStyle]} />
            </Animated.View>
        </Pressable>
    );
};

const createStyles = (theme: any, disabled: boolean) =>
    StyleSheet.create({
        track: {
            width: 50,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.colors.border,
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
        },
        thumb: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
        },
    });
