import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'CampusLink — Find Your Match',
  description: 'The premium dating platform for Kenyan students. Find meaningful connections near you.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CampusLink',
  },
  openGraph: {
    title: 'CampusLink — Find Your Match',
    description: 'The premium dating platform for Kenyan students.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#FF3366',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} font-body bg-white dark:bg-[#0A0A0F] text-gray-900 dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
