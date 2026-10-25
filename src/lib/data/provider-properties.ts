import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface ProviderProperty {
  id: string;
  name: string;
  slug: string;
  area: string;
  distance_label: string | null;
  publication_status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  updated_at: string;
  universities: {
    name: string;
  } | null;
}

export async function getProviderProperties(providerId: string) {
  return supabaseAuthenticatedRest<ProviderProperty[]>(
    `properties?provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,slug,area,distance_label,publication_status,verification_status,updated_at,universities(name)&order=updated_at.desc`,
  );
}
