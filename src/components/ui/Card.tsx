import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
