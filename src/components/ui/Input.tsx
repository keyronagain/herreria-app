import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-forge-edge bg-forge-elevated px-3 text-sm text-forge-platinum placeholder:text-forge-ghost focus:border-forge-red focus:outline-none focus:ring-1 focus:ring-forge-red',
        className,
      )}
      {...props}
    />
  );
}
