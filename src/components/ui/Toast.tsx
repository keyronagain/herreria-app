'use client';

import { useEffect } from 'react';
import { X, CheckCircle, Info, AlertCircle, type LucideIcon } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

const VARIANTES: Record<
  string,
  { borde: string; Icono: LucideIcon; icono: string }
> = {
  info: { borde: 'border-amber-500/40', Icono: Info, icono: 'text-amber-400' },
  success: {
    borde: 'border-emerald-500/40',
    Icono: CheckCircle,
    icono: 'text-emerald-400',
  },
  error: {
    borde: 'border-red-500/40',
    Icono: AlertCircle,
    icono: 'text-red-400',
  },
};

export function Toast() {
  const toast = useUIStore((s) => s.toast);
  const limpiarToast = useUIStore((s) => s.limpiarToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => limpiarToast(), 3500);
    return () => clearTimeout(t);
  }, [toast, limpiarToast]);

  if (!toast) return null;

  const { borde, Icono, icono } = VARIANTES[toast.tipo] ?? VARIANTES.info;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <div
        className={`pointer-events-auto flex max-w-md items-center gap-2 rounded-xl border bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-lg ${borde}`}
      >
        <Icono className={`h-5 w-5 shrink-0 ${icono}`} />
        <span className="flex-1">{toast.mensaje}</span>
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
