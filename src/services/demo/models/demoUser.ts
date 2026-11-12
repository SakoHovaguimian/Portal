import type { UserRole } from '@/models/userRole';
import type { UserTransport } from '@/services/api/models';

export type DemoUser = UserTransport & { role: UserRole; disabled: boolean };
