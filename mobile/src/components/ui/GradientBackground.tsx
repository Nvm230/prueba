import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
    children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
    if (Platform.OS === 'ios') {
        // LiquidCrystal animated gradient for iOS
        return (
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {children}
            </LinearGradient>
        );
    }

    // Simple background for Android
    return (
        <View style={styles.androidBackground}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    androidBackground: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});
