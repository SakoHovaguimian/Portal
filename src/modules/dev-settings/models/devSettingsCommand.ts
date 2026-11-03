import type { DemoSettingsInput } from '@/models/demoSettings';
import type { DemoPreset } from '@/services/demo/models/demoPreset';
export type DevSettingsCommand =
  | { kind: 'update'; input: DemoSettingsInput }
  | { kind: 'preset'; preset: DemoPreset }
  | { kind: 'reset' };
