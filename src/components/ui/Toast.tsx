'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

export function Toast() {
  const toast = useUIStore((s) => s.toast);
  const limpiarToast = useUIStore((s) => s.limpiarToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => limpiarToast(), 3500);
    return () => clearTimeout(t);
  }, [toast, limpiarToast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-lg">
        <span className="flex-1">{toast}</span>
        <button
          onClick={limpiarToast}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-200"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
