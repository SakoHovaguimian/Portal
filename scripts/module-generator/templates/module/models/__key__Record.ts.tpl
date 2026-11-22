import { z } from 'zod';

export const __Name__RecordSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(120),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type __Name__Record = z.infer<typeof __Name__RecordSchema>;

export const __Name__InputSchema = __Name__RecordSchema.pick({ name: true }).strict();

export type __Name__Input = z.infer<typeof __Name__InputSchema>;
