-- Create the 'veilles' table
create table public.veilles (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  description text null,
  url text not null,
  image_url text null,
  source text null, -- e.g., "YouTube - Micode", "LeMondeInformatique"
  category text not null, -- e.g., "Cyber", "Dev", "Cloud", "Hardware"
  published_date timestamp with time zone not null default now(),
  tags text[] null,
  constraint veilles_pkey primary key (id)
) tablespace pg_default;

-- Enable Row Level Security
alter table public.veilles enable row level security;

-- Policy: Allow public read access
create policy "Enable read access for all users" on public.veilles
  for select
  to anon, authenticated
  using (true);

-- Policy: Allow authenticated users (Admins) to insert
create policy "Enable insert for authenticated users only" on public.veilles
  for insert
  to authenticated
  with check (true);

-- Policy: Allow authenticated users (Admins) to update
create policy "Enable update for authenticated users only" on public.veilles
  for update
  to authenticated
  using (true)
  with check (true);

-- Policy: Allow authenticated users (Admins) to delete
create policy "Enable delete for authenticated users only" on public.veilles
  for delete
  to authenticated
  using (true);
