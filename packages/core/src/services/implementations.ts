import { AuthError, NotFoundError, OwnershipError, ValidationError } from '../errors/domainErrors';
import type { AppSession } from '../models/auth';
import { FeatureRequestMutationInputSchema, type FeatureRequestMutationInput } from '../models/featureRequest';
import {
  DashboardRecordsQuerySchema,
  FeatureRequestQuerySchema,
  UsersQuerySchema,
  type DashboardRecordsQuery,
  type FeatureRequestQuery,
  type UsersQuery,
} from '../models/query';
import { AppearancePreferenceSchema, type AppearancePreference } from '../theme/contracts';
import { UserMutationInputSchema, type UserMutationInput } from '../models/user';
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
import { ZodError } from 'zod';

/**
 * Validates input against a Zod schema and throws a ValidationError on failure.
 * Provides defense-in-depth validation at the service layer.
 */
function validateInput<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid input', error.issues);
    }
    throw error;
  }
}

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
    const validated = validateInput(UsersQuerySchema, query);
    return this.repository.listUsers(validated);
  }

  async getUserById(userId: string) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateCurrentUser(userId: string, input: UserMutationInput) {
    const validated = validateInput(UserMutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    if (session.user.id !== userId) {
      throw new OwnershipError();
    }
    return this.repository.updateUser(userId, validated);
  }
}

export class FeatureRequestService implements FeatureRequestServiceInterface {
  constructor(
    private readonly repository: FeatureRequestRepositoryInterface,
    private readonly authService: AuthServiceInterface,
  ) {}

  async listFeatureRequests(query: FeatureRequestQuery) {
    const validated = validateInput(FeatureRequestQuerySchema, query);
    const session = await this.authService.assertAuthenticated();
    return this.repository.listFeatureRequests({ ...validated, userId: session.user.id });
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
    const validated = validateInput(FeatureRequestMutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    return this.repository.createFeatureRequest(session.user.id, validated);
  }

  async updateFeatureRequest(featureRequestId: string, input: FeatureRequestMutationInput) {
    const validated = validateInput(FeatureRequestMutationInputSchema, input);
    const session = await this.authService.assertAuthenticated();
    const existing = await this.repository.getFeatureRequestById(featureRequestId);
    if (!existing) {
      throw new NotFoundError('Feature request not found');
    }
    if (existing.userId !== session.user.id) {
      throw new OwnershipError();
    }
    return this.repository.updateFeatureRequest(featureRequestId, session.user.id, validated);
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
    const validated = validateInput(DashboardRecordsQuerySchema, query);
    await this.authService.assertAuthenticated();
    return this.repository.listRecords(validated);
  }
}

export class ThemePreferenceService implements ThemePreferenceServiceInterface {
  constructor(private readonly repository: AppearancePreferenceRepositoryInterface) {}

  async getPreference(): Promise<AppearancePreference> {
    return this.repository.getPreference();
  }

  async savePreference(preference: AppearancePreference): Promise<AppearancePreference> {
    const validated = validateInput(AppearancePreferenceSchema, preference);
    return this.repository.savePreference(validated);
  }
}
