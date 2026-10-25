create or replace function public.create_property_draft(
  p_university_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_area text,
  p_distance_label text,
  p_room_type_name text,
  p_annual_rent numeric,
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

  if nullif(btrim(p_name), '') is null then
    raise exception 'Property name is required.';
  end if;

  if nullif(btrim(p_area), '') is null then
    raise exception 'Property area is required.';
  end if;

  if nullif(btrim(p_room_type_name), '') is null then
    raise exception 'Room type is required.';
  end if;

  if p_annual_rent < 0 then
    raise exception 'Annual rent cannot be negative.';
  end if;

  if p_available_count < 0 then
    raise exception 'Available room count cannot be negative.';
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
    p_slug,
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
    available_count,
    capacity
  )
  values (
    v_property_id,
    btrim(p_room_type_name),
    p_annual_rent,
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
    'slug', p_slug
  );
end;
$function$;

revoke execute on function public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, jsonb, uuid[]
) from public, anon;

grant execute on function public.create_property_draft(
  uuid, text, text, text, text, text, text, numeric, integer, jsonb, uuid[]
) to authenticated;
