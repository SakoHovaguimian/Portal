import type { components } from '../../generated/schema';

export type UserTransport = components['schemas']['UserTransport'];
export type UserMutationTransport = components['schemas']['UserMutationTransport'];
export type FeatureRequestTransport = components['schemas']['FeatureRequestTransport'];
export type FeatureRequestMutationTransport = components['schemas']['FeatureRequestMutationTransport'];
export type DashboardOverviewTransport = components['schemas']['DashboardOverviewTransport'];
export type DashboardModelSummaryTransport = components['schemas']['DashboardModelSummaryTransport'];
export type DashboardModelMetaTransport = components['schemas']['DashboardModelMetaTransport'];

export interface ApiClient {
  listUsers(): Promise<{ data: UserTransport[]; total: number; limit: number; offset: number }>;
  getUserById(userId: string): Promise<UserTransport | null>;
  createUser(input: UserMutationTransport): Promise<UserTransport>;
  updateUser(userId: string, input: UserMutationTransport): Promise<UserTransport>;
  listFeatureRequests(userId: string): Promise<{ data: FeatureRequestTransport[]; total: number; limit: number; offset: number }>;
  getFeatureRequestById(featureRequestId: string): Promise<FeatureRequestTransport | null>;
  createFeatureRequest(userId: string, input: FeatureRequestMutationTransport): Promise<FeatureRequestTransport>;
  updateFeatureRequest(featureRequestId: string, userId: string, input: FeatureRequestMutationTransport): Promise<FeatureRequestTransport>;
  deleteFeatureRequest(featureRequestId: string, userId: string): Promise<void>;
  getDashboardOverview(): Promise<DashboardOverviewTransport>;
  listDashboardModels(): Promise<{ models: DashboardModelSummaryTransport[] }>;
  getDashboardModelDetail(modelKey: string): Promise<DashboardModelMetaTransport | null>;
  listDashboardRecords(modelKey: string, search: string): Promise<{ data: Array<Record<string, unknown>>; total: number; limit: number; offset: number }>;
}
