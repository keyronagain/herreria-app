'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  className?: string;
}

export function Modal({
  abierto,
  onCerrar,
  titulo,
  children,
  className,
}: ModalProps) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 sm:items-center"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-forge-surface p-5 sm:max-w-md sm:rounded-lg',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-forge-edge/60 pb-3">
          <h2 className="text-base font-semibold text-forge-platinum">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-forge-ghost hover:bg-forge-elevated hover:text-forge-platinum"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
