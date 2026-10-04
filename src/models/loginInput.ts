import { z } from 'zod';
import { strings } from '@/strings';
export const LoginInputSchema = z.object({
  email: z.string().trim().email(strings.auth.invalidEmail),
  password: z.string().min(8, strings.auth.password),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
