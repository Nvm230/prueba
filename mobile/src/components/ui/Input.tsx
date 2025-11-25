// Premium Input Component with Glass Effect
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    ...props
}) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const glowOpacity = useSharedValue(0);
    const labelScale = useSharedValue(label && props.value ? 0.85 : 1);
    const labelY = useSharedValue(label && props.value ? -24 : 0);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const labelStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: labelScale.value },
            { translateY: labelY.value },
        ],
    }));

    const handleFocus = () => {
        setIsFocused(true);
        glowOpacity.value = withTiming(1, { duration: 200 });
        if (label) {
            labelScale.value = withTiming(0.85, { duration: 200 });
            labelY.value = withTiming(-24, { duration: 200 });
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        glowOpacity.value = withTiming(0, { duration: 200 });
        if (label && !props.value) {
            labelScale.value = withTiming(1, { duration: 200 });
            labelY.value = withTiming(0, { duration: 200 });
        }
    };

    const styles = createStyles(theme, isFocused, !!error);

    return (
        <View style={styles.container}>
            {label && (
                <Animated.Text style={[styles.label, labelStyle]}>
                    {label}
                </Animated.Text>
            )}

            <View style={styles.inputWrapper}>
                {/* Glow Effect */}
                <Animated.View style={[styles.glow, glowStyle]} />

                {/* Glass Background */}
                <BlurView
                    intensity={10}
                    tint={theme.isDark ? 'dark' : 'light'}
                    style={styles.blurContainer}
                >
                    <View style={styles.inputContainer}>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                        <TextInput
                            {...props}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                        />
                    </View>
                </BlurView>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const createStyles = (theme: any, isFocused: boolean, hasError: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            position: 'absolute',
            left: 16,
            top: 16,
            color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
            fontSize: 16,
            fontWeight: '500',
            zIndex: 10,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 4,
        },
        inputWrapper: {
            position: 'relative',
        },
        glow: {
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 14,
            backgroundColor: hasError
                ? `${theme.colors.error}40`
                : `${theme.colors.primary}40`,
            opacity: 0,
        },
        blurContainer: {
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: hasError
                ? theme.colors.error
                : isFocused
                    ? theme.colors.primary
                    : theme.colors.border,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.isDark
                ? 'rgba(30, 41, 59, 0.4)'
                : 'rgba(255, 255, 255, 0.7)',
            paddingHorizontal: 16,
        },
        iconContainer: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            paddingVertical: 16,
            fontSize: 16,
            color: theme.colors.text,
        },
        error: {
            marginTop: 4,
            marginLeft: 16,
            fontSize: 12,
            color: theme.colors.error,
        },
    });
