'use client';

import { useState } from 'react';

import { NavigationLink } from '@/components/ui/components/NavigationLink';
import { Button, SectionStack, SplitSection, UiIcon } from '@/components/ui';
import { useSessionState } from '@/providers/AppProviders';
import { useNavigationGuard } from '@/providers/NavigationGuardProvider';
import { useRuntimeConfig } from '@/providers/RuntimeProvider';
import { canManagePlatform } from '@/services/auth/permissions';
import { portalAccountToolsStrings as copy } from '@/strings';

import { AccountDeletionDialog } from './AccountDeletionDialog';
import './accountSettings.css';

export function AccountSettings() {

  const { session } = useSessionState();
  const { confirmNavigation } = useNavigationGuard();
  const runtime = useRuntimeConfig();
  const [deleting, setDeleting] = useState(false);
  if (!session) { return null; }
  const accountSession = session;

  function renderDevicesSection() {

    return (
      <SplitSection
        id="account-devices"
        title={copy.account.devicesTitle}
        description={copy.account.devicesHint}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <NavigationLink
              beforeNavigate={confirmNavigation}
              href="/settings/devices"
            >
              {copy.account.devicesAction}
            </NavigationLink>
          </Button>
          <Button asChild variant="ghost">
            <NavigationLink beforeNavigate={confirmNavigation} href="/help">
              {copy.account.helpAction}
            </NavigationLink>
          </Button>
        </div>
      </SplitSection>
    );

  }

  function renderOperationsSection() {

    if (!canManagePlatform(accountSession.user.role)) { return null; }
    return (
      <SplitSection
        id="account-operations"
        title={copy.account.operationsTitle}
        description={copy.account.operationsHint}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <NavigationLink
              beforeNavigate={confirmNavigation}
              href="/settings/delivery-history"
            >
              {copy.deliveries.title}
            </NavigationLink>
          </Button>
        </div>
      </SplitSection>
    );

  }

  function renderDeletionSection() {

    return (
      <SplitSection
        className="portal-account-deletion"
        id="account-deletion"
        title={copy.account.deleteTitle}
        description={copy.account.deleteHint}
      >
        <div className="portal-account-deletion__heading">
          <span className="portal-account-deletion__icon" aria-hidden="true">
            <UiIcon name="warning" className="size-6" />
          </span>
          <div className="grid gap-2">
            <h3 className="m-0 text-base font-semibold text-primary">
              {copy.account.deleteCardTitle}
            </h3>
            <p className="m-0 text-sm text-secondary">
              {runtime.demoMode
                ? copy.account.demoHint
                : copy.account.deleteCardHint}
            </p>
          </div>
        </div>
        <div className="portal-account-deletion__actions">
          <Button variant="destructive" onClick={() => setDeleting(true)}>
            <UiIcon name="trash" />
            {copy.account.deleteAction}
          </Button>
        </div>
      </SplitSection>
    );

  }

  function renderDeletionDialog() {

    if (!deleting) { return null; }
    return (
      <AccountDeletionDialog
        email={accountSession.user.email}
        onClose={() => setDeleting(false)}
      />
    );

  }

  function renderContent() {

    return (
      <>
        <SectionStack>
          {renderDevicesSection()}
          {renderOperationsSection()}
          {renderDeletionSection()}
        </SectionStack>
        {renderDeletionDialog()}
      </>
    );

  }

  return renderContent();

}
