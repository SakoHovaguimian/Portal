import type { Metadata } from 'next';
import './globals.css';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { RuntimeProvider } from '@/providers/RuntimeProvider';
import { AnalyticsProvider } from '@/services/analytics/components/AnalyticsProvider';
import { CookieConsentControls } from '@/services/privacy/components/CookieConsentControls';
import { strings } from '@/strings';
import type { ChildrenProps } from '@/models/childrenProps';
import {
  Bricolage_Grotesque,
  Fraunces,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Plus_Jakarta_Sans,
  Sora,
} from 'next/font/google';
import { ThemeScript } from '@/components/ui';

export const metadata: Metadata = {
  title: { default: strings.app.name, template: `%s | ${strings.app.name}` },
  description: strings.app.description,
};

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-portal-body',
});
const headingFont = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-portal-display',
  weight: ['500', '600', '700'],
});
const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-portal-mono',
});
// Theme-specific families download only when a selected preset renders them.
const jakartaFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-portal-jakarta',
  preload: false,
});
const frauncesFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-portal-fraunces',
  axes: ['opsz'],
  preload: false,
});
const geistMonoFont = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-portal-geist-mono',
  preload: false,
});
const bricolageFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-portal-bricolage',
  preload: false,
});
const soraFont = Sora({
  subsets: ['latin'],
  variable: '--font-portal-sora',
  preload: false,
});
const fontVariables = [
  bodyFont,
  headingFont,
  monoFont,
  jakartaFont,
  frauncesFont,
  geistMonoFont,
  bricolageFont,
  soraFont,
]
  .map((font) => font.variable)
  .join(' ');

export default async function RootLayout({
  children,
}: ChildrenProps) {

  const runtime = await getEffectiveRuntime();
  return (
    <html
      className={fontVariables}
      lang="en"
      data-scroll-behavior="smooth"
      data-theme="light"
      data-theme-id="portal"
      suppressHydrationWarning
    >
      <body className="bg-primary text-primary antialiased">
        <ThemeScript />
        <RuntimeProvider config={runtime}>
          <AnalyticsProvider />
          {children}
          <CookieConsentControls />
        </RuntimeProvider>
      </body>
    </html>
  );

}
