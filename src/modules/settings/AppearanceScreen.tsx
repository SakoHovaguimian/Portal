'use client';

import Link from 'next/link';

import {
  Button,
  Page,
  PageHeader,
  PageSection,
  SplitSection,
  UiIcon,
} from '@/components/ui';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { NotificationControls } from '@/services/notifications/components/NotificationControls';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';
import { strings, portalOverlayMotionStrings } from '@/strings';

import { OverlayMotionControls } from './components/OverlayMotionControls';
import { ThemeControls } from './components/ThemeControls';

export function AppearanceScreen() {

  const { devSettingsEnabled } = useRuntimeConfig();

  return (
    <Page>
      <PageHeader
        title={strings.ui.appearanceScreen.appearance}
        description={strings.designSystem.themeStudio.description}
        action={devSettingsEnabled && (
          <Button asChild variant="secondary">
            <Link href="/dev-settings/components">
              <UiIcon name="code" />
              {strings.designSystem.openLibrary}
            </Link>
          </Button>
        )}
      />
      <PageSection
        id="theme"
        title={strings.designSystem.themeStudio.title}
        description={strings.designSystem.themeHint}
      >
        <ThemeControls />
      </PageSection>
      <PageSection
        id="overlay-motion"
        title={portalOverlayMotionStrings.title}
        description={portalOverlayMotionStrings.description}
      >
        <OverlayMotionControls />
      </PageSection>
      <SplitSection
        id="notifications"
        title={strings.notifications.title}
        description={strings.notifications.availableHint}
      >
        <NotificationControls />
      </SplitSection>
      <SplitSection
        id="privacy"
        title={strings.privacy.title}
      >
        <CookieConsentControls settings />
      </SplitSection>
    </Page>
  );

}
