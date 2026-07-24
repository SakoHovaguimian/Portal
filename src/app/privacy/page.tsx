import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { LegalPage } from '@/modules/legal/components/legalPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: strings.shared.privacyPolicy,
  description: strings.metadata.privacyPage.description,
}

export default function PrivacyPage() {
  return <LegalPage title={strings.shared.privacyPolicy} context="privacy" />
}
