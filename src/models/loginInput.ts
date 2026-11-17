import { z } from 'zod';

import { strings } from '@/strings';

export const LoginInputSchema = z.object({
  email: z.string().trim().email(strings.auth.invalidEmailHint),
  password: z.string().min(8, strings.auth.passwordHint),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
