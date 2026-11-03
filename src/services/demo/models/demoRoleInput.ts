import { z } from 'zod';
import { UserRoleSchema } from '@/models/userRole';

export const DemoRoleInputSchema = z.object({ role: UserRoleSchema }).strict();

export type DemoRoleInput = z.infer<typeof DemoRoleInputSchema>;
