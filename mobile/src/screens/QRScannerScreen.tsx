import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { eventService } from '../services/events';
import { Button } from '../components/ui/Button';

export const QRScannerScreen = ({ navigation, route }: any) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const eventId = route.params?.eventId;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
        setScanned(true);

        try {
            await eventService.checkIn(eventId, data);
            Alert.alert(
                '✅ Check-in exitoso',
                'Has sido registrado en el evento',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert(
                '❌ Error',
                error.response?.data?.message || 'No se pudo realizar el check-in',
                [{ text: 'Reintentar', onPress: () => setScanned(false) }]
            );
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Solicitando permiso de cámara...</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No hay acceso a la cámara</Text>
                <Button
                    title="Ir a configuración"
                    onPress={() => Alert.alert('Por favor habilita el permiso de cámara en configuración')}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <Text style={styles.instructions}>
                        Escanea el código QR del evento
                    </Text>

                    {scanned && (
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => setScanned(false)}
                        >
                            <Text style={styles.resetText}>Escanear de nuevo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#8b5cf6',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    instructions: {
        marginTop: 40,
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 8,
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 20,
    },
    resetButton: {
        marginTop: 20,
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    resetText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
