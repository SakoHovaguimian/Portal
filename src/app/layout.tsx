import type { Metadata } from 'next';
import './globals.css';

import { ThemeScript } from '@/components/ui';
import { getProjectRouting } from '@/config/getProjectRouting';
import { projectConfiguration } from '@/config/projectConfiguration';
import type { ChildrenProps } from '@/models/childrenProps';
import { RuntimeProvider } from '@/providers/RuntimeProvider';
import { AnalyticsProvider } from '@/services/analytics/components/AnalyticsProvider';
import { getEffectiveRuntime } from '@/services/demo/demoRuntime';
import { CookieConsentBanner } from '@/services/privacy/components/CookieConsentBanner';
import { strings } from '@/strings';
import { themeFontVariables } from '@/themes/fonts';

export const metadata: Metadata = {
  title: { default: strings.app.name, template: `%s | ${strings.app.name}` },
  description: strings.app.description,
  ...(projectConfiguration.branding.iconPath
    ? { icons: { icon: projectConfiguration.branding.iconPath } }
    : {}),
};

export default async function RootLayout({
  children,
}: ChildrenProps) {

  const runtime = await getEffectiveRuntime();
  return (
    <html
      className={themeFontVariables}
      lang="en"
      data-scroll-behavior="smooth"
      data-theme={projectConfiguration.appearance.mode}
      data-theme-id={projectConfiguration.appearance.themeId}
      suppressHydrationWarning
    >
      <body className="bg-primary text-primary antialiased">
        <ThemeScript />
        <RuntimeProvider config={runtime} routing={getProjectRouting()}>
          <AnalyticsProvider />
          {children}
          <CookieConsentBanner />
        </RuntimeProvider>
      </body>
    </html>
  );

}
