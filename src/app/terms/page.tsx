import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { LegalPage } from '@/modules/legal/components/legalPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: strings.shared.termsOfService,
  description: strings.metadata.termsPage.description,
}

export default function TermsPage() {
  return <LegalPage title={strings.shared.termsOfService} context="terms" />
}
