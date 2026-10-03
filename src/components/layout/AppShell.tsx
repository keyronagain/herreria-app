'use client';

import { type ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Toast } from '@/components/ui/Toast';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
      <Toast />
    </div>
  );
}
