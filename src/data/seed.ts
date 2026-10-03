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
  // Industrial cal. 1.20 mm (espesor 0.12 cm)
  { nombre: 'TUBO IND.CUAD. 12X12 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 1.2, alto: 1.2, espesor: 0.12 }, precioBarra: 2370, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 18X18 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 1.8, alto: 1.8, espesor: 0.12 }, precioBarra: 2970, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 22X22 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.2, alto: 2.2, espesor: 0.12 }, precioBarra: 3465, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 25X25 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.5, alto: 2.5, espesor: 0.12 }, precioBarra: 3825, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 31X31 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.1, alto: 3.1, espesor: 0.12 }, precioBarra: 4735, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 38X38 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.8, alto: 3.8, espesor: 0.12 }, precioBarra: 5875, categoria: 'Industrial' },
  // Galvanizado cal. 1.20 mm
  { nombre: 'TUBO IND.GALV. CUAD. 25X25 1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.5, alto: 2.5, espesor: 0.12 }, precioBarra: 4005, categoria: 'Galvanizado' },
  // Estructural Negro cal. 1.20 mm
  { nombre: 'TUBO NEGRO ESTRUC. 50X50X1.20MM SEG.', tipo: 'TUBO_CUADRADO', dims: { ancho: 5.0, alto: 5.0, espesor: 0.12 }, precioBarra: 6445, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 50X50X1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 5.0, alto: 5.0, espesor: 0.12 }, precioBarra: 7685, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 72X72X1.20MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 7.2, alto: 7.2, espesor: 0.12 }, precioBarra: 10665, categoria: 'Estructural Negro' },
  // Industrial cal. 1.50 mm (espesor 0.15 cm)
  { nombre: 'TUBO IND.CUAD. 18X18 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 1.8, alto: 1.8, espesor: 0.15 }, precioBarra: 3465, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 25X25 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.5, alto: 2.5, espesor: 0.15 }, precioBarra: 4470, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 31X31 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.1, alto: 3.1, espesor: 0.15 }, precioBarra: 5505, categoria: 'Industrial' },
  { nombre: 'TUBO IND.CUAD. 38X38 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.8, alto: 3.8, espesor: 0.15 }, precioBarra: 7290, categoria: 'Industrial' },
  // Galvanizado cal. 1.50 mm
  { nombre: 'TUBO IND.GALV. CUAD. 25X25 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.5, alto: 2.5, espesor: 0.15 }, precioBarra: 4995, categoria: 'Galvanizado' },
  { nombre: 'TUBO IND.GALV. CUAD. 38X38 1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.8, alto: 3.8, espesor: 0.15 }, precioBarra: 7445, categoria: 'Galvanizado' },
  // Estructural Negro cal. 1.50 mm
  { nombre: 'TUBO NEGRO ESTRUC. 50X50X1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 5.0, alto: 5.0, espesor: 0.15 }, precioBarra: 9495, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 72X72X1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 7.2, alto: 7.2, espesor: 0.15 }, precioBarra: 13540, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 92X92X1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 9.2, alto: 9.2, espesor: 0.15 }, precioBarra: 17230, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 100X100X1.50MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 10.0, alto: 10.0, espesor: 0.15 }, precioBarra: 18690, categoria: 'Estructural Negro' },
  // Estructural Negro cal. 1.80 mm (espesor 0.18 cm)
  { nombre: 'TUBO NEGRO ESTRUC. 25X25X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 2.5, alto: 2.5, espesor: 0.18 }, precioBarra: 6115, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 38X38X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 3.8, alto: 3.8, espesor: 0.18 }, precioBarra: 11254.8, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 50X50X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 5.0, alto: 5.0, espesor: 0.18 }, precioBarra: 11405, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 72X72X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 7.2, alto: 7.2, espesor: 0.18 }, precioBarra: 15850, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 92X92X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 9.2, alto: 9.2, espesor: 0.18 }, precioBarra: 20700, categoria: 'Estructural Negro' },
  { nombre: 'TUBO NEGRO ESTRUC. 100X100X1.80MM', tipo: 'TUBO_CUADRADO', dims: { ancho: 10.0, alto: 10.0, espesor: 0.18 }, precioBarra: 22150, categoria: 'Estructural Negro' },
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
