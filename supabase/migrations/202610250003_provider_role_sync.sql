-- Keep profile roles aligned with provider onboarding without allowing
-- browser clients to assign themselves privileged roles.

create or replace function private.promote_profile_to_provider()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.profiles
  set role = 'provider'
  where id = new.profile_id
    and role = 'student';

  return new;
end;
$function$;

revoke execute on function private.promote_profile_to_provider() from public, anon, authenticated;

drop trigger if exists providers_promote_profile on public.providers;
create trigger providers_promote_profile
after insert on public.providers
for each row execute function private.promote_profile_to_provider();
