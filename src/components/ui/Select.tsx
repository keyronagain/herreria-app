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
        'h-11 w-full rounded-md border border-forge-edge bg-forge-elevated px-3 text-sm text-forge-platinum focus:border-forge-red focus:outline-none focus:ring-1 focus:ring-forge-red',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
