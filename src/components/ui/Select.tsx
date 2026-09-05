import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
