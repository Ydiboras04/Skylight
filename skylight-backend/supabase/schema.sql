-- Skylight thoughts. One row = one broadcast thought, pinned to where it was sent from.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.entries (
  id           bigint generated always as identity primary key,
  created_at   bigint   not null,            -- seconds since 1970 (Unix time), set by the backend
  date         date     not null,            -- the day the thought was sent (set by the backend)
  lat          double precision not null,    -- where the thought was sent from
  lng          double precision not null,
  country_code text     not null,            -- nearest country, derived from lat/lng (a display label)
  country_name text     not null,
  mood         smallint not null check (mood between 1 and 5),  -- picks the face shown on the globe
  note         text     not null,            -- the thought itself
  activities   text[]   not null default '{}',
  weather      jsonb    not null             -- weather snapshot at the moment of sending
);

-- For installs created before thoughts carried coordinates.
alter table public.entries add column if not exists lat double precision not null default 0;
alter table public.entries add column if not exists lng double precision not null default 0;

create index if not exists entries_date_idx on public.entries (date desc, created_at desc);

-- Row Level Security ON with no policies: the public (anon / publishable) key can't read or
-- write anything. Only the backend, which uses the secret key, can access the table.
alter table public.entries enable row level security;
