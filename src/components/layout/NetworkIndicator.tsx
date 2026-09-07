'use client';

import { Cloud, CloudOff } from 'lucide-react';
import { useOnline } from '@/hooks/use-online';

export function NetworkIndicator() {
  const online = useOnline();

  if (online) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <Cloud className="h-4 w-4 text-emerald-400" />
        En línea
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
      <span className="h-2 w-2 rounded-full bg-amber-400" />
      <CloudOff className="h-4 w-4 text-amber-400" />
      Sin conexión
    </span>
  );
}
