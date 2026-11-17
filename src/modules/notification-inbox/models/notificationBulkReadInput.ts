import { z } from 'zod';

import { portalNotificationInboxStrings as copy } from '@/strings';

import { NotificationInboxFiltersSchema } from './notificationInboxQuery';
import { NotificationReadInputSchema } from './notificationReadInput';

export const NotificationBulkReadInputSchema = z.discriminatedUnion('scope', [
  NotificationReadInputSchema.extend({ scope: z.literal('ALL') }),
  NotificationReadInputSchema.extend({
    scope: z.literal('SELECTED'),
    ids: z
      .array(z.string().uuid())
      .min(1)
      .max(100)
      .refine((ids) => {

        const uniqueIds = new Set(ids);
        const hasUniqueIds = uniqueIds.size === ids.length;
        return hasUniqueIds;

      }, copy.validation.selection),
  }),
  NotificationReadInputSchema.extend({
    scope: z.literal('FILTERED'),
    filters: NotificationInboxFiltersSchema.refine((value) => {

      const filterValues = Object.values(value);
      const hasActiveFilter = filterValues.some((item) => item !== undefined);
      return hasActiveFilter;

    }, copy.validation.filters),
  }),
]);

export type NotificationBulkReadInput = z.infer<
  typeof NotificationBulkReadInputSchema
>;
