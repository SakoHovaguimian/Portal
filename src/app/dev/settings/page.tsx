import { strings } from '@/content/strings'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import packageJson from '../../../../package.json'
import { DevSettingsPage } from '@/modules/devSettings/components/devSettingsPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: strings.metadata.devSettingsPage.developerSettings,
  robots: { index: false, follow: false },
}

export default function DevSettingsRoute() {

  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return (
    <DevSettingsPage
      versions={{
        app: packageJson.version,
        next: packageJson.dependencies.next,
        react: packageJson.dependencies.react,
        astryx: packageJson.dependencies['@astryxdesign/core'],
      }}
    />
  )
}
