-- Cover foreign keys used by joins and RLS lookups.

create index if not exists profiles_university_idx
  on public.profiles(university_id);

create index if not exists property_amenities_amenity_idx
  on public.property_amenities(amenity_id);

create index if not exists property_fees_room_type_idx
  on public.property_fees(room_type_id);

create index if not exists saved_properties_property_idx
  on public.saved_properties(property_id);

create index if not exists inspection_requests_room_type_idx
  on public.inspection_requests(room_type_id);

create index if not exists reports_reporter_idx
  on public.reports(reporter_user_id);

create index if not exists verification_events_property_idx
  on public.verification_events(property_id);

create index if not exists verification_events_provider_idx
  on public.verification_events(provider_id);

create index if not exists verification_events_admin_idx
  on public.verification_events(admin_user_id);
