import { z } from 'zod'

export const RealtimeEventSchema = z.object({
  schema_version: z.literal(1),
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  occurred_at: z.string().datetime(),
  resource_id: z.string().min(1).optional(),
  data: z.record(z.string(), z.unknown()),
})

export const RealtimeTicketSchema = z.object({
  ticket: z.string().min(1),
  expires_at: z.string().datetime(),
})

export type RealtimeEvent = z.infer<typeof RealtimeEventSchema>
