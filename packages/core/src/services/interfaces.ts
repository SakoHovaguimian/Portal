import type { AppSession } from '../models/auth';
import type { DashboardModelMeta, DashboardModelSummary, DashboardOverview, DashboardRecord } from '../models/dashboard';
import type { FeatureRequest, FeatureRequestMutationInput } from '../models/featureRequest';
import type { DashboardRecordsQuery, FeatureRequestQuery, PaginatedResult, UsersQuery } from '../models/query';
import type { AppearancePreference } from '../theme/contracts';
import type { User, UserMutationInput } from '../models/user';

export interface AuthServiceInterface {
  getSession(): Promise<AppSession | null>;
  assertAuthenticated(): Promise<AppSession>;
}

export interface UserServiceInterface {
  listUsers(query: UsersQuery): Promise<PaginatedResult<User>>;
  getUserById(userId: string): Promise<User>;
  updateCurrentUser(userId: string, input: UserMutationInput): Promise<User>;
}

export interface FeatureRequestServiceInterface {
  listFeatureRequests(query: FeatureRequestQuery): Promise<PaginatedResult<FeatureRequest>>;
  getFeatureRequestById(featureRequestId: string): Promise<FeatureRequest>;
  createFeatureRequest(input: FeatureRequestMutationInput): Promise<FeatureRequest>;
  updateFeatureRequest(featureRequestId: string, input: FeatureRequestMutationInput): Promise<FeatureRequest>;
  deleteFeatureRequest(featureRequestId: string): Promise<void>;
}

export interface DashboardServiceInterface {
  getOverview(): Promise<DashboardOverview>;
  listModels(): Promise<DashboardModelSummary[]>;
  getModelDetail(modelKey: string): Promise<DashboardModelMeta>;
  listRecords(query: DashboardRecordsQuery): Promise<PaginatedResult<DashboardRecord>>;
}

export interface ThemePreferenceServiceInterface {
  getPreference(): Promise<AppearancePreference>;
  savePreference(preference: AppearancePreference): Promise<AppearancePreference>;
}
