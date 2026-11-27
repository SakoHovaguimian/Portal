import {
  Bricolage_Grotesque,
  Fraunces,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Plus_Jakarta_Sans,
  Sora,
} from 'next/font/google';

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
// Families with preload disabled download when rendered.
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
const instrumentSansFont = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-portal-instrument-sans',
  preload: false,
});

export const themeFontVariables = [
  bodyFont,
  headingFont,
  monoFont,
  jakartaFont,
  frauncesFont,
  geistMonoFont,
  bricolageFont,
  soraFont,
  instrumentSansFont,
]
  .map((font) => font.variable)
  .join(' ');
