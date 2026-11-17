import { z } from 'zod';

import { portalEngagementStrings as copy } from '@/strings';

export const EngagementInputSchema = z
  .object({
    liked: z.boolean().optional(),
    saved: z.boolean().optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, copy.invalidInputHint);

export type EngagementInput = z.infer<typeof EngagementInputSchema>;
