// Premium Avatar Component with Animated Gradient Ring
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarProps {
    uri?: string;
    name: string;
    size?: number;
    showRing?: boolean;
    online?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    name,
    size = 40,
    showRing = false,
    online = false,
}) => {
    const { theme } = useTheme();
    const rotation = useSharedValue(0);

    React.useEffect(() => {
        if (showRing) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 3000,
                    easing: Easing.linear,
                }),
                -1
            );
        }
    }, [showRing]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const styles = createStyles(theme, size);

    if (showRing) {
        return (
            <View style={styles.ringContainer}>
                <AnimatedLinearGradient
                    colors={theme.colors.primaryGradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientRing, animatedStyle]}
                >
                    <View style={styles.innerRing}>
                        {uri ? (
                            <Image source={{ uri }} style={styles.image} />
                        ) : (
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.primaryLight]}
                                style={styles.placeholder}
                            >
                                <Text style={styles.initials}>{initials}</Text>
                            </LinearGradient>
                        )}
                        {online && <View style={styles.onlineIndicator} />}
                    </View>
                </AnimatedLinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {uri ? (
                <Image source={{ uri }} style={styles.image} />
            ) : (
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryLight]}
                    style={styles.placeholder}
                >
                    <Text style={styles.initials}>{initials}</Text>
                </LinearGradient>
            )}
            {online && <View style={styles.onlineIndicator} />}
        </View>
    );
};

const createStyles = (theme: any, size: number) =>
    StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            position: 'relative',
        },
        ringContainer: {
            width: size + 8,
            height: size + 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gradientRing: {
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            padding: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        innerRing: {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: theme.colors.background,
            padding: 2,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: size / 2,
        },
        placeholder: {
            width: '100%',
            height: '100%',
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        initials: {
            color: '#ffffff',
            fontSize: size * 0.4,
            fontWeight: '600',
        },
        onlineIndicator: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.25,
            height: size * 0.25,
            borderRadius: size * 0.125,
            backgroundColor: '#10b981',
            borderWidth: 2,
            borderColor: theme.colors.background,
        },
    });
