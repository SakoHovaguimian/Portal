import type { AppSession } from '../models/auth';
import type { DashboardModelMeta, DashboardModelSummary, DashboardOverview, DashboardRecord } from '../models/dashboard';
import type { FeatureRequest, FeatureRequestMutationInput } from '../models/featureRequest';
import type { DashboardRecordsQuery, FeatureRequestQuery, PaginatedResult, UsersQuery } from '../models/query';
import type { AppearancePreference } from '../theme/contracts';
import type { User, UserMutationInput } from '../models/user';

export interface UserRepositoryInterface {
  listUsers(query: UsersQuery): Promise<PaginatedResult<User>>;
  getUserById(userId: string): Promise<User | null>;
  updateUser(userId: string, input: UserMutationInput): Promise<User>;
}

export interface FeatureRequestRepositoryInterface {
  listFeatureRequests(query: FeatureRequestQuery): Promise<PaginatedResult<FeatureRequest>>;
  getFeatureRequestById(featureRequestId: string): Promise<FeatureRequest | null>;
  createFeatureRequest(userId: string, input: FeatureRequestMutationInput): Promise<FeatureRequest>;
  updateFeatureRequest(featureRequestId: string, userId: string, input: FeatureRequestMutationInput): Promise<FeatureRequest>;
  deleteFeatureRequest(featureRequestId: string, userId: string): Promise<void>;
}

export interface DashboardRepositoryInterface {
  getOverview(): Promise<DashboardOverview>;
  listModels(): Promise<DashboardModelSummary[]>;
  getModelDetail(modelKey: string): Promise<DashboardModelMeta | null>;
  listRecords(query: DashboardRecordsQuery): Promise<PaginatedResult<DashboardRecord>>;
}

export interface AuthSessionRepositoryInterface {
  getSession(): Promise<AppSession | null>;
}

export interface AppearancePreferenceRepositoryInterface {
  getPreference(): Promise<AppearancePreference>;
  savePreference(preference: AppearancePreference): Promise<AppearancePreference>;
}
