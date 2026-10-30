-- SneakerDrop schema. Run once in the Supabase SQL editor (safe to re-run).

create extension if not exists pgcrypto;

do $$ begin
  create type availability as enum ('available', 'low_stock', 'sold_out', 'coming_soon');
exception when duplicate_object then null; end $$;

-- ───────────────────────── tables
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null check (char_length(name) between 2 and 60),
  tagline      text check (char_length(tagline) <= 120),
  description  text not null check (char_length(description) between 10 and 1200),
  price_cents  integer not null check (price_cents >= 0),
  image_url    text not null,
  colorway     text check (char_length(colorway) <= 60),
  accent_hex   text check (accent_hex ~* '^#[0-9a-f]{6}$'),
  availability availability not null default 'available',
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  email       text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at  timestamptz not null default now()
);
create unique index if not exists waitlist_product_email_uniq on public.waitlist (product_id, lower(email));
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ───────────────────────── helpers
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Waitlist counts per product (admin only, enforced by RLS on waitlist).
create or replace view public.product_waitlist_counts with (security_invoker = true) as
  select product_id, count(*)::int as total from public.waitlist group by product_id;

-- ───────────────────────── row level security
alter table public.products enable row level security;
alter table public.waitlist enable row level security;
alter table public.admins   enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products for insert with check (public.is_admin());
drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products for delete using (public.is_admin());

drop policy if exists "anyone joins waitlist" on public.waitlist;
create policy "anyone joins waitlist" on public.waitlist for insert to anon, authenticated with check (true);
drop policy if exists "admin reads waitlist" on public.waitlist;
create policy "admin reads waitlist" on public.waitlist for select using (public.is_admin());
drop policy if exists "admin deletes waitlist" on public.waitlist;
create policy "admin deletes waitlist" on public.waitlist for delete using (public.is_admin());

drop policy if exists "admin sees self" on public.admins;
create policy "admin sees self" on public.admins for select using (user_id = auth.uid());

-- ───────────────────────── storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 3145728, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects for select
  using (bucket_id = 'product-images');
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
