import type {
  AppearancePreferenceRepositoryInterface,
  AuthSessionRepositoryInterface,
  DashboardRepositoryInterface,
  FeatureRequestRepositoryInterface,
  UserRepositoryInterface,
} from '../repositories/interfaces';
import {
  AuthService,
  DashboardService,
  FeatureRequestService,
  ThemePreferenceService,
  UserService,
} from '../services/implementations';
import type {
  AuthServiceInterface,
  DashboardServiceInterface,
  FeatureRequestServiceInterface,
  ThemePreferenceServiceInterface,
  UserServiceInterface,
} from '../services/interfaces';

export type ServiceContainer = {
  repositories: {
    authSessionRepository: AuthSessionRepositoryInterface;
    userRepository: UserRepositoryInterface;
    featureRequestRepository: FeatureRequestRepositoryInterface;
    dashboardRepository: DashboardRepositoryInterface;
    appearancePreferenceRepository: AppearancePreferenceRepositoryInterface;
  };
  services: {
    authService: AuthServiceInterface;
    userService: UserServiceInterface;
    featureRequestService: FeatureRequestServiceInterface;
    dashboardService: DashboardServiceInterface;
    themePreferenceService: ThemePreferenceServiceInterface;
  };
};

export type ServiceContainerDependencies = ServiceContainer['repositories'];

export function createServiceContainer(
  dependencies: ServiceContainerDependencies,
): ServiceContainer {
  const authService = new AuthService(dependencies.authSessionRepository);
  const userService = new UserService(dependencies.userRepository, authService);
  const featureRequestService = new FeatureRequestService(
    dependencies.featureRequestRepository,
    authService,
  );
  const dashboardService = new DashboardService(dependencies.dashboardRepository, authService);
  const themePreferenceService = new ThemePreferenceService(
    dependencies.appearancePreferenceRepository,
  );

  return {
    repositories: dependencies,
    services: {
      authService,
      userService,
      featureRequestService,
      dashboardService,
      themePreferenceService,
    },
  };
}
