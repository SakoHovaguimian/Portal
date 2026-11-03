import type { UserTransport } from '@/services/api/models';
import type { UserRole } from '@/models/userRole';
export type DemoUser = UserTransport & { role: UserRole; disabled: boolean };
