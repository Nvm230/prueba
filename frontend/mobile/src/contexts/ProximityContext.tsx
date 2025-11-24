import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Proximity from 'expo-proximity';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface ProximityContextValue {
  isNear: boolean;
  shouldHideData: boolean; // Indica si se deben ocultar los datos del usuario
}

const ProximityContext = createContext<ProximityContextValue | undefined>(undefined);

export const ProximityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isNear, setIsNear] = useState(false);
  const [shouldHideData, setShouldHideData] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      // En Android, usar una implementación alternativa si es necesario
      return;
    }

    const subscription = Proximity.addListener((event: any) => {
      const near = Boolean(event?.proximity ?? event?.distance < 3);
      setIsNear(near);
      
      // Cuando se detecta proximidad, ocultar datos del usuario
      if (near && !shouldHideData) {
        setShouldHideData(true);
        // Feedback háptico cuando se oculta
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (!near && shouldHideData) {
        setShouldHideData(false);
        // Feedback háptico cuando se muestra
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [shouldHideData]);

  const value = useMemo(() => ({ isNear, shouldHideData }), [isNear, shouldHideData]);
  return <ProximityContext.Provider value={value}>{children}</ProximityContext.Provider>;
};

export const useProximity = () => {
  const ctx = useContext(ProximityContext);
  if (!ctx) throw new Error('useProximity must be used within ProximityProvider');
  return ctx;
};
