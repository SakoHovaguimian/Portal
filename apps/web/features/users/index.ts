/**
 * Users Feature Public API
 *
 * This barrel export defines the public contract for the users feature.
 * Import from this file rather than directly from internal modules.
 */

// Screens
export { UsersScreen } from './UsersScreen';
export { UserDetailScreen } from './UserDetailScreen';
export { ProfileScreen } from './ProfileScreen';

// Hooks
export { useUsers, useUser, useUpdateCurrentUser } from './hooks';
