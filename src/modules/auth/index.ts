/**
 * Auth Feature Public API
 *
 * This barrel export defines the public contract for the auth feature.
 * Import from this file rather than directly from internal modules.
 */

// Screens
export { LoginScreen } from './LoginScreen';
export { SignupScreen } from './SignupScreen';

// Session management (client-side)
export { createSession, resolveAuthRedirect } from './sessionClient';
