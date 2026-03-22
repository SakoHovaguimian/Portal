import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable().default(null),
  dateOfBirth: z.string().datetime().nullable().default(null),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
});

export const UserMutationInputSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  phoneNumber: true,
  dateOfBirth: true,
}).extend({
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
export type UserMutationInput = z.infer<typeof UserMutationInputSchema>;
