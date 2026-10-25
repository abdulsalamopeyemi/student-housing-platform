import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface SavedHomeSummary {
  property_id: string;
  created_at: string;
  properties: {
    name: string;
    slug: string;
    area: string;
  } | null;
}

export interface InspectionSummary {
  id: string;
  preferred_date: string;
  status: "requested" | "confirmed" | "completed" | "cancelled" | "declined";
  properties: {
    name: string;
    slug: string;
    area: string;
  } | null;
}

export async function getStudentDashboardData() {
  const [savedHomes, inspections] = await Promise.all([
    supabaseAuthenticatedRest<SavedHomeSummary[]>(
      "saved_properties?select=property_id,created_at,properties(name,slug,area)&order=created_at.desc&limit=5",
    ),
    supabaseAuthenticatedRest<InspectionSummary[]>(
      "inspection_requests?select=id,preferred_date,status,properties(name,slug,area)&order=created_at.desc&limit=5",
    ),
  ]);

  return { savedHomes, inspections };
}
