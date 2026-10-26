import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import { propertyImagePublicUrl } from "@/lib/property-images";

export interface ProviderPropertyImage {
  id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

export interface ProviderPropertyImageManager {
  id: string;
  name: string;
  slug: string;
  publication_status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  property_images: ProviderPropertyImage[];
}

export async function getProviderPropertyImageManager(
  propertyId: string,
  providerId: string,
) {
  const rows = await supabaseAuthenticatedRest<ProviderPropertyImageManager[]>(
    `properties?id=eq.${encodeURIComponent(
      propertyId,
    )}&provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,slug,publication_status,property_images(id,storage_path,alt_text,sort_order,created_at)&limit=1`,
  );

  const property = rows[0];

  if (!property) {
    return null;
  }

  return {
    ...property,
    property_images: [...property.property_images].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  };
}

export function serializePropertyImages(images: ProviderPropertyImage[]) {
  return images.map((image) => ({
    ...image,
    url: propertyImagePublicUrl(image.storage_path),
  }));
}
