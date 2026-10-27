'use client';

import { formatCRC, formatMedida } from '@/lib/utils/format';
import type { ResultadoOptimizacion } from '@/types';

interface Props {
  resultado: ResultadoOptimizacion;
  costoBarra?: number;
}

function StatBox({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-center">
      <p className="text-xs text-slate-400">{etiqueta}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-100">{valor}</p>
    </div>
  );
}

function textoUtilizacion(pct: number): string {
  if (pct >= 90) return 'text-emerald-400';
  if (pct >= 75) return 'text-orange-400';
  return 'text-red-400';
}

export function VistaBarras({ resultado, costoBarra }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatBox etiqueta="Barras" valor={String(resultado.totalBarras)} />
        <StatBox etiqueta="Piezas" valor={String(resultado.totalPiezas)} />
        <StatBox
          etiqueta="Sobrante"
          valor={formatMedida(resultado.sobranteTotal)}
        />
        <StatBox etiqueta="Utilización" valor={`${resultado.utilizacionPct}%`} />
        {costoBarra != null && (
          <StatBox
            etiqueta="Costo material"
            valor={formatCRC(resultado.totalBarras * costoBarra)}
          />
        )}
      </div>

      {resultado.empates ? (
        <p className="break-words rounded-xl border border-orange-500/40 bg-orange-900/20 px-3 py-2 text-sm text-orange-300">
          {resultado.empates}{' '}
          {resultado.empates === 1
            ? 'empate de soldadura necesario'
            : 'empates de soldadura necesarios'}
          . Las piezas marcadas como tramo se unen soldando.
        </p>
      ) : null}

      <div className="space-y-3">
        {resultado.patrones.map((b, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-700 bg-slate-800 p-4"
          >
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-300">Barra {i + 1}</span>
              <span className="text-slate-400">
                sobrante {formatMedida(b.sobrante)} ·{' '}
                <span className={textoUtilizacion(b.utilizacionPct)}>
                  {b.utilizacionPct}%
                </span>
              </span>
            </div>

            <div className="flex h-7 w-full overflow-hidden rounded-lg bg-slate-700">
              {b.cortes.map((c, j) => (
                <div
                  key={j}
                  className={`flex items-center justify-center overflow-hidden whitespace-nowrap text-[10px] font-medium text-white ${
                    j % 2 === 0 ? 'bg-orange-500' : 'bg-orange-600'
                  }`}
                  style={{ width: `${(c.largo / b.largoBarra) * 100}%` }}
                  title={`${c.descripcion}: ${formatMedida(c.largo)}`}
                >
                  {formatMedida(c.largo)}
                </div>
              ))}
              {b.sobrante > 0 && (
                <div
                  className="bg-slate-600"
                  style={{ width: `${(b.sobrante / b.largoBarra) * 100}%` }}
                  title={`Sobrante ${formatMedida(b.sobrante)}`}
                />
              )}
            </div>

            <ul className="mt-2 space-y-0.5 text-xs text-slate-400">
              {b.cortes.map((c, j) => (
                <li key={j} className="flex justify-between">
                  <span className="break-words">{c.descripcion}</span>
                  <span className="ml-2 shrink-0">{formatMedida(c.largo)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
