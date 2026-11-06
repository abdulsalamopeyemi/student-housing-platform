create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_email text not null,
  category text not null
    check (category in ('account', 'property', 'inspection', 'payment', 'privacy', 'other')),
  subject text not null
    check (char_length(btrim(subject)) between 5 and 120),
  message text not null
    check (char_length(btrim(message)) between 20 and 2000),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_requests_status_created_idx
  on public.support_requests(status, created_at);

create index if not exists support_requests_user_created_idx
  on public.support_requests(user_id, created_at desc);

create trigger support_requests_set_updated_at
before update on public.support_requests
for each row execute function public.set_updated_at();

alter table public.support_requests enable row level security;

create policy "users can create own support requests"
on public.support_requests
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and contact_email = (select auth.jwt() ->> 'email')
  and status = 'open'
);

create policy "users can read own support requests"
on public.support_requests
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "admins can manage support requests"
on public.support_requests
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant select, insert, update on public.support_requests to authenticated;
