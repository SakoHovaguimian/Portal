// Foundational services
import { BrowserApiClient } from '@/services/api/browserApiClient';
import { PublicImageService } from '@/services/media/publicImageService';
import { PresentationMotionPreferenceService } from '@/services/presentation-motion/presentationMotionPreferenceService';

// Account tools
import { AccountToolsService } from '@/modules/account-tools/services/accountToolsService';

// Background jobs
import { BackgroundJobService } from '@/modules/background-jobs/services/backgroundJobService';

// Blog
import { BlogService } from '@/modules/blog/services/blogService';

// Chat
import { ChatService } from '@/modules/chat/services/chatService';

// Dashboard
import { DashboardService } from '@/modules/dashboard/services/dashboardService';

// Dev settings
import { DevSettingsService } from '@/modules/dev-settings/services/devSettingsService';

// Engagement
import { EngagementService } from '@/modules/engagement/services/engagementService';

// Feature requests
import { FeatureRequestService } from '@/modules/feature-requests/services/featureRequestService';

// Notification inbox
import { NotificationInboxService } from '@/modules/notification-inbox/services/notificationInboxService';

// Onboarding
import { OnboardingService } from '@/modules/onboarding/services/onboardingService';

// Settings
import { MotionPreferenceService } from '@/modules/settings/services/motionPreferenceService';
import { ThemePreferenceService } from '@/modules/settings/services/themePreferenceService';

// Users
import { UserService } from '@/modules/users/services/userService';

export class ClientServiceContainer {

  readonly apiClient = new BrowserApiClient();
  readonly userService = new UserService(this.apiClient);
  readonly featureRequestService = new FeatureRequestService(this.apiClient);
  readonly dashboardService = new DashboardService(this.apiClient);
  readonly themePreferenceService = new ThemePreferenceService();
  readonly motionPreferenceService = new MotionPreferenceService();
  readonly presentationMotionPreferenceService = new PresentationMotionPreferenceService();
  readonly chatService = new ChatService(this.apiClient);
  readonly backgroundJobService = new BackgroundJobService(this.apiClient);
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
