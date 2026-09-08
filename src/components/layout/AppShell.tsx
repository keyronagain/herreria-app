'use client';

import { useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Toast } from '@/components/ui/Toast';
import { useUIStore } from '@/stores/ui-store';
import { seedInitialData } from '@/data/seed';

export function AppShell({ children }: { children: ReactNode }) {
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  useEffect(() => {
    const onOffline = () =>
      mostrarToast(
        'Modo sin conexión: los cambios se guardarán localmente.',
        'info',
      );
    const onOnline = () => mostrarToast('Conexión restablecida.', 'success');

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [mostrarToast]);

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
      <Toast />
    </div>
  );
}
