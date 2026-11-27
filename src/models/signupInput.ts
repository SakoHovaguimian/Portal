import { z } from 'zod';

import { strings } from '@/strings';

import { LoginInputSchema } from './loginInput';

export const SignupInputSchema = LoginInputSchema.extend({
  firstName: z.string().trim().min(1, strings.auth.nameHint).max(80, strings.auth.nameLengthHint),
  lastName: z.string().trim().min(1, strings.auth.nameHint).max(80, strings.auth.nameLengthHint),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
