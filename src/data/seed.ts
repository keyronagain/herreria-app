import type { SupabaseClient } from '@supabase/supabase-js';
import { uid } from '@/lib/utils/id';
import { CONFIG_ID, CONFIG_DEFAULT } from '@/constants';
import type { ConfiguracionTaller, Insumo, Material, TipoPerfil } from '@/types';

export const LARGO_BARRA_CM = 600;

interface SeedMaterial {
  nombre: string;
  tipo: TipoPerfil;
  dims: Material['dims'];
  precioBarra: number;
  categoria?: string;
}

export const CATALOGO: SeedMaterial[] = [
  { nombre: 'PTR 1x1 cal.18', tipo: 'PTR', dims: { ancho: 2.54, alto: 2.54, espesor: 0.12 }, precioBarra: 6500, categoria: 'PTR' },
  { nombre: 'PTR 2x1 cal.18', tipo: 'PTR', dims: { ancho: 5.08, alto: 2.54, espesor: 0.12 }, precioBarra: 9800, categoria: 'PTR' },
  { nombre: 'PTR 2x1 cal.14', tipo: 'PTR', dims: { ancho: 5.08, alto: 2.54, espesor: 0.18 }, precioBarra: 14500, categoria: 'PTR' },
  { nombre: 'PTR 2x2 cal.14', tipo: 'PTR', dims: { ancho: 5.08, alto: 5.08, espesor: 0.18 }, precioBarra: 18900, categoria: 'PTR' },
  { nombre: 'PTR 3x1.5 cal.14', tipo: 'PTR', dims: { ancho: 7.62, alto: 3.81, espesor: 0.18 }, precioBarra: 22500, categoria: 'PTR' },
  { nombre: 'PTR 3x3 cal.11', tipo: 'PTR', dims: { ancho: 7.62, alto: 7.62, espesor: 0.29 }, precioBarra: 38000, categoria: 'PTR' },
  { nombre: 'PTR 4x2 cal.11', tipo: 'PTR', dims: { ancho: 10.16, alto: 5.08, espesor: 0.29 }, precioBarra: 41000, categoria: 'PTR' },
  { nombre: 'Tubo cuadrado 1" cal.18', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.54, alto: 2.54, espesor: 0.12 }, precioBarra: 7200, categoria: 'Tubo' },
  { nombre: 'Tubo cuadrado 1.5" cal.14', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.81, alto: 3.81, espesor: 0.18 }, precioBarra: 12500, categoria: 'Tubo' },
  { nombre: 'Tubo redondo 1" cal.18', tipo: 'TUBO_REDONDO', dims: { diametro: 2.54, espesor: 0.12 }, precioBarra: 6800, categoria: 'Tubo' },
  { nombre: 'Tubo redondo 1.5" cal.14', tipo: 'TUBO_REDONDO', dims: { diametro: 3.81, espesor: 0.18 }, precioBarra: 11900, categoria: 'Tubo' },
  { nombre: 'Ángulo 1"x1/8"', tipo: 'ANGULO', dims: { ancho: 2.54, espesor: 0.32 }, precioBarra: 8500, categoria: 'Ángulo' },
  { nombre: 'Ángulo 1.5"x3/16"', tipo: 'ANGULO', dims: { ancho: 3.81, espesor: 0.48 }, precioBarra: 13800, categoria: 'Ángulo' },
  { nombre: 'Platina 1"x1/4"', tipo: 'PLATINA', dims: { ancho: 2.54, espesor: 0.64 }, precioBarra: 7500, categoria: 'Platina' },
  { nombre: 'Platina 2"x1/4"', tipo: 'PLATINA', dims: { ancho: 5.08, espesor: 0.64 }, precioBarra: 13200, categoria: 'Platina' },
  { nombre: 'Solera 1"x1/8"', tipo: 'SOLERA', dims: { ancho: 2.54, espesor: 0.32 }, precioBarra: 5900, categoria: 'Solera' },
  { nombre: 'Solera 1.5"x3/16"', tipo: 'SOLERA', dims: { ancho: 3.81, espesor: 0.48 }, precioBarra: 9600, categoria: 'Solera' },
  { nombre: 'Varilla 3/8"', tipo: 'VARILLA', dims: { diametro: 0.95 }, precioBarra: 4800, categoria: 'Varilla' },
  { nombre: 'Varilla 1/2"', tipo: 'VARILLA', dims: { diametro: 1.27 }, precioBarra: 7900, categoria: 'Varilla' },
];

const INSUMOS_DEFAULT: Omit<Insumo, 'id'>[] = [
  { nombre: 'Electrodo 6013 (kg)', costoUnitario: 5500, unidad: 'kg', modoConsumo: 'por_kg', factor: 1 },
  { nombre: 'Disco de corte 4.5"', costoUnitario: 1800, unidad: 'pieza', modoConsumo: 'por_pieza', factor: 1 },
  { nombre: 'Pintura anticorrosiva (galón)', costoUnitario: 18500, unidad: 'galón', modoConsumo: 'metro_lineal', factor: 0.01 },
  { nombre: 'Thinner (galón)', costoUnitario: 9500, unidad: 'galón', modoConsumo: 'metro_lineal', factor: 0.005 },
];

export async function seedMateriales(sb: SupabaseClient): Promise<Material[]> {
  const now = Date.now();
  const materiales: Material[] = CATALOGO.map((m) => ({
    id: uid(),
    nombre: m.nombre,
    tipo: m.tipo,
    dims: m.dims,
    largoBarra: LARGO_BARRA_CM,
    precioBarra: m.precioBarra,
    precioUnitario: Math.round((m.precioBarra / (LARGO_BARRA_CM / 100)) * 100) / 100,
    unidad: 'metro',
    categoria: m.categoria,
    activo: true,
    creadoEn: now,
    actualizadoEn: now,
  }));
  await sb.from('materiales').insert(materiales);
  return materiales;
}

export async function seedConfigIfEmpty(sb: SupabaseClient): Promise<ConfiguracionTaller | null> {
  const { data } = await sb.from('configuracion').select('id').eq('id', CONFIG_ID).maybeSingle();
  if (data) return null;
  const now = Date.now();
  const config: ConfiguracionTaller = {
    ...CONFIG_DEFAULT,
    id: CONFIG_ID,
    insumos: INSUMOS_DEFAULT.map((i) => ({ ...i, id: uid() })),
    creadoEn: now,
    actualizadoEn: now,
  };
  await sb.from('configuracion').insert(config);
  return config;
}
