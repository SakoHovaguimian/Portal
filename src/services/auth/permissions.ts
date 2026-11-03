import type { SessionUser } from '@/models/sessionUser';

export function canManageContent(role: SessionUser['role']) {
  return role === 'admin' || role === 'superadmin';
}

export function canManagePlatform(role: SessionUser['role']) {
  return role === 'superadmin';
}
