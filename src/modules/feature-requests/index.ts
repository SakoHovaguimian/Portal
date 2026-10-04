/**
 * Feature Requests Feature Public API
 *
 * This barrel export defines the public contract for the feature-requests feature.
 * Import from this file rather than directly from internal modules.
 */

// Screens
export { FeatureRequestsScreen } from './FeatureRequestsScreen';
export { FeatureRequestDetailScreen } from './FeatureRequestDetailScreen';

// Hooks
export {
  useFeatureRequests,
  useFeatureRequest,
  useCreateFeatureRequest,
  useUpdateFeatureRequest,
  useDeleteFeatureRequest,
} from './hooks';
