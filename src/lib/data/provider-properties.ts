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


export interface EditableProviderProperty {
  id: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  distance_label: string | null;
  university_id: string;
  publication_status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  room_types: Array<{
    id: string;
    name: string;
    annual_rent: number;
    total_count: number;
    available_count: number;
    property_fees: Array<{
      id: string;
      label: string;
      amount: number;
      required: boolean;
    }>;
  }>;
  property_amenities: Array<{
    amenity_id: string;
  }>;
}

export interface PropertyReviewFeedback {
  notes: string | null;
  created_at: string;
}

export async function getEditableProviderProperty(
  propertyId: string,
  providerId: string,
) {
  const rows = await supabaseAuthenticatedRest<EditableProviderProperty[]>(
    `properties?id=eq.${encodeURIComponent(
      propertyId,
    )}&provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,slug,description,area,distance_label,university_id,publication_status,verification_status,room_types(id,name,annual_rent,total_count,available_count,property_fees(id,label,amount,required)),property_amenities(amenity_id)&limit=1`,
  );

  return rows[0] ?? null;
}

export async function getLatestPropertyReviewFeedback(propertyId: string) {
  const rows = await supabaseAuthenticatedRest<PropertyReviewFeedback[]>(
    `verification_events?property_id=eq.${encodeURIComponent(
      propertyId,
    )}&action=eq.property_rejected&select=notes,created_at&order=created_at.desc&limit=1`,
  );

  return rows[0] ?? null;
}
