import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled }) => {
    if (Platform.OS === 'ios' && variant === 'primary') {
        // LiquidCrystal style for iOS
        return (
            <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.iosButtonContainer}>
                <LinearGradient
                    colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iosGradientButton}
                >
                    <Text style={styles.iosButtonText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Material Design for Android or secondary variant
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.androidButton,
                variant === 'primary' ? styles.androidButtonPrimary : styles.androidButtonSecondary,
                disabled && styles.buttonDisabled
            ]}
        >
            <Text style={[
                styles.androidButtonText,
                variant === 'secondary' && styles.androidButtonTextSecondary
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // iOS LiquidCrystal Styles
    iosButtonContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iosGradientButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iosButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },

    // Android Material Design Styles
    androidButton: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    androidButtonPrimary: {
        backgroundColor: '#8b5cf6',
    },
    androidButtonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#8b5cf6',
    },
    androidButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    androidButtonTextSecondary: {
        color: '#8b5cf6',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
