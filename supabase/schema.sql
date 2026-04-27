create table if not exists public.work_motive_results (
  id uuid primary key default gen_random_uuid(),
  main_type text not null,
  scores jsonb not null,
  answers jsonb not null,
  contradiction_score integer not null default 0,
  sub_traits text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_work_motive_results_created_at
  on public.work_motive_results (created_at desc);

create index if not exists idx_work_motive_results_main_type
  on public.work_motive_results (main_type);

alter table public.work_motive_results enable row level security;
