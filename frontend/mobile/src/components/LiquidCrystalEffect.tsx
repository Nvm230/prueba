import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSensors } from '@/contexts/SensorContext';

interface LiquidCrystalEffectProps {
  children: React.ReactNode;
  intensity?: number;
}

/**
 * Liquid Crystal Effect para iOS
 * Crea un efecto visual fluido similar al vidrio que se adapta dinámicamente
 * basado en los sensores del dispositivo
 */
export const LiquidCrystalEffect: React.FC<LiquidCrystalEffectProps> = ({
  children,
  intensity = 0.8
}) => {
  const { accelerometer, gyroscope } = useSensors();
  const blurIntensity = useRef(new Animated.Value(0)).current;
  const rotationX = useRef(new Animated.Value(0)).current;
  const rotationY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!accelerometer && !gyroscope) return;

    // Combinar datos de acelerómetro y giroscopio para movimiento fluido
    const accelData = accelerometer || { x: 0, y: 0, z: 0 };
    const gyroData = gyroscope || { x: 0, y: 0, z: 0 };

    // Calcular rotación basada en sensores
    const rotationXValue = (accelData.x + gyroData.x) * 0.1;
    const rotationYValue = (accelData.y + gyroData.y) * 0.1;
    const scaleValue = 1 + Math.abs(accelData.z) * 0.05;

    // Animar valores
    Animated.parallel([
      Animated.spring(rotationX, {
        toValue: rotationXValue,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }),
      Animated.spring(rotationY, {
        toValue: rotationYValue,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }),
      Animated.spring(scale, {
        toValue: scaleValue,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }),
      Animated.timing(blurIntensity, {
        toValue: intensity * 100,
        duration: 200,
        useNativeDriver: false
      })
    ]).start();
  }, [accelerometer, gyroscope, intensity]);

  // Solo aplicar en iOS
  if (Platform.OS !== 'ios') {
    return <>{children}</>;
  }

  const animatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateX: rotationX.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-5deg', '5deg']
      })},
      { rotateY: rotationY.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-5deg', '5deg']
      })},
      { scale }
    ]
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <BlurView
          intensity={blurIntensity}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.childrenContainer}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden'
  },
  childrenContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
});



