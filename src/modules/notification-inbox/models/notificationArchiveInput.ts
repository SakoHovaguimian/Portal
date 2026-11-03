import { z } from 'zod';
import { NotificationInboxFiltersSchema } from './notificationInboxQuery';
import { portalNotificationInboxStrings as copy } from '@/strings';

export const NotificationArchiveInputSchema = z.discriminatedUnion('scope', [
  z.object({ scope: z.literal('ALL') }).strict(),
  z
    .object({
      scope: z.literal('FILTERED'),
      filters: NotificationInboxFiltersSchema.refine((value) => {

        const filterValues = Object.values(value);
        const hasActiveFilter = filterValues.some(
          (item) => item !== undefined,
        );

        return hasActiveFilter;

      }, copy.validation.filters),
    })
    .strict(),
]);

export type NotificationArchiveInput = z.infer<
  typeof NotificationArchiveInputSchema
>;
