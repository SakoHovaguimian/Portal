import { z } from 'zod';
import { UserSchema } from './user';

export const FeatureRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  message: z.string().min(1).max(1000),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deleted: z.boolean().default(false),
  user: UserSchema.nullable().optional(),
});

export const FeatureRequestMutationInputSchema = z.object({
  message: z.string().min(1).max(1000),
});

export type FeatureRequest = z.infer<typeof FeatureRequestSchema>;
export type FeatureRequestMutationInput = z.infer<typeof FeatureRequestMutationInputSchema>;
