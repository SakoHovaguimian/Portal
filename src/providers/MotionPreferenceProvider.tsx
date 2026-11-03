import type { MotionPreferenceProviderProps } from './models/motionPreferenceProviderProps';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultMotionPreference,
  type MotionPreference,
} from '@/models/motionPreference';
import { strings } from '@/strings';
import type { MotionPreferenceContextValue } from './models/motionPreferenceContextValue';

const MotionContext = createContext<MotionPreferenceContextValue | null>(null);

export function MotionPreferenceProvider({
  children,
  service,
}: MotionPreferenceProviderProps) {

  const [preference, setPreferenceState] = useState(defaultMotionPreference);
  useEffect(() => {

    let active = true;
    const restore = () => {

      void service.getPreference().then((value) => {

        if (!active) { return; }
        setPreferenceState(value);
        document.documentElement.dataset.motion = value;

      });

    };
    restore();
    const onStorage = (event: StorageEvent) => {

      if (event.key === 'portal-motion' || event.key === null) { restore(); }

    };
    window.addEventListener('storage', onStorage);
    const cleanup = () => {

      active = false;
      window.removeEventListener('storage', onStorage);

    };

    return cleanup;

  }, [service]);
  const value = useMemo(
    () => {

      const motionContext: MotionPreferenceContextValue = ({
        preference,
        setPreference: async (next: MotionPreference) => {

          const saved = await service.savePreference(next);
          setPreferenceState(saved);
          document.documentElement.dataset.motion = saved;

        },
      });

      return motionContext;

    },
    [preference, service],
  );
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );

}

export function useMotionPreference() {

  const value = useContext(MotionContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}
