import { z } from 'zod';
export const RealtimeTicketSchema = z.object({
  ticket: z.string().min(1),
  expires_at: z.string().datetime(),
});
