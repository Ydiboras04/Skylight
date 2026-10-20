-- Skylight journal entries.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.entries (
  id           bigint generated always as identity primary key,
  created_at   bigint   not null,            -- seconds since 1970 (Unix time), set by the backend
  date         date     not null,            -- the day the entry is about
  country_code text     not null,
  country_name text     not null,
  mood         smallint not null check (mood between 1 and 5),
  note         text     not null default '',
  activities   text[]   not null default '{}',
  weather      jsonb    not null             -- weather snapshot at the moment of saving
);

create index if not exists entries_date_idx on public.entries (date desc, created_at desc);

-- Row Level Security ON with no policies: the public (anon / publishable) key can't read or
-- write anything. Only the backend, which uses the secret key, can access the table.
alter table public.entries enable row level security;
