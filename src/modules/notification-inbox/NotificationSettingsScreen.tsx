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

import { NotificationPreferencesEditor } from './components/NotificationPreferencesEditor';
import { NotificationTimezoneEditor } from './components/NotificationTimezoneEditor';
import { useNotificationPreferences, useNotificationSettings } from './hooks';
import type { NotificationPreference } from './models/notificationPreference';

export function NotificationSettingsScreen() {

  const preferences = useNotificationPreferences();
  const settings = useNotificationSettings();
  const { confirmNavigation } = useNavigationGuard();

  function refreshPreferences() {

    if (!preferences.isFetching) { void preferences.refetch(); }

  }

  function renderHeader() {

    return (
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
    );

  }

  function renderPreferenceContent(items: NotificationPreference[]) {

    if (items.length) {
      return <NotificationPreferencesEditor initial={items} />;
    }
    return (
      <EmptyState
        variant="plain"
        title={copy.noPreferencesTitle}
        description={copy.noPreferencesHint}
        action={
          <Button
            variant="secondary"
            loading={preferences.isFetching}
            onClick={refreshPreferences}
          >
            {copy.refreshAction}
          </Button>
        }
      />
    );

  }

  function renderPreferencesSection() {

    return (
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
          {(items) => renderPreferenceContent(items)}
        </QueryBoundary>
      </SplitSection>
    );

  }

  function renderTimezoneSection() {

    return (
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
    );

  }

  function renderBrowserSection() {

    return (
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
    );

  }

  function renderSections() {

    return (
      <SectionStack>
        {renderPreferencesSection()}
        {renderTimezoneSection()}
        {renderBrowserSection()}
      </SectionStack>
    );

  }

  return (
    <Page>
      {renderHeader()}
      {renderSections()}
    </Page>
  );

}
