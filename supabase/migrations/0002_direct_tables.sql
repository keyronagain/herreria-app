-- Migración a tablas tipadas directas (reemplaza sync_rows genérico)

-- materiales
create table if not exists public.materiales (
  id text primary key,
  nombre text not null,
  tipo text not null,
  dims jsonb not null default '{}',
  "largoBarra" float8 not null default 600,
  "precioBarra" float8 not null default 0,
  "precioUnitario" float8 not null default 0,
  unidad text not null default 'metro',
  categoria text,
  proveedor text,
  sku text,
  activo boolean not null default true,
  "syncId" text,
  "creadoEn" bigint not null,
  "actualizadoEn" bigint not null,
  user_id uuid not null default auth.uid()
);

alter table public.materiales enable row level security;
drop policy if exists "materiales_select_own" on public.materiales;
create policy "materiales_select_own" on public.materiales for select using (auth.uid() = user_id);
drop policy if exists "materiales_insert_own" on public.materiales;
create policy "materiales_insert_own" on public.materiales for insert with check (auth.uid() = user_id);
drop policy if exists "materiales_update_own" on public.materiales;
create policy "materiales_update_own" on public.materiales for update using (auth.uid() = user_id);
drop policy if exists "materiales_delete_own" on public.materiales;
create policy "materiales_delete_own" on public.materiales for delete using (auth.uid() = user_id);

-- proyectos
create table if not exists public.proyectos (
  id text primary key,
  nombre text not null,
  cliente text not null,
  descripcion text,
  piezas jsonb not null default '[]',
  estado text not null default 'borrador',
  "syncId" text,
  "creadoEn" bigint not null,
  "actualizadoEn" bigint not null,
  user_id uuid not null default auth.uid()
);

alter table public.proyectos enable row level security;
drop policy if exists "proyectos_select_own" on public.proyectos;
create policy "proyectos_select_own" on public.proyectos for select using (auth.uid() = user_id);
drop policy if exists "proyectos_insert_own" on public.proyectos;
create policy "proyectos_insert_own" on public.proyectos for insert with check (auth.uid() = user_id);
drop policy if exists "proyectos_update_own" on public.proyectos;
create policy "proyectos_update_own" on public.proyectos for update using (auth.uid() = user_id);
drop policy if exists "proyectos_delete_own" on public.proyectos;
create policy "proyectos_delete_own" on public.proyectos for delete using (auth.uid() = user_id);

-- cotizaciones
create table if not exists public.cotizaciones (
  id text primary key,
  numero text not null,
  "proyectoId" text,
  cliente jsonb not null default '{}',
  fecha bigint not null,
  "vigenciaDias" int not null default 30,
  conceptos jsonb not null default '[]',
  patrones jsonb,
  "costoMaterial" float8 not null default 0,
  "costoInsumos" float8 not null default 0,
  "costoManoObra" float8 not null default 0,
  subtotal float8 not null default 0,
  "pctGanancia" float8 not null default 0,
  ganancia float8 not null default 0,
  total float8 not null default 0,
  "aplicarIva" boolean not null default false,
  "ivaPct" float8 not null default 13,
  "totalConIva" float8 not null default 0,
  "modoManoObra" text not null default 'fijo',
  "horasManoObra" float8,
  "pctManoObra" float8,
  notas text,
  estado text not null default 'borrador',
  "syncId" text,
  "creadoEn" bigint not null,
  "actualizadoEn" bigint not null,
  user_id uuid not null default auth.uid()
);

alter table public.cotizaciones enable row level security;
drop policy if exists "cotizaciones_select_own" on public.cotizaciones;
create policy "cotizaciones_select_own" on public.cotizaciones for select using (auth.uid() = user_id);
drop policy if exists "cotizaciones_insert_own" on public.cotizaciones;
create policy "cotizaciones_insert_own" on public.cotizaciones for insert with check (auth.uid() = user_id);
drop policy if exists "cotizaciones_update_own" on public.cotizaciones;
create policy "cotizaciones_update_own" on public.cotizaciones for update using (auth.uid() = user_id);
drop policy if exists "cotizaciones_delete_own" on public.cotizaciones;
create policy "cotizaciones_delete_own" on public.cotizaciones for delete using (auth.uid() = user_id);

-- configuracion
create table if not exists public.configuracion (
  id text primary key,
  "nombreTaller" text not null,
  "logoBase64" text,
  moneda text not null default 'CRC',
  "ivaPct" float8 not null default 13,
  "pctGananciaDefault" float8 not null default 30,
  "costoManoObraHora" float8 not null default 8000,
  "modoManoObraDefault" text not null default 'fijo',
  "kerfDefault" float8 not null default 0.3,
  "largoBarraDefault" float8 not null default 600,
  insumos jsonb not null default '[]',
  "creadoEn" bigint not null,
  "actualizadoEn" bigint not null,
  user_id uuid not null default auth.uid()
);

alter table public.configuracion enable row level security;
drop policy if exists "configuracion_select_own" on public.configuracion;
create policy "configuracion_select_own" on public.configuracion for select using (auth.uid() = user_id);
drop policy if exists "configuracion_insert_own" on public.configuracion;
create policy "configuracion_insert_own" on public.configuracion for insert with check (auth.uid() = user_id);
drop policy if exists "configuracion_update_own" on public.configuracion;
create policy "configuracion_update_own" on public.configuracion for update using (auth.uid() = user_id);
drop policy if exists "configuracion_delete_own" on public.configuracion;
create policy "configuracion_delete_own" on public.configuracion for delete using (auth.uid() = user_id);
