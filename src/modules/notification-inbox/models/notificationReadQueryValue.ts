import { z } from 'zod';

export const NotificationReadQueryValueSchema = z.enum([
  'true',
  'false',
]);

export type NotificationReadQueryValue = z.infer<
  typeof NotificationReadQueryValueSchema
>;
