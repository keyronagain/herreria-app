'use client';

import Link from 'next/link';
import {
  Layers,
  Scissors,
  FolderKanban,
  FileText,
  Settings,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface Seccion {
  href: string;
  titulo: string;
  desc: string;
  icon: LucideIcon;
}

const primaria: Seccion = {
  href: '/calculadora',
  titulo: 'Optimización de cortes',
  desc: 'Calcula barras necesarias, minimiza desperdicios y genera cotizaciones',
  icon: Scissors,
};

const secundarias: Seccion[] = [
  { href: '/cotizaciones', titulo: 'Cotizaciones', desc: 'Con material, insumos, mano de obra e IVA', icon: FileText },
  { href: '/proyectos',    titulo: 'Proyectos',    desc: 'Trabajos guardados',                        icon: FolderKanban },
  { href: '/materiales',   titulo: 'Materiales',   desc: 'Catálogo de perfiles y precios',            icon: Layers },
  { href: '/configuracion',titulo: 'Configuración',desc: 'Taller, insumos, mano de obra, IVA',        icon: Settings },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-forge-platinum">Forja OS</h1>
        <p className="mt-0.5 text-sm text-forge-muted">Gestión de cortes, materiales y cotizaciones</p>
      </div>

      {/* Acción principal */}
      <Link
        href={primaria.href}
        className="group mb-3 flex items-center gap-4 rounded-lg border border-forge-red/40 bg-forge-surface p-5 transition-colors hover:border-forge-red hover:bg-forge-elevated"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-forge-red text-white">
          <primaria.icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <h2 className="font-semibold text-forge-platinum">{primaria.titulo}</h2>
          <p className="mt-0.5 text-sm text-forge-muted">{primaria.desc}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-forge-red transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* Secciones secundarias */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {secundarias.map(({ href, titulo, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-lg border border-forge-edge bg-forge-surface p-4 transition-colors hover:border-forge-edge/80 hover:bg-forge-elevated"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-forge-elevated text-forge-muted transition-colors group-hover:bg-forge-edge group-hover:text-forge-platinum">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-forge-platinum">{titulo}</h2>
              <p className="truncate text-xs text-forge-muted">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-forge-ghost" />
          </Link>
        ))}
      </div>
    </div>
  );
}
