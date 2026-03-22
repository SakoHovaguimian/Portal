import { z } from 'zod';

export const SessionUserSchema = z.object({
  id: z.string().min(1),
  externalId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const AppSessionSchema = z.object({
  user: SessionUserSchema,
  token: z.string(),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignupInputSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type SessionUser = z.infer<typeof SessionUserSchema>;
export type AppSession = z.infer<typeof AppSessionSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
export type AuthContext = {
  session: AppSession | null;
};
