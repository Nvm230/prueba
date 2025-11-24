import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import PrimaryButton from '@/components/PrimaryButton';
import { useToast } from '@/contexts/ToastContext';

const QrScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    show({ title: 'QR detectado', message: data });
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando acceso a la cámara…</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No se otorgó permiso para la cámara.</Text>
        <PrimaryButton title="Intentar nuevamente" onPress={() => BarCodeScanner.requestPermissionsAsync()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      </View>
      {scanned && <PrimaryButton title="Escanear de nuevo" onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, justifyContent: 'center', gap: 24 },
  preview: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden'
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }
});

export default QrScannerScreen;
