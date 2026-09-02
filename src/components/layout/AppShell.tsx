'use client';

import { useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { seedInitialData } from '@/data/seed';

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void seedInitialData();

    if (!('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;
    let montado = true;

    const revalidar = () => registration?.update();
    const onVisibilidad = () => {
      if (document.visibilityState === 'visible') revalidar();
    };

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        if (!montado) return;
        registration = reg;
        window.addEventListener('focus', revalidar);
        document.addEventListener('visibilitychange', onVisibilidad);
      })
      .catch(() => {});

    return () => {
      montado = false;
      window.removeEventListener('focus', revalidar);
      document.removeEventListener('visibilitychange', onVisibilidad);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
