'use client';

import Link from 'next/link';
import {
  Layers,
  Scissors,
  FolderKanban,
  FileText,
  Settings,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const secciones: {
  href: string;
  titulo: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    href: '/materiales',
    titulo: 'Materiales',
    desc: 'Catálogo de perfiles y costos',
    icon: Layers,
  },
  {
    href: '/calculadora',
    titulo: 'Optimización de cortes',
    desc: 'Corte 1D en barras de 6 m',
    icon: Scissors,
  },
  {
    href: '/proyectos',
    titulo: 'Proyectos',
    desc: 'Trabajos guardados',
    icon: FolderKanban,
  },
  {
    href: '/cotizaciones',
    titulo: 'Cotizaciones',
    desc: 'Cotizaciones automáticas y PDF',
    icon: FileText,
  },
  {
    href: '/configuracion',
    titulo: 'Configuración',
    desc: 'Insumos, mano de obra e IVA',
    icon: Settings,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-100">Forja OS</h1>
      <p className="mt-1 text-sm text-slate-400">
        Optimizador de costos, cortes y proyectos.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {secciones.map(({ href, titulo, desc, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="flex items-center gap-4 transition hover:border-orange-500 hover:shadow">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-slate-300">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h2 className="font-semibold text-slate-100">{titulo}</h2>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
