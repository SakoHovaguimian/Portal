import 'server-only';
import type { UserRole } from '@/models/userRole';
import { UserRoleTransportSchema } from '@/services/api/models/userRoleTransport';
/** Only the canonical Portal profile's explicit lowercase superadmin grants that role. */
export function mapUserRoleTransport(input: unknown): UserRole {
  const parsed = UserRoleTransportSchema.safeParse(input);
  if (!parsed.success) return 'user';
  switch (parsed.data) {
    case 'admin':
    case 'ADMIN':
      return 'admin';
    case 'superadmin':
      return 'superadmin';
    default:
      return 'user';
  }
}
