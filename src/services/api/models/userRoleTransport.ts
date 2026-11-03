import { z } from 'zod';
/** Documented wire spellings; organization roles do not imply platform privileges. */
export const UserRoleTransportSchema = z.enum([
  'user',
  'admin',
  'superadmin',
  'USER',
  'ADMIN',
  'OWNER',
  'MANAGER',
  'EMPLOYEE',
  'RECEPTIONIST',
]);
export type UserRoleTransport = z.infer<typeof UserRoleTransportSchema>;
