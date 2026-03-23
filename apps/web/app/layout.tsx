import './globals.css';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ThemeScript } from '@semantic-web/ui';

const bodyFont = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-body' });
const headingFont = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-accent="aqua" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} bg-primary text-primary antialiased`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
