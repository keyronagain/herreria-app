import { cn } from '@/lib/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-xl bg-slate-700/60 motion-reduce:animate-none',
        className,
      )}
    />
  );
}

export function ListaSkeleton({ filas = 4 }: { filas?: number }) {
  return (
    <ul role="status" aria-label="Cargando" className="space-y-2">
      {Array.from({ length: filas }, (_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-11 w-11 shrink-0" />
          <Skeleton className="h-11 w-11 shrink-0" />
        </li>
      ))}
    </ul>
  );
}

export function FormSkeleton({ bloques = 3 }: { bloques?: number }) {
  return (
    <div role="status" aria-label="Cargando" className="space-y-4">
      {Array.from({ length: bloques }, (_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm"
        >
          <Skeleton className="h-4 w-1/3" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </div>
        </div>
      ))}
    </div>
  );
}
