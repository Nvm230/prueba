// Premium Modal Component with Glass Variant
import React from 'react';
import {
    Modal as RNModal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    SlideInUp,
    SlideOutUp,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    variant?: 'center' | 'bottom' | 'glass';
    showCloseButton?: boolean;
}

const { height } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    variant = 'center',
    showCloseButton = true,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, variant);

    // Glass Modal
    if (variant === 'glass') {
        return (
            <RNModal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Animated.View
                        entering={SlideInUp.springify()}
                        exiting={SlideOutDown.springify()}
                        style={styles.glassContainer}
                    >
                        <Pressable onPress={(e) => e.stopPropagation()}>
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
                                <BlurView
                                    intensity={30}
                                    tint={theme.isDark ? 'dark' : 'light'}
                                    style={styles.blurContent}
                                >
                                    <View style={styles.glassInner}>
                                        {title && (
                                            <View style={styles.header}>
                                                <Text style={styles.title}>{title}</Text>
                                                {showCloseButton && (
                                                    <Pressable onPress={onClose} style={styles.closeButton}>
                                                        <Text style={styles.closeIcon}>✕</Text>
                                                    </Pressable>
                                                )}
                                            </View>
                                        )}
                                        <View style={styles.content}>{children}</View>
                                    </View>
                                </BlurView>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </RNModal>
        );
    }

    // Bottom Sheet Modal
    if (variant === 'bottom') {
        return (
            <RNModal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Animated.View
                        entering={SlideInDown.springify()}
                        exiting={SlideOutDown.springify()}
                        style={styles.bottomSheet}
                    >
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <View style={styles.handle} />
                            {title && (
                                <View style={styles.header}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                            )}
                            <View style={styles.content}>{children}</View>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </RNModal>
        );
    }

    // Center Modal
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={styles.centerModal}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        {title && (
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                {showCloseButton && (
                                    <Pressable onPress={onClose} style={styles.closeButton}>
                                        <Text style={styles.closeIcon}>✕</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
                        <View style={styles.content}>{children}</View>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </RNModal>
    );
};

const createStyles = (theme: any, variant: string) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: variant === 'bottom' ? 'flex-end' : 'center',
            alignItems: 'center',
        },
        // Glass Modal
        glassContainer: {
            width: '90%',
            maxWidth: 400,
        },
        gradientBorder: {
            padding: 2,
            borderRadius: 24,
        },
        blurContent: {
            borderRadius: 22,
            overflow: 'hidden',
        },
        glassInner: {
            backgroundColor: theme.isDark
                ? 'rgba(15, 23, 42, 0.7)'
                : 'rgba(255, 255, 255, 0.7)',
        },
        // Bottom Sheet
        bottomSheet: {
            width: '100%',
            maxHeight: height * 0.9,
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 12,
        },
        handle: {
            width: 40,
            height: 4,
            backgroundColor: theme.colors.border,
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 16,
        },
        // Center Modal
        centerModal: {
            width: '90%',
            maxWidth: 400,
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
        },
        // Common
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text,
        },
        closeButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.surfaceVariant,
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeIcon: {
            fontSize: 18,
            color: theme.colors.textSecondary,
        },
        content: {
            padding: 20,
        },
    });
