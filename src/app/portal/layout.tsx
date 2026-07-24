import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ServerEnvironment } from '@/config/environment'
import { container } from '@/container'
import { PortalShell } from '@/modules/portal/components/portalShell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: strings.shared.portal,
  robots: { index: false, follow: false },
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {

  const authMode = ServerEnvironment.authMode

  if (authMode === 'firebase') {

    const session = await container.sessionService.getSession()

    if (!session) {
      redirect('/login')
    }

  }

  if (authMode === 'custom') {
    redirect('/login')
  }

  return <PortalShell authMode={authMode}>{children}</PortalShell>

}
