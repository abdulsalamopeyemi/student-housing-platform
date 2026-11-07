insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-images',
  'property-images',
  true,
  4194304,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "providers upload images to editable properties"
  on storage.objects;
create policy "providers upload images to editable properties"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.properties p
    where p.id::text = (storage.foldername(name))[1]
      and p.provider_id = (select private.current_provider_id())
      and p.publication_status in ('draft', 'rejected')
  )
);

drop policy if exists "providers delete images from editable properties"
  on storage.objects;
create policy "providers delete images from editable properties"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-images'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.properties p
    where p.id::text = (storage.foldername(name))[1]
      and p.provider_id = (select private.current_provider_id())
      and p.publication_status in ('draft', 'rejected')
  )
);
