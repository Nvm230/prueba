import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { Platform } from 'react-native';

interface SensorData {
  accelerometer: { x: number; y: number; z: number } | null;
  gyroscope: { x: number; y: number; z: number } | null;
  magnetometer: { x: number; y: number; z: number } | null;
}

interface SensorContextValue extends SensorData {
  isAvailable: boolean;
}

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

export const SensorProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accelerometer, setAccelerometer] = useState<{ x: number; y: number; z: number } | null>(null);
  const [gyroscope, setGyroscope] = useState<{ x: number; y: number; z: number } | null>(null);
  const [magnetometer, setMagnetometer] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const accelAvailable = await Accelerometer.isAvailableAsync();
        const gyroAvailable = await Gyroscope.isAvailableAsync();
        const magAvailable = await Magnetometer.isAvailableAsync();
        setIsAvailable(accelAvailable || gyroAvailable || magAvailable);
      } catch (error) {
        setIsAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  useEffect(() => {
    if (!isAvailable) return;

    let accelerometerSubscription: any;
    let gyroscopeSubscription: any;
    let magnetometerSubscription: any;

    const setupSensors = async () => {
      try {
        // Configurar frecuencia de actualización (100ms = 10Hz)
        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);
        Magnetometer.setUpdateInterval(100);

        accelerometerSubscription = Accelerometer.addListener((data) => {
          setAccelerometer(data);
        });

        gyroscopeSubscription = Gyroscope.addListener((data) => {
          setGyroscope(data);
        });

        magnetometerSubscription = Magnetometer.addListener((data) => {
          setMagnetometer(data);
        });
      } catch (error) {
        console.error('Error setting up sensors:', error);
      }
    };

    setupSensors();

    return () => {
      accelerometerSubscription?.remove();
      gyroscopeSubscription?.remove();
      magnetometerSubscription?.remove();
    };
  }, [isAvailable]);

  const value = useMemo(
    () => ({
      accelerometer,
      gyroscope,
      magnetometer,
      isAvailable
    }),
    [accelerometer, gyroscope, magnetometer, isAvailable]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
};

export const useSensors = () => {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensors must be used within SensorProvider');
  return ctx;
};



