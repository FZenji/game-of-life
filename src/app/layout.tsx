import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Game of Life | Henry Tolenaar',
  description: 'A sleek, interactive Conway\'s Game of Life simulation with glassmorphism UI. Developed by Henry Tolenaar.',
  authors: [{ name: 'Henry Tolenaar' }],
  keywords: ['Game of Life', 'Simulation', 'Cellular Automata', 'Glassmorphism', 'React', 'Next.js'],
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
