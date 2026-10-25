-- Student Housing Platform
-- Initial production database foundation
-- Generated for Supabase Postgres

create extension if not exists pgcrypto;

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

do $$ begin
  create type public.app_role as enum ('student', 'provider', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.provider_type as enum ('landlord', 'agent', 'property_manager');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.publication_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.inspection_status as enum ('requested', 'confirmed', 'completed', 'cancelled', 'declined');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  full_name text,
  phone text,
  university_id uuid references public.universities(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  provider_type public.provider_type not null,
  verification_status public.verification_status not null default 'unverified',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete restrict,
  university_id uuid not null references public.universities(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  area text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  distance_label text,
  verification_status public.verification_status not null default 'unverified',
  publication_status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  annual_rent numeric(12, 2) not null check (annual_rent >= 0),
  capacity integer not null default 1 check (capacity > 0),
  available_count integer not null default 0 check (available_count >= 0),
  availability_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(property_id, name)
);

create table if not exists public.property_fees (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  label text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  required boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(property_id, storage_path)
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null default 'general'
);

create table if not exists public.property_amenities (
  property_id uuid not null references public.properties(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  primary key (property_id, amenity_id)
);

create table if not exists public.saved_properties (
  student_user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_user_id, property_id)
);

create table if not exists public.inspection_requests (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete set null,
  preferred_date date not null,
  contact_phone text not null,
  note text,
  status public.inspection_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete cascade,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  notes text,
  created_at timestamptz not null default now(),
  check (property_id is not null or provider_id is not null)
);

create index if not exists properties_university_idx
  on public.properties(university_id);

create index if not exists properties_provider_idx
  on public.properties(provider_id);

create index if not exists properties_publication_idx
  on public.properties(publication_status);

create index if not exists room_types_property_idx
  on public.room_types(property_id);

create index if not exists inspection_requests_student_idx
  on public.inspection_requests(student_user_id);

create index if not exists inspection_requests_property_idx
  on public.inspection_requests(property_id);

create index if not exists reports_property_idx
  on public.reports(property_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists providers_set_updated_at on public.providers;
create trigger providers_set_updated_at
before update on public.providers
for each row execute function public.set_updated_at();

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

drop trigger if exists room_types_set_updated_at on public.room_types;
create trigger room_types_set_updated_at
before update on public.room_types
for each row execute function public.set_updated_at();

drop trigger if exists inspection_requests_set_updated_at on public.inspection_requests;
create trigger inspection_requests_set_updated_at
before update on public.inspection_requests
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create or replace function private.current_provider_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.id
  from public.providers p
  where p.profile_id = (select auth.uid())
  limit 1;
$$;

revoke execute on function private.current_provider_id() from public, anon;
grant execute on function private.current_provider_id() to authenticated;

alter table public.universities enable row level security;
alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.properties enable row level security;
alter table public.room_types enable row level security;
alter table public.property_fees enable row level security;
alter table public.property_images enable row level security;
alter table public.amenities enable row level security;
alter table public.property_amenities enable row level security;
alter table public.saved_properties enable row level security;
alter table public.inspection_requests enable row level security;
alter table public.reports enable row level security;
alter table public.verification_events enable row level security;

-- Public catalogue policies

create policy "universities are public"
on public.universities
for select
to anon, authenticated
using (true);

create policy "amenities are public"
on public.amenities
for select
to anon, authenticated
using (true);

create policy "published properties are public"
on public.properties
for select
to anon, authenticated
using (publication_status = 'published');

create policy "published room types are public"
on public.room_types
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = room_types.property_id
      and p.publication_status = 'published'
  )
);

create policy "published property fees are public"
on public.property_fees
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.room_types rt
    join public.properties p on p.id = rt.property_id
    where rt.id = property_fees.room_type_id
      and p.publication_status = 'published'
  )
);

create policy "published property images are public"
on public.property_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_images.property_id
      and p.publication_status = 'published'
  )
);

create policy "published property amenities are public"
on public.property_amenities
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_amenities.property_id
      and p.publication_status = 'published'
  )
);

-- Profile policies

create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy "admins can read all profiles"
on public.profiles
for select
to authenticated
using ((select private.is_admin()));

-- Provider onboarding and ownership policies

create policy "users can create own provider profile"
on public.providers
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and verification_status = 'unverified'
);

create policy "providers can read own provider record"
on public.providers
for select
to authenticated
using (profile_id = (select auth.uid()));

create policy "admins can read all providers"
on public.providers
for select
to authenticated
using ((select private.is_admin()));

create policy "providers can read own properties"
on public.properties
for select
to authenticated
using (provider_id = (select private.current_provider_id()));

create policy "providers can create draft properties"
on public.properties
for insert
to authenticated
with check (
  provider_id = (select private.current_provider_id())
  and publication_status = 'draft'
  and verification_status = 'unverified'
);

create policy "providers can update own properties"
on public.properties
for update
to authenticated
using (provider_id = (select private.current_provider_id()))
with check (provider_id = (select private.current_provider_id()));

