alter table public.room_types
  add column if not exists total_count integer;

update public.room_types
set total_count = greatest(coalesce(total_count, 0), available_count)
where total_count is null
  or total_count < available_count;

alter table public.room_types
  alter column total_count set default 0,
  alter column total_count set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.room_types'::regclass
      and conname = 'room_types_total_count_nonnegative'
  ) then
    alter table public.room_types
      add constraint room_types_total_count_nonnegative
      check (total_count >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.room_types'::regclass
      and conname = 'room_types_available_count_lte_total_count'
  ) then
    alter table public.room_types
      add constraint room_types_available_count_lte_total_count
      check (available_count <= total_count);
  end if;
end;
$$;

alter table public.inspection_requests
  add column if not exists occupant_group_size text;

update public.inspection_requests
set occupant_group_size = '1'
where occupant_group_size is null;

alter table public.inspection_requests
  alter column occupant_group_size set default '1',
  alter column occupant_group_size set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.inspection_requests'::regclass
      and conname = 'inspection_requests_occupant_group_size_valid'
  ) then
    alter table public.inspection_requests
      add constraint inspection_requests_occupant_group_size_valid
      check (occupant_group_size in ('1', '2', '3', '4+'));
  end if;
end;
$$;

create or replace function public.protect_inspection_request_identity()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if current_user in ('postgres', 'service_role') or (select private.is_admin()) then
    return new;
  end if;

  if old.student_user_id = (select auth.uid()) then
    if old.student_user_id is distinct from new.student_user_id
      or old.property_id is distinct from new.property_id
      or old.room_type_id is distinct from new.room_type_id
      or old.contact_phone is distinct from new.contact_phone
      or old.note is distinct from new.note then
      raise exception 'Students cannot change the identity or destination of an inspection request.';
    end if;

    if old.status not in ('requested', 'confirmed')
      or new.status not in ('requested', 'cancelled') then
      raise exception 'Students may only reschedule or cancel active inspection requests.';
    end if;

    if new.status = 'cancelled'
      and (
        old.preferred_date is distinct from new.preferred_date
        or old.occupant_group_size is distinct from new.occupant_group_size
      ) then
      raise exception 'Cancelling an inspection request cannot change its details.';
    end if;

    return new;
  end if;

  if old.student_user_id is distinct from new.student_user_id
    or old.property_id is distinct from new.property_id
    or old.room_type_id is distinct from new.room_type_id
    or old.preferred_date is distinct from new.preferred_date
    or old.contact_phone is distinct from new.contact_phone
    or old.occupant_group_size is distinct from new.occupant_group_size
    or old.note is distinct from new.note then
    raise exception 'Providers may only update the inspection request status.';
  end if;

  if (old.status = 'requested' and new.status in ('confirmed', 'declined'))
    or (old.status = 'confirmed' and new.status in ('completed', 'declined')) then
    return new;
  end if;

  raise exception 'That inspection status change is not allowed.';
end;
$function$;

drop policy if exists "students can update own inspection requests"
  on public.inspection_requests;
create policy "students can update own inspection requests"
on public.inspection_requests
for update
to authenticated
using (student_user_id = (select auth.uid()))
with check (student_user_id = (select auth.uid()));

drop function if exists public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, jsonb, uuid[]
);
drop function if exists public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
);

create function public.create_property_draft(
  p_university_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_area text,
  p_distance_label text,
  p_room_type_name text,
  p_annual_rent numeric,
  p_total_count integer,
  p_available_count integer,
  p_fees jsonb default '[]'::jsonb,
  p_amenity_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_provider_id uuid;
  v_property_id uuid;
  v_room_type_id uuid;
begin
  v_provider_id := private.current_provider_id();

  if v_provider_id is null then
    raise exception 'A provider profile is required before creating a property.';
  end if;

  if nullif(btrim(p_name), '') is null
    or nullif(btrim(p_slug), '') is null
    or nullif(btrim(p_area), '') is null
    or nullif(btrim(p_room_type_name), '') is null then
    raise exception 'Property name, slug, area, and room type are required.';
  end if;

  if p_annual_rent is null or p_annual_rent <= 0 then
    raise exception 'Annual rent must be greater than zero.';
  end if;

  if p_total_count is null or p_total_count < 1 then
    raise exception 'Total room count must be at least one.';
  end if;

  if p_available_count is null
    or p_available_count < 0
    or p_available_count > p_total_count then
    raise exception 'Available room count must be between zero and total room count.';
  end if;

  insert into public.properties (
    provider_id,
    university_id,
    name,
    slug,
    description,
    area,
    distance_label,
    verification_status,
    publication_status
  )
  values (
    v_provider_id,
    p_university_id,
    btrim(p_name),
    btrim(p_slug),
    coalesce(btrim(p_description), ''),
    btrim(p_area),
    nullif(btrim(p_distance_label), ''),
    'unverified',
    'draft'
  )
  returning id into v_property_id;

  insert into public.room_types (
    property_id,
    name,
    annual_rent,
    total_count,
    available_count,
    capacity
  )
  values (
    v_property_id,
    btrim(p_room_type_name),
    p_annual_rent,
    p_total_count,
    p_available_count,
    1
  )
  returning id into v_room_type_id;

  insert into public.property_fees (
    room_type_id,
    label,
    amount,
    required
  )
  select
    v_room_type_id,
    btrim(fee.label),
    fee.amount,
    coalesce(fee.required, true)
  from jsonb_to_recordset(coalesce(p_fees, '[]'::jsonb))
    as fee(label text, amount numeric, required boolean)
  where nullif(btrim(fee.label), '') is not null
    and fee.amount is not null
    and fee.amount >= 0;

  insert into public.property_amenities (property_id, amenity_id)
  select v_property_id, amenity.id
  from unnest(coalesce(p_amenity_ids, '{}'::uuid[])) as selected(amenity_id)
  join public.amenities amenity
    on amenity.id = selected.amenity_id
  on conflict do nothing;

  return jsonb_build_object(
    'property_id', v_property_id,
    'room_type_id', v_room_type_id,
    'slug', btrim(p_slug)
  );
end;
$function$;

revoke execute on function public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
) from public, anon;
grant execute on function public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
) to authenticated;

