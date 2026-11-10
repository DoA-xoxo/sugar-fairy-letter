create table if not exists public.letters (id uuid primary key default gen_random_uuid(), content text not null check (char_length(content) between 1 and 500), is_public boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.site_settings (id integer primary key check (id=1), publish_at timestamptz, is_published boolean not null default false);
insert into public.site_settings(id,publish_at,is_published) values(1,null,false) on conflict(id) do nothing;
alter table public.letters enable row level security;
alter table public.site_settings enable row level security;
revoke all on public.letters from anon, authenticated;
revoke all on public.site_settings from anon, authenticated;
grant all on public.letters to service_role;
grant all on public.site_settings to service_role;
