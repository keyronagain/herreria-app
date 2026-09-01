import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icono?: ReactNode;
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

export function EmptyState({
  icono,
  titulo,
  descripcion,
  accion,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icono && <div className="text-slate-300">{icono}</div>}
      <h3 className="text-base font-medium text-slate-700">{titulo}</h3>
      {descripcion && (
        <p className="max-w-xs text-sm text-slate-500">{descripcion}</p>
      )}
      {accion && <div className="mt-3">{accion}</div>}
    </div>
  );
}
