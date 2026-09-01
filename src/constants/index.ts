import type { ConfiguracionTaller, TipoPerfil } from '@/types';

export const MONEDA = 'CRC';

export const CONFIG_ID = 'taller';

export const CONFIG_DEFAULT: Omit<
  ConfiguracionTaller,
  'id' | 'insumos' | 'creadoEn' | 'actualizadoEn'
> = {
  nombreTaller: 'Mi Taller de Herrería',
  moneda: 'CRC',
  ivaPct: 13,
  pctGananciaDefault: 30,
  costoManoObraHora: 8000,
  modoManoObraDefault: 'fijo',
  kerfDefault: 0.3,
  largoBarraDefault: 600,
};

export const TIPOS_PERFIL: { value: TipoPerfil; label: string }[] = [
  { value: 'PTR', label: 'PTR (tubo rectangular)' },
  { value: 'TUBO_CUADRADO', label: 'Tubo cuadrado' },
  { value: 'TUBO_REDONDO', label: 'Tubo redondo' },
  { value: 'ANGULO', label: 'Ángulo' },
  { value: 'PLATINA', label: 'Platina' },
  { value: 'SOLERA', label: 'Solera' },
  { value: 'VARILLA', label: 'Varilla' },
  { value: 'CUSTOM', label: 'Otro' },
];

export const ESTADOS_COTIZACION: {
  value: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
  label: string;
}[] = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
];
