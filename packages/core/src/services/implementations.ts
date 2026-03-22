import { AuthError, NotFoundError, OwnershipError } from '../errors/domainErrors';
import type { AppSession } from '../models/auth';
import type { FeatureRequestMutationInput } from '../models/featureRequest';
import type { DashboardRecordsQuery, FeatureRequestQuery, UsersQuery } from '../models/query';
import type { AppearancePreference } from '../theme/contracts';
import type { UserMutationInput } from '../models/user';
import type {
  AppearancePreferenceRepositoryInterface,
  AuthSessionRepositoryInterface,
  DashboardRepositoryInterface,
  FeatureRequestRepositoryInterface,
  UserRepositoryInterface,
} from '../repositories/interfaces';
import type {
  AuthServiceInterface,
  DashboardServiceInterface,
  FeatureRequestServiceInterface,
  ThemePreferenceServiceInterface,
  UserServiceInterface,
} from './interfaces';

export class AuthService implements AuthServiceInterface {
  constructor(private readonly repository: AuthSessionRepositoryInterface) {}

  async getSession(): Promise<AppSession | null> {
    return this.repository.getSession();
  }

  async assertAuthenticated(): Promise<AppSession> {
    const session = await this.getSession();
    if (!session) {
      throw new AuthError();
    }
    return session;
  }
}

export class UserService implements UserServiceInterface {
  constructor(
    private readonly repository: UserRepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async listUsers(query: UsersQuery) {
    return this.repository.listUsers(query);
  }

  async getUserById(userId: string) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateCurrentUser(userId: string, input: UserMutationInput) {
    const session = await this.authService.assertAuthenticated();
    if (session.user.id !== userId) {
      throw new OwnershipError();
    }
    return this.repository.updateUser(userId, input);
  }
}

export class FeatureRequestService implements FeatureRequestServiceInterface {
  constructor(
    private readonly repository: FeatureRequestRepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async listFeatureRequests(query: FeatureRequestQuery) {
    const session = await this.authService.assertAuthenticated();
    return this.repository.listFeatureRequests({ ...query, userId: session.user.id });
  }

  async getFeatureRequestById(featureRequestId: string) {
    const session = await this.authService.assertAuthenticated();
    const featureRequest = await this.repository.getFeatureRequestById(featureRequestId);
    if (!featureRequest) {
      throw new NotFoundError('Feature request not found');
    }
    if (featureRequest.userId !== session.user.id) {
      throw new OwnershipError();
    }
    return featureRequest;
  }

  async createFeatureRequest(input: FeatureRequestMutationInput) {
    const session = await this.authService.assertAuthenticated();
    return this.repository.createFeatureRequest(session.user.id, input);
  }

  async updateFeatureRequest(featureRequestId: string, input: FeatureRequestMutationInput) {
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.getFeatureRequestById(featureRequestId);
    if (!existing) {
      throw new NotFoundError('Feature request not found');
    }
    if (existing.userId !== session.user.id) {
      throw new OwnershipError();
    }
    return this.repository.updateFeatureRequest(featureRequestId, session.user.id, input);
  }

  async deleteFeatureRequest(featureRequestId: string) {
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.getFeatureRequestById(featureRequestId);
    if (!existing) {
      throw new NotFoundError('Feature request not found');
    }
    if (existing.userId !== session.user.id) {
      throw new OwnershipError();
    }
    await this.repository.deleteFeatureRequest(featureRequestId, session.user.id);
  }
}

export class DashboardService implements DashboardServiceInterface {
  constructor(
    private readonly repository: DashboardRepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async getOverview() {
    await this.authService.assertAuthenticated();
    return this.repository.getOverview();
  }

  async listModels() {
    await this.authService.assertAuthenticated();
    return this.repository.listModels();
  }

  async getModelDetail(modelKey: string) {
    await this.authService.assertAuthenticated();
    const detail = await this.repository.getModelDetail(modelKey);
    if (!detail) {
      throw new NotFoundError(`Dashboard model "${modelKey}" not found`);
    }
    return detail;
  }

  async listRecords(query: DashboardRecordsQuery) {
    await this.authService.assertAuthenticated();
    return this.repository.listRecords(query);
  }
}

export class ThemePreferenceService implements ThemePreferenceServiceInterface {
  constructor(private readonly repository: AppearancePreferenceRepositoryInterface) {}

  async getPreference(): Promise<AppearancePreference> {
    return this.repository.getPreference();
  }

  async savePreference(preference: AppearancePreference): Promise<AppearancePreference> {
    return this.repository.savePreference(preference);
  }
}
