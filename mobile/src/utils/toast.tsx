import React from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

// Custom toast configuration
const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={styles.successToast}
            contentContainerStyle={styles.contentContainer}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={styles.errorToast}
            contentContainerStyle={styles.contentContainer}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
    info: (props: any) => (
        <InfoToast
            {...props}
            style={styles.infoToast}
            contentContainerStyle={styles.contentContainer}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
};

// Toast helper functions
export const showToast = {
    success: (message: string, description?: string) => {
        Toast.show({
            type: 'success',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: 3000,
            topOffset: 60,
        });
    },

    error: (message: string, description?: string) => {
        Toast.show({
            type: 'error',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: 4000,
            topOffset: 60,
        });
    },

    info: (message: string, description?: string) => {
        Toast.show({
            type: 'info',
            text1: message,
            text2: description,
            position: 'top',
            visibilityTime: 3000,
            topOffset: 60,
        });
    },
};

// Toast component to be added to App.tsx
export const ToastProvider = () => {
    return <Toast config={toastConfig} />;
};

const styles = StyleSheet.create({
    successToast: {
        borderLeftColor: '#10b981',
        borderLeftWidth: 6,
        backgroundColor: '#ffffff',
        height: 70,
    },
    errorToast: {
        borderLeftColor: '#ef4444',
        borderLeftWidth: 6,
        backgroundColor: '#ffffff',
        height: 70,
    },
    infoToast: {
        borderLeftColor: '#3b82f6',
        borderLeftWidth: 6,
        backgroundColor: '#ffffff',
        height: 70,
    },
    contentContainer: {
        paddingHorizontal: 15,
    },
    text1: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    text2: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
});
