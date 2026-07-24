import { z } from 'zod'

export const RealtimeConfigSchema = z.object({
  socket_url: z.string().url(),
  event_name: z.string().min(1).default('portal:event'),
  ticket_path: z.string().startsWith('/').optional(),
})

export type RealtimeConfig = z.infer<typeof RealtimeConfigSchema>
