import 'server-only';
import { cookies } from 'next/headers';
import { environment, getRuntimeConfig } from '@/config/environment';
import {
  DemoSettingsInputSchema,
  type DemoSettingsInput,
} from '@/models/demoSettings';
import { DemoContextSchema } from '@/models/demoContext';
import type { DemoCookieReader } from './models/demoCookieReader';
export const demoSettingsCookieName = 'portal_demo_preferences';
export function isDevSettingsAvailable() {
  return process.env.NODE_ENV === 'development' || environment.demoMode;
}
export async function readDemoSettings(
  store?: DemoCookieReader,
): Promise<DemoSettingsInput | null> {
  if (!isDevSettingsAvailable()) return null;
  const raw = (store ?? (await cookies())).get(demoSettingsCookieName)?.value;
  if (!raw) return null;
  try {
    const result = DemoSettingsInputSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
export async function getEffectiveRuntime(store?: DemoCookieReader) {
  const preferences = await readDemoSettings(store);
  return {
    ...getRuntimeConfig(preferences?.demoMode ?? environment.demoMode),
    devSettingsEnabled: isDevSettingsAvailable(),
  };
}
export async function getDemoContext(store?: DemoCookieReader) {
  return DemoContextSchema.parse((await readDemoSettings(store)) ?? {});
}
export async function writeDemoSettings(input: DemoSettingsInput) {
  (await cookies()).set(
    demoSettingsCookieName,
    JSON.stringify(DemoSettingsInputSchema.parse(input)),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    },
  );
}
