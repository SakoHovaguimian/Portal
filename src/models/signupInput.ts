import { z } from 'zod';

import { strings } from '@/strings';

import { LoginInputSchema } from './loginInput';

export const SignupInputSchema = LoginInputSchema.extend({
  firstName: z.string().trim().min(1, strings.auth.name).max(80),
  lastName: z.string().trim().min(1, strings.auth.name).max(80),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
