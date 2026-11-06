create or replace function public.protect_profile_identity()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if current_user in ('postgres', 'service_role')
    or (select private.is_admin()) then
    return new;
  end if;

  if old.id is distinct from new.id
    or old.role is distinct from new.role then
    raise exception 'Profile identity and role are managed by the platform.';
  end if;

  return new;
end;
$function$;

drop trigger if exists profiles_protect_identity on public.profiles;
create trigger profiles_protect_identity
before update on public.profiles
for each row execute function public.protect_profile_identity();

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (full_name, phone, university_id)
on public.profiles to authenticated;
