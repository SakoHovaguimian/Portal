'use client';
import {
  Button,
  buttonClassName,
  EmptyState,
  InlineLoading,
  Page,
  PageHeader,
  QueryBoundary,
  SectionStack,
  SplitSection,
} from '@/components/ui';
import { NavigationLink } from '@/components/ui/components/NavigationLink';
import { useNavigationGuard } from '@/providers/NavigationGuardProvider';
import { portalNotificationInboxStrings as copy } from '@/strings';
import { useNotificationPreferences, useNotificationSettings } from './hooks';
import { NotificationPreferencesEditor } from './components/NotificationPreferencesEditor';
import { NotificationTimezoneEditor } from './components/NotificationTimezoneEditor';

export function NotificationSettingsScreen() {
  const preferences = useNotificationPreferences();
  const settings = useNotificationSettings();
  const { confirmNavigation } = useNavigationGuard();
  return (
    <Page>
      <PageHeader
        title={copy.preferencesTitle}
        description={copy.preferencesDescription}
        action={
          <NavigationLink
            href="/notifications"
            beforeNavigate={confirmNavigation}
            className={buttonClassName('secondary')}
          >
            {copy.inboxAction}
          </NavigationLink>
        }
      />
      <SectionStack>
        <SplitSection
          id="notification-preferences"
          title={copy.deliveryTitle}
          description={copy.deliveryDescription}
        >
          <QueryBoundary
            query={preferences}
            loadingFallback={<InlineLoading />}
            retainDataOnError
          >
            {(items) =>
              items.length ? (
                <NotificationPreferencesEditor initial={items} />
              ) : (
                <EmptyState
                  variant="plain"
                  title={copy.noPreferencesTitle}
                  description={copy.noPreferencesHint}
                  action={
                    <Button
                      variant="secondary"
                      loading={preferences.isFetching}
                      onClick={() => {
                        if (!preferences.isFetching) void preferences.refetch();
                      }}
                    >
                      {copy.refreshAction}
                    </Button>
                  }
                />
              )
            }
          </QueryBoundary>
        </SplitSection>
        <SplitSection
          id="notification-timezone-settings"
          title={copy.timezoneTitle}
          description={copy.timezoneDescription}
        >
          <QueryBoundary
            query={settings}
            loadingFallback={<InlineLoading />}
            retainDataOnError
          >
            {(value) => (
              <NotificationTimezoneEditor key={value.userId} initial={value} />
            )}
          </QueryBoundary>
        </SplitSection>
        <SplitSection
          id="notification-browser"
          title={copy.browserTitle}
          description={copy.browserDescription}
        >
          <NavigationLink
            href="/settings/appearance"
            beforeNavigate={confirmNavigation}
            className={buttonClassName('secondary')}
          >
            {copy.browserAction}
          </NavigationLink>
        </SplitSection>
      </SectionStack>
    </Page>
  );
}
