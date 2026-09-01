'use client';

import Link from 'next/link';
import { Hammer } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
            <Hammer className="h-4 w-4" />
          </span>
          Herrería
        </Link>
        <span className="text-xs font-medium text-slate-400">PWA · Offline</span>
      </div>
    </header>
  );
}
