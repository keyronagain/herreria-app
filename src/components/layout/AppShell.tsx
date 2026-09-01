'use client';

import { useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { seedInitialData } from '@/data/seed';

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    void seedInitialData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
