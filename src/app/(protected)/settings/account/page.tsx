import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Page, PageHeader } from '@/components/ui';
import { AccountSettings } from '@/modules/account-tools/components/AccountSettings';
import { portalIntegrationStrings as copy } from '@/strings';
import { portalModules } from '@/config/portalModules';

export const metadata: Metadata = { title: copy.accountTitle };

export default function AccountPage() {

  if (!portalModules.accountTools) { notFound(); }
  return (
    <Page>
      <PageHeader
        title={copy.accountTitle}
        description={copy.accountDescription}
      />
      <AccountSettings />
    </Page>
  );

}
