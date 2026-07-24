import { strings } from '@/content/strings'
import type { CSSProperties } from 'react'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import {
  ThemeModeCookieName,
  isThemeMode,
  themeModeBootstrapScript,
} from '@/components/theme/themeMode'
import { portalTheme } from '@/theme/generated/portal'
import { Providers } from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const portalRootThemeStyle = portalTheme.tokens as unknown as CSSProperties

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'),
  title: {
    default: strings.metadata.layout.title,
    template: strings.metadata.layout.titleTemplate,
  },
  description: strings.metadata.layout.description,
  keywords: [
    strings.metadata.layout.template,
    strings.metadata.layout.nextjsStarter,
    strings.metadata.layout.authenticatedPortal,
    strings.metadata.layout.designSystem,
  ],
  applicationName: strings.shared.portal,
  authors: [{ name: strings.shared.portal }],
  creator: strings.shared.portal,
  publisher: strings.shared.portal,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: strings.shared.portal,
    title: strings.metadata.layout.title,
    description: strings.metadata.layout.description,
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: strings.metadata.layout.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: strings.metadata.layout.title,
    description: strings.metadata.layout.description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F8F8' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1220' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const storedThemeMode = (await cookies()).get(ThemeModeCookieName)?.value
  const initialThemeMode = isThemeMode(storedThemeMode) ? storedThemeMode : 'system'

  return (
    <html
      lang="en"
      data-astryx-theme={portalTheme.name}
      data-theme={initialThemeMode === 'system' ? undefined : initialThemeMode}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={portalRootThemeStyle}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeModeBootstrapScript }} />
      </head>
      <body className="min-h-full bg-body text-primary">
        <Providers initialThemeMode={initialThemeMode}>{children}</Providers>
      </body>
    </html>
  )
}
