import { supabasePublicConfig } from "@/lib/supabase/config";

export const PROPERTY_IMAGE_BUCKET = "property-images";
export const MAX_PROPERTY_IMAGES = 8;
export const MAX_PROPERTY_IMAGE_BYTES = 4 * 1024 * 1024;

export function propertyImagePublicUrl(storagePath: string) {
  const encodedPath = storagePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${supabasePublicConfig.url}/storage/v1/object/public/${PROPERTY_IMAGE_BUCKET}/${encodedPath}`;
}
