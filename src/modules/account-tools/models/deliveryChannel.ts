import { z } from 'zod';

export const DeliveryChannelSchema = z.enum([
  'PUSH',
  'EMAIL',
]);

export type DeliveryChannel = z.infer<typeof DeliveryChannelSchema>;
