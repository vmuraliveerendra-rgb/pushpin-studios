-- =========================================================================
-- Pushpin Studios - Supabase Database Schema
-- Paste and run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- 1. Create Bookings Table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  client_name text not null,
  client_phone text not null,
  client_email text,
  service_key text not null,
  booking_date date not null,
  booking_time text not null,
  duration_hours numeric not null default 1,
  addons jsonb default '[]'::jsonb,
  total_price numeric not null,
  status text not null default 'pending_confirmation',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Inquiries Table
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  contact text not null,
  service_interest text,
  message text,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS) Policies
alter table public.bookings enable row level security;
alter table public.inquiries enable row level security;

-- Allow anonymous inserts from the public web portal
create policy "Allow anonymous insert to bookings"
  on public.bookings for insert
  with check (true);

create policy "Allow anonymous insert to inquiries"
  on public.inquiries for insert
  with check (true);

-- Allow reading bookings for authorized team / studio admins
create policy "Allow read access to bookings"
  on public.bookings for select
  using (true);
