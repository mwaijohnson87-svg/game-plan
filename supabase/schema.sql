-- Run this in the Supabase SQL editor to enable real game/leaderboard data

create table if not exists public.profiles (
  id uuid primary key,
  username text not null default 'Player 1',
  country text not null default 'US',
  score numeric not null default 0,
  week_number integer not null default 1,
  portfolio_value numeric not null default 100000,
  weekly_pnl numeric not null default 0,
  weekly_pnl_percent numeric not null default 0,
  return_rate numeric not null default 0,
  win_rate numeric not null default 0,
  total_trades integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their dev profile"
  on public.profiles for insert
  with check (true);

create policy "Users can update their dev profile"
  on public.profiles for update
  using (true);

-- Example dev user (copy this id into NEXT_PUBLIC_DEV_USER_ID)
insert into public.profiles (id, username, country, portfolio_value)
values ('00000000-0000-4000-8000-000000000001', 'Player 1', 'US', 100000)
on conflict (id) do nothing;
