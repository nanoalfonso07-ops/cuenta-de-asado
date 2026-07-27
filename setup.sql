-- LA CUENTA DEL ASADO — v3 grupos
-- Pegá todo esto en Supabase: SQL Editor → New query → Run

create table grupos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nombre text not null,
  alias text default '',
  created_at timestamptz default now()
);

create table miembros (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid references grupos(id) on delete cascade,
  nombre text not null,
  parte float default 1,
  created_at timestamptz default now()
);

create table gastos (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid references grupos(id) on delete cascade,
  concepto text not null,
  monto numeric not null,
  pagador text not null,
  created_at timestamptz default now()
);

-- Seguridad: acceso abierto con la clave pública.
-- La "llave" real es conocer el código del grupo.
alter table grupos enable row level security;
alter table miembros enable row level security;
alter table gastos enable row level security;

create policy "abierto grupos" on grupos for all using (true) with check (true);
create policy "abierto miembros" on miembros for all using (true) with check (true);
create policy "abierto gastos" on gastos for all using (true) with check (true);
