export type TipoPerfil =
  | 'PTR'
  | 'TUBO_REDONDO'
  | 'TUBO_CUADRADO'
  | 'ANGULO'
  | 'PLATINA'
  | 'SOLERA'
  | 'VARILLA'
  | 'CUSTOM';

export interface DimensionesMaterial {
  ancho?: number;
  alto?: number;
  diametro?: number;
  espesor?: number;
}

export interface Material {
  id: string;
  nombre: string;
  tipo: TipoPerfil;
  dims: DimensionesMaterial;
  largoBarra: number;
  precioBarra: number;
  precioUnitario: number;
  unidad: 'metro' | 'pieza';
  categoria?: string;
  proveedor?: string;
  sku?: string;
  activo: boolean;
  syncId?: string;
  creadoEn: number;
  actualizadoEn: number;
}

export interface PiezaRequerida {
  id: string;
  materialId: string;
  descripcion: string;
  cantidad: number;
  largo: number;
  kerf: number;
  notas?: string;
}

export type EstadoProyecto = 'borrador' | 'cotizado' | 'aprobado' | 'cerrado';

export interface Proyecto {
  id: string;
  nombre: string;
  cliente: string;
  descripcion?: string;
  piezas: PiezaRequerida[];
  estado: EstadoProyecto;
  syncId?: string;
  creadoEn: number;
  actualizadoEn: number;
}

export interface CortePatron {
  piezaId: string;
  largo: number;
  descripcion: string;
}

export interface PatronBarra {
  materialId: string;
  largoBarra: number;
  cortes: CortePatron[];
  sobrante: number;
  utilizacionPct: number;
}

export interface ResultadoOptimizacion {
  materialId: string;
  totalPiezas: number;
  totalBarras: number;
  patrones: PatronBarra[];
  sobranteTotal: number;
  utilizacionPct: number;
}

export type TipoConcepto =
  | 'material'
  | 'insumo'
  | 'mano_obra'
  | 'ganancia'
  | 'otro';

export interface ConceptoCosto {
  id: string;
  descripcion: string;
  tipo: TipoConcepto;
  cantidad: number;
  unidad?: string;
  costoUnitario: number;
  subtotal: number;
}

export type ModoManoObra = 'fijo' | 'horas' | 'porcentaje';

export type EstadoCotizacion =
  | 'borrador'
  | 'enviada'
  | 'aprobada'
  | 'rechazada';

export interface ClienteCotizacion {
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export interface Cotizacion {
  id: string;
  numero: string;
  proyectoId?: string;
  cliente: ClienteCotizacion;
  fecha: number;
  vigenciaDias: number;
  conceptos: ConceptoCosto[];
  patrones?: ResultadoOptimizacion[];
  costoMaterial: number;
  costoInsumos: number;
  costoManoObra: number;
  subtotal: number;
  pctGanancia: number;
  ganancia: number;
  total: number;
  aplicarIva: boolean;
  ivaPct: number;
  totalConIva: number;
  modoManoObra: ModoManoObra;
  horasManoObra?: number;
  pctManoObra?: number;
  notas?: string;
  estado: EstadoCotizacion;
  syncId?: string;
  creadoEn: number;
  actualizadoEn: number;
}

export type ModoConsumo = 'metro_lineal' | 'por_pieza' | 'por_hora' | 'por_kg';

export interface Insumo {
  id: string;
  nombre: string;
  costoUnitario: number;
  unidad: string;
  modoConsumo: ModoConsumo;
  factor: number;
}

export interface ConfiguracionTaller {
  id: string;
  nombreTaller: string;
  logoBase64?: string;
  moneda: 'CRC';
  ivaPct: number;
  pctGananciaDefault: number;
  costoManoObraHora: number;
  modoManoObraDefault: ModoManoObra;
  kerfDefault: number;
  largoBarraDefault: number;
  insumos: Insumo[];
  creadoEn: number;
  actualizadoEn: number;
}

