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
  room_types: Array<{
    id: string;
    name: string;
    total_count: number;
    available_count: number;
    annual_rent: number;
  }>;
}

export async function getProviderProperties(providerId: string) {
  return supabaseAuthenticatedRest<ProviderProperty[]>(
    `properties?provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,slug,area,distance_label,publication_status,verification_status,updated_at,universities(name),room_types(id,name,total_count,available_count,annual_rent)&order=updated_at.desc`,
  );
}
