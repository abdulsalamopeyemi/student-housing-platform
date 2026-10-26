import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface ProviderInspectionRequest {
  id: string;
  preferred_date: string;
  contact_phone: string;
  note: string | null;
  status: "requested" | "confirmed" | "completed" | "cancelled" | "declined";
  created_at: string;
  properties: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function getProviderInspectionRequests() {
  return supabaseAuthenticatedRest<ProviderInspectionRequest[]>(
    "inspection_requests?select=id,preferred_date,contact_phone,note,status,created_at,properties(id,name,slug)&order=created_at.desc",
  );
}
