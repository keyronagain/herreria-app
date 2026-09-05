import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Herrería',
  description:
    'Gestión de taller de herrería: catálogo, optimización de cortes y cotizaciones. 100% offline.',
  applicationName: 'Herrería',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Herrería',
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-900 text-slate-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