create policy "admins can manage properties"
on public.properties
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Provider-owned child records

create policy "providers can manage own room types"
on public.room_types
for all
to authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = room_types.property_id
      and p.provider_id = (select private.current_provider_id())
  )
)
with check (
  exists (
    select 1
    from public.properties p
    where p.id = room_types.property_id
      and p.provider_id = (select private.current_provider_id())
  )
);

create policy "providers can manage own property fees"
on public.property_fees
for all
to authenticated
using (
  exists (
    select 1
    from public.room_types rt
    join public.properties p on p.id = rt.property_id
    where rt.id = property_fees.room_type_id
      and p.provider_id = (select private.current_provider_id())
  )
)
with check (
  exists (
    select 1
    from public.room_types rt
    join public.properties p on p.id = rt.property_id
    where rt.id = property_fees.room_type_id
      and p.provider_id = (select private.current_provider_id())
  )
);

create policy "providers can manage own property images"
on public.property_images
for all
to authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_images.property_id
      and p.provider_id = (select private.current_provider_id())
  )
)
with check (
  exists (
    select 1
    from public.properties p
    where p.id = property_images.property_id
      and p.provider_id = (select private.current_provider_id())
  )
);

create policy "providers can manage own property amenities"
on public.property_amenities
for all
to authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_amenities.property_id
      and p.provider_id = (select private.current_provider_id())
  )
)
with check (
  exists (
    select 1
    from public.properties p
    where p.id = property_amenities.property_id
      and p.provider_id = (select private.current_provider_id())
  )
);

-- Saved properties

create policy "students can read own saved properties"
on public.saved_properties
for select
to authenticated
using (student_user_id = (select auth.uid()));

create policy "students can save published properties"
on public.saved_properties
for insert
to authenticated
with check (
  student_user_id = (select auth.uid())
  and exists (
    select 1
    from public.properties p
    where p.id = saved_properties.property_id
      and p.publication_status = 'published'
  )
);

create policy "students can remove own saved properties"
on public.saved_properties
for delete
to authenticated
using (student_user_id = (select auth.uid()));

-- Inspection requests

create policy "students can read own inspection requests"
on public.inspection_requests
for select
to authenticated
using (student_user_id = (select auth.uid()));

create policy "students can request inspection for published property"
on public.inspection_requests
for insert
to authenticated
with check (
  student_user_id = (select auth.uid())
  and status = 'requested'
  and exists (
    select 1
    from public.properties p
    where p.id = inspection_requests.property_id
      and p.publication_status = 'published'
  )
);

create policy "providers can read requests for own properties"
on public.inspection_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = inspection_requests.property_id
      and p.provider_id = (select private.current_provider_id())
  )
);

create policy "providers can update requests for own properties"
on public.inspection_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = inspection_requests.property_id
      and p.provider_id = (select private.current_provider_id())
  )
)
with check (
  exists (
    select 1
    from public.properties p
    where p.id = inspection_requests.property_id
      and p.provider_id = (select private.current_provider_id())
  )
);

create policy "admins can manage inspection requests"
on public.inspection_requests
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Reports

create policy "users can read own reports"
on public.reports
for select
to authenticated
using (reporter_user_id = (select auth.uid()));

create policy "users can report published properties"
on public.reports
for insert
to authenticated
with check (
  reporter_user_id = (select auth.uid())
  and status = 'open'
  and exists (
    select 1
    from public.properties p
    where p.id = reports.property_id
      and p.publication_status = 'published'
  )
);

create policy "admins can manage reports"
on public.reports
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Verification audit trail

create policy "admins can manage verification events"
on public.verification_events
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Explicit grants. RLS still determines which rows are visible/mutable.

grant select on public.universities, public.amenities to anon, authenticated;
grant select on public.properties, public.room_types, public.property_fees, public.property_images, public.property_amenities to anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert on public.providers to authenticated;
grant select, insert, update on public.properties to authenticated;
grant select, insert, update, delete on public.room_types, public.property_fees, public.property_images, public.property_amenities to authenticated;
grant select, insert, delete on public.saved_properties to authenticated;
grant select, insert, update on public.inspection_requests to authenticated;
grant select, insert, update on public.reports to authenticated;
grant select, insert, update, delete on public.verification_events to authenticated;

-- Seed lookup data that is safe and deterministic.

insert into public.universities (name, slug, city, state, country)
values ('Kwara State University', 'kwasu', 'Malete', 'Kwara', 'Nigeria')
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  state = excluded.state,
  country = excluded.country;

insert into public.amenities (name, category)
values
  ('Water supply', 'utilities'),
  ('Private bathroom', 'room'),
  ('Shared bathroom', 'room'),
  ('Kitchen space', 'room'),
  ('Security', 'safety'),
  ('Fenced compound', 'safety'),
  ('Electricity connection', 'utilities')
on conflict (name) do nothing;
