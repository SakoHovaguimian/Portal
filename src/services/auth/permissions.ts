import type { SessionUser } from '@/models/sessionUser';

// **************************************
// MARK: - CHECK CONTENT MANAGEMENT PERMISSION
// **************************************

export function canManageContent(role: SessionUser['role']) {
  return role === 'admin' || role === 'superadmin';
}

// **************************************
// MARK: - CHECK PLATFORM MANAGEMENT PERMISSION
// **************************************

export function canManagePlatform(role: SessionUser['role']) {
  return role === 'superadmin';
}
