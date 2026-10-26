import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface SavedHomeSummary {
  property_id: string;
  created_at: string;
  properties: {
    name: string;
    slug: string;
    area: string;
    verification_status: "verified" | "pending" | "unverified" | "rejected";
    universities: {
      name: string;
    } | null;
    room_types: Array<{
      name: string;
      annual_rent: number;
      total_count: number;
      available_count: number;
    }>;
    property_images: Array<{
      storage_path: string;
      alt_text: string;
      sort_order: number;
    }>;
  } | null;
}

export interface InspectionSummary {
  id: string;
  preferred_date: string;
  occupant_group_size: "1" | "2" | "3" | "4+";
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
      "saved_properties?select=property_id,created_at,properties(name,slug,area,verification_status,universities(name),room_types(name,annual_rent,total_count,available_count),property_images(storage_path,alt_text,sort_order))&order=created_at.desc",
    ),
    supabaseAuthenticatedRest<InspectionSummary[]>(
      "inspection_requests?select=id,preferred_date,occupant_group_size,status,properties(name,slug,area)&order=created_at.desc",
    ),
  ]);

  return { savedHomes, inspections };
}
