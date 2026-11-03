import { z } from 'zod';
import {
  EngagementKeySchema,
  EngagementTargetSchema,
} from './engagementTarget';
import { portalEngagementStrings as copy } from '@/strings';
export const EngagementInputSchema = z
  .object({
    liked: z.boolean().optional(),
    saved: z.boolean().optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, copy.invalidInput);
export const EngagementRecordSchema = EngagementKeySchema.extend({
  liked: z.boolean(),
  saved: z.boolean(),
  rating: z.number().int().min(1).max(5).nullable(),
  updatedAt: z.string().datetime(),
  target: EngagementTargetSchema.nullable(),
});
export const EngagementSummarySchema = EngagementRecordSchema.extend({
  likeCount: z.number().int().min(0),
});
export type EngagementRecord = z.infer<typeof EngagementRecordSchema>;
export type EngagementInput = z.infer<typeof EngagementInputSchema>;
export type EngagementSummary = z.infer<typeof EngagementSummarySchema>;
