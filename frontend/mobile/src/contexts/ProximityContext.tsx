import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Proximity from 'expo-proximity';

interface ProximityContextValue {
  isNear: boolean;
}

const ProximityContext = createContext<ProximityContextValue | undefined>(undefined);

export const ProximityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const subscription = Proximity.addListener((event: any) => {
      setIsNear(Boolean(event?.proximity ?? event?.distance < 3));
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const value = useMemo(() => ({ isNear }), [isNear]);
  return <ProximityContext.Provider value={value}>{children}</ProximityContext.Provider>;
};

export const useProximity = () => {
  const ctx = useContext(ProximityContext);
  if (!ctx) throw new Error('useProximity must be used within ProximityProvider');
  return ctx;
};
