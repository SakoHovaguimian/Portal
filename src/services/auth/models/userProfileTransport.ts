import type { UserTransport } from '@/services/api/models/userTransport';

export type UserProfileTransport = UserTransport & {
  role?: unknown;
  disabled?: boolean;
};
