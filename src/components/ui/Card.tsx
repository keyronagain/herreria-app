import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const INTERACTIVE_CARD =
  'transition duration-150 hover:-translate-y-px hover:border-orange-500/50 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm',
        interactive && INTERACTIVE_CARD,
        className,
      )}
      {...props}
    />
  );
}
