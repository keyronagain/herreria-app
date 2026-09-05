-- Sincronización Herrería App — tabla genérica de filas sincronizadas
create table if not exists public.sync_rows (
  entidad text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  user_id uuid not null default auth.uid(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  primary key (entidad, id)
);

alter table public.sync_rows enable row level security;

drop policy if exists "sync_rows_select_own" on public.sync_rows;
create policy "sync_rows_select_own" on public.sync_rows
  for select using (auth.uid() = user_id);

drop policy if exists "sync_rows_insert_own" on public.sync_rows;
create policy "sync_rows_insert_own" on public.sync_rows
  for insert with check (auth.uid() = user_id);

drop policy if exists "sync_rows_update_own" on public.sync_rows;
create policy "sync_rows_update_own" on public.sync_rows
  for update using (auth.uid() = user_id);

drop policy if exists "sync_rows_delete_own" on public.sync_rows;
create policy "sync_rows_delete_own" on public.sync_rows
  for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_rows_updated_at on public.sync_rows;
create trigger sync_rows_updated_at
  before insert or update on public.sync_rows
  for each row execute function public.set_updated_at();
