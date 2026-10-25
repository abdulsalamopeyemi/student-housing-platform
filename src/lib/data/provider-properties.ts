import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { Tables } from "@/types/database";

export type ProviderProperty = Pick<
  Tables<"properties">,
  | "id"
  | "name"
  | "slug"
  | "area"
  | "publication_status"
  | "verification_status"
  | "updated_at"
>;

export async function getProviderProperties(providerId: string) {
  return supabaseAuthenticatedRest<ProviderProperty[]>(
    `properties?provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,slug,area,publication_status,verification_status,updated_at&order=updated_at.desc`,
  );
}
