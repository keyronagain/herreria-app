'use client';

import Link from 'next/link';
import { Hammer } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forge-edge/50 bg-forge-charcoal">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-forge-platinum"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-forge-red">
            <Hammer className="h-4 w-4 text-white" />
          </span>
          Forja OS
        </Link>
      </div>
    </header>
  );
}
