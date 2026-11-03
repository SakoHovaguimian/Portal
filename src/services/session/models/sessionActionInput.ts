import { z } from 'zod';
import { LoginInputSchema, SignupInputSchema } from '@/models/auth';
import { DemoPresetSchema } from '@/services/demo/models/demoPreset';

export const SessionActionInputSchema = z.discriminatedUnion('action', [
  LoginInputSchema.extend({ action: z.literal('login') }),
  SignupInputSchema.extend({ action: z.literal('signup') }),
  z.object({ action: z.literal('preset'), preset: DemoPresetSchema }).strict(),
]);

export type SessionActionInput = z.infer<typeof SessionActionInputSchema>;
