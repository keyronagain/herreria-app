-- Agrega platinas 50 mm y tubo estructural 200x200 a cada usuario que ya tenga catálogo,
-- omitiendo los que ya existan por nombre.

with nuevos (nombre, tipo, dims, "precioBarra", categoria) as (
  values
    ('TUBO NEGRO ESTRUC. CUAD. 200X200X3.17MMX6.00MTS', 'TUBO_CUADRADO', '{"ancho":20,"alto":20,"espesor":0.317}'::jsonb, 60566.37::float8, 'Estructural Negro'),
    ('PLATINA 50X3MMX6MTS', 'PLATINA', '{"ancho":5,"espesor":0.3}'::jsonb, 4163.72::float8, 'Platina'),
    ('PLATINA 50X5MMX6MTS', 'PLATINA', '{"ancho":5,"espesor":0.5}'::jsonb, 6659.29::float8, 'Platina'),
    ('PLATINA 50X6MMX6MTS', 'PLATINA', '{"ancho":5,"espesor":0.6}'::jsonb, 8876.11::float8, 'Platina')
),
usuarios as (
  select distinct user_id from public.materiales
)
insert into public.materiales (
  id, nombre, tipo, dims, "largoBarra", "precioBarra", "precioUnitario",
  unidad, categoria, activo, "creadoEn", "actualizadoEn", user_id
)
select
  gen_random_uuid()::text,
  n.nombre,
  n.tipo,
  n.dims,
  600,
  n."precioBarra",
  round((n."precioBarra" / 6)::numeric, 2)::float8,
  'metro',
  n.categoria,
  true,
  (extract(epoch from now()) * 1000)::bigint,
  (extract(epoch from now()) * 1000)::bigint,
  u.user_id
from usuarios u
cross join nuevos n
where not exists (
  select 1 from public.materiales m
  where m.user_id = u.user_id and m.nombre = n.nombre
);
