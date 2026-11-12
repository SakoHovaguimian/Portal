import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AppearancePreferenceSchema,
  defaultAppearancePreference,
  type AppearancePreference,
  type ThemeId,
} from '@/models/appearance';
import { strings } from '@/strings';
import { applyTheme } from '@/themes/applyTheme';

import type { ThemePreferenceContext } from './models/themePreferenceContext';
import type { ThemePreferenceProviderProps } from './models/themePreferenceProviderProps';

const ThemeContext = createContext<ThemePreferenceContext | null>(null);

export function ThemePreferenceProvider({
  children,
  service,
}: ThemePreferenceProviderProps) {

  const [preference, setPreferenceState] = useState(
    defaultAppearancePreference,
  );
  const currentPreference = useRef(preference);
  useEffect(() => {

    let active = true;
    let revision = 0;
    const restore = () => {

      const restoringRevision = ++revision;
      void service.getPreference().then((value) => {

        if (!active || restoringRevision !== revision) { return; }
        currentPreference.current = value;
        setPreferenceState(value);
        applyTheme(value);

      });

    };
    restore();
    const onStorage = (event: StorageEvent) => {

      if (event.key === 'semantic-web-theme' || event.key === null) { restore(); }

    };
    window.addEventListener('storage', onStorage);
    const cleanup = () => {

      active = false;
      window.removeEventListener('storage', onStorage);

    };

    return cleanup;

  }, [service]);

  const theme = useMemo(() => {

    const setPreference = async (value: Partial<AppearancePreference>) => {

      const next = AppearancePreferenceSchema.parse({
        ...currentPreference.current,
        ...value,
      });
      const saved = await service.savePreference(next);
      currentPreference.current = saved;
      setPreferenceState(saved);
      applyTheme(saved);

    };
    const themeContext: ThemePreferenceContext = {
      ...preference,
      setPreference,
      setThemeId: (themeId: ThemeId) => setPreference({ themeId }),
    };

    return themeContext;

  }, [preference, service]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );

}

export function useThemePreference() {

  const value = useContext(ThemeContext);
  if (!value) { throw new Error(strings.errors.provider); }
  return value;

}
