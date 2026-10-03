'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Scissors,
  FolderKanban,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/materiales', label: 'Materiales', icon: Layers },
  { href: '/calculadora', label: 'Cortes', icon: Scissors },
  { href: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { href: '/cotizaciones', label: 'Cotizar', icon: FileText },
  { href: '/configuracion', label: 'Ajustes', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-forge-edge/50 bg-forge-charcoal">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium transition-colors',
                activo ? 'text-forge-red' : 'text-forge-ghost hover:text-forge-muted',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