drop function if exists public.update_property_draft(
  uuid, uuid, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
);

create function public.update_property_draft(
  p_property_id uuid,
  p_university_id uuid,
  p_name text,
  p_description text,
  p_area text,
  p_distance_label text,
  p_room_type_name text,
  p_annual_rent numeric,
  p_total_count integer,
  p_available_count integer,
  p_fees jsonb default '[]'::jsonb,
  p_amenity_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_provider_id uuid;
  v_property_id uuid;
  v_room_type_id uuid;
begin
  v_provider_id := private.current_provider_id();

  if v_provider_id is null then
    raise exception 'A provider profile is required before updating a property.';
  end if;

  if nullif(btrim(p_name), '') is null
    or nullif(btrim(p_area), '') is null
    or nullif(btrim(p_room_type_name), '') is null then
    raise exception 'Property name, area, and room type are required.';
  end if;

  if p_annual_rent is null or p_annual_rent <= 0 then
    raise exception 'Annual rent must be greater than zero.';
  end if;

  if p_total_count is null or p_total_count < 1 then
    raise exception 'Total room count must be at least one.';
  end if;

  if p_available_count is null
    or p_available_count < 0
    or p_available_count > p_total_count then
    raise exception 'Available room count must be between zero and total room count.';
  end if;

  update public.properties
  set university_id = p_university_id,
      name = btrim(p_name),
      description = coalesce(btrim(p_description), ''),
      area = btrim(p_area),
      distance_label = nullif(btrim(p_distance_label), ''),
      updated_at = now()
  where id = p_property_id
    and provider_id = v_provider_id
    and publication_status in ('draft', 'rejected')
  returning id into v_property_id;

  if v_property_id is null then
    raise exception 'Property is not editable by this provider.';
  end if;

  select rt.id
  into v_room_type_id
  from public.room_types rt
  where rt.property_id = v_property_id
  order by rt.created_at, rt.id
  limit 1
  for update;

  if v_room_type_id is null then
    raise exception 'The property has no room type to update.';
  end if;

  update public.room_types
  set name = btrim(p_room_type_name),
      annual_rent = p_annual_rent,
      total_count = p_total_count,
      available_count = p_available_count,
      availability_updated_at = now(),
      updated_at = now()
  where id = v_room_type_id;

  delete from public.property_fees
  where room_type_id = v_room_type_id;

  insert into public.property_fees (
    room_type_id,
    label,
    amount,
    required
  )
  select
    v_room_type_id,
    btrim(fee.label),
    fee.amount,
    coalesce(fee.required, true)
  from jsonb_to_recordset(coalesce(p_fees, '[]'::jsonb))
    as fee(label text, amount numeric, required boolean)
  where nullif(btrim(fee.label), '') is not null
    and fee.amount is not null
    and fee.amount >= 0;

  delete from public.property_amenities
  where property_id = v_property_id;

  insert into public.property_amenities (property_id, amenity_id)
  select v_property_id, amenity.id
  from unnest(coalesce(p_amenity_ids, '{}'::uuid[])) as selected(amenity_id)
  join public.amenities amenity
    on amenity.id = selected.amenity_id
  on conflict do nothing;

  return jsonb_build_object(
    'property_id', v_property_id,
    'room_type_id', v_room_type_id
  );
end;
$function$;

revoke execute on function public.update_property_draft(
  uuid, uuid, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
) from public, anon;
grant execute on function public.update_property_draft(
  uuid, uuid, text, text, text, text, text, numeric, integer, integer, jsonb, uuid[]
) to authenticated;
