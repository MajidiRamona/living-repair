import { Fraunces, Inter } from 'next/font/google';

// Self-hosted via next/font instead of a Google Fonts <link> tag — no external request,
// no render-blocking stylesheet, automatic subsetting. `.style.fontFamily` below is the
// resolved literal family name, needed anywhere text is drawn to a <canvas> (Chart.js),
// since canvas font strings can't reference CSS custom properties.
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});
