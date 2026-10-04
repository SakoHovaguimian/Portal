import { z } from 'zod';
const BaseSchema = z.object({
  event_id: z.string().uuid(),
  occurred_at: z.string().datetime(),
});
export const RealtimeEventSchema = z.discriminatedUnion('event_type', [
  BaseSchema.extend({
    event_type: z.enum([
      'chat.message_created',
      'chat.message_updated',
      'chat.message_deleted',
    ]),
    data: z.object({ message_id: z.string().uuid() }),
  }),
  BaseSchema.extend({
    event_type: z.literal('notification'),
    data: z.object({
      title: z.string().min(1).max(200),
      body: z.string().max(1000),
    }),
  }),
]);
export type RealtimeEvent = z.infer<typeof RealtimeEventSchema>;
