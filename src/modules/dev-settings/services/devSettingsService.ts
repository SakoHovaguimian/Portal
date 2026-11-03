import { z } from 'zod';
import type { ApiClientInterface } from '@/services/api/apiClientInterface';
import {
  DemoSettingsSchema,
  DemoSettingsInputSchema,
  type DemoSettingsInput,
} from '@/models/demoSettings';
import { AppSessionSchema } from '@/models/appSession';
import { UserRoleSchema, type UserRole } from '@/models/userRole';
import {
  DemoPresetSchema,
  type DemoPreset,
} from '@/services/demo/models/demoPreset';

export class DevSettingsService {

  constructor(private readonly api: ApiClientInterface) {}

  // **************************************
  // MARK: - READ DEV SETTINGS
  // **************************************

  async read(signal?: AbortSignal) {
    return DemoSettingsSchema.parse(await this.api.request('/', { signal }));
  }

  // **************************************
  // MARK: - UPDATE DEV SETTINGS
  // **************************************

  async update(input: DemoSettingsInput) {

    return z.object({ reload: z.boolean() }).parse(
      await this.api.request('/', {
        method: 'PUT',
        body: DemoSettingsInputSchema.parse(input),
      }),
    );

  }

  // **************************************
  // MARK: - SWITCH PRESET
  // **************************************

  async switchPreset(preset: DemoPreset) {

    return AppSessionSchema.parse(
      await this.api.request('/preset', {
        method: 'POST',
        body: { preset: DemoPresetSchema.parse(preset) },
      }),
    );

  }

  // **************************************
  // MARK: - SWITCH ROLE
  // **************************************

  async switchRole(role: UserRole) {

    return AppSessionSchema.parse(
      await this.api.request('/role', {
        method: 'POST',
        body: { role: UserRoleSchema.parse(role) },
      }),
    );

  }

  // **************************************
  // MARK: - RESET DEMO STATE
  // **************************************

  async reset() {

    return AppSessionSchema.parse(
      await this.api.request('/reset', { method: 'POST' }),
    );

  }

}
