'use client';

import Link from 'next/link';
import { Hammer } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-slate-950">
            <Hammer className="h-4 w-4" />
          </span>
          Forja OS
        </Link>
      </div>
    </header>
  );
}
