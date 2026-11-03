import { BrowserApiClient } from '@/services/api/browserApiClient';
import { UserService } from '@/modules/users/services/userService';
import { FeatureRequestService } from '@/modules/feature-requests/services/featureRequestService';
import { DashboardService } from '@/modules/dashboard/services/dashboardService';
import { ThemePreferenceService } from '@/modules/settings/services/themePreferenceService';
import { MotionPreferenceService } from '@/modules/settings/services/motionPreferenceService';
import { ChatService } from '@/modules/chat/services/chatService';
import { BlogService } from '@/modules/blog/services/blogService';
import { PublicImageService } from '@/services/media/publicImageService';
import { NotificationInboxService } from '@/modules/notification-inbox/services/notificationInboxService';
import { AccountToolsService } from '@/modules/account-tools/services/accountToolsService';
import { OnboardingService } from '@/modules/onboarding/services/onboardingService';
import { DevSettingsService } from '@/modules/dev-settings/services/devSettingsService';
import { EngagementService } from '@/modules/engagement/services/engagementService';

export class ClientServiceContainer {

  readonly apiClient = new BrowserApiClient();
  readonly userService = new UserService(this.apiClient);
  readonly featureRequestService = new FeatureRequestService(this.apiClient);
  readonly dashboardService = new DashboardService(this.apiClient);
  readonly themePreferenceService = new ThemePreferenceService();
  readonly motionPreferenceService = new MotionPreferenceService();
  readonly chatService = new ChatService(this.apiClient);
  readonly blogService = new BlogService(this.apiClient);
  readonly publicImageService = new PublicImageService(this.apiClient);
  readonly notificationInboxService = new NotificationInboxService(
    this.apiClient,
  );
  readonly accountToolsService = new AccountToolsService(this.apiClient);
  readonly onboardingService = new OnboardingService(this.apiClient);
  readonly engagementService = new EngagementService(this.apiClient);
  readonly devSettingsService = new DevSettingsService(
    new BrowserApiClient('/api/dev-settings'),
  );

}
