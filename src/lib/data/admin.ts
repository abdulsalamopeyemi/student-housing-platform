import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/supabase/auth-server";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { Tables } from "@/types/database";

type AdminProfile = Pick<Tables<"profiles">, "id" | "full_name" | "role">;

export interface PendingProviderVerification {
  id: string;
  display_name: string | null;
  provider_type: "landlord" | "agent" | "property_manager";
  verification_status: "unverified" | "pending";
  created_at: string;
}

export interface PendingPropertyReview {
  id: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  distance_label: string | null;
  publication_status: "pending_review";
  verification_status: "pending";
  created_at: string;
  updated_at: string;
  providers: {
    id: string;
    display_name: string | null;
    provider_type: "landlord" | "agent" | "property_manager";
    verification_status: "unverified" | "pending" | "verified" | "rejected";
  } | null;
  universities: {
    id: string;
    name: string;
  } | null;
}

export async function requireAdmin(nextPath = "/admin/reviews") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const profiles = await supabaseAuthenticatedRest<AdminProfile[]>(
    `profiles?id=eq.${encodeURIComponent(user.id)}&select=id,full_name,role&limit=1`,
  );

  const profile = profiles[0] ?? null;

  if (!profile || profile.role !== "admin") {
    redirect("/explore");
  }

  return { user, profile };
}

export async function getPendingProviderVerifications() {
  await requireAdmin();

  return supabaseAuthenticatedRest<PendingProviderVerification[]>(
    "providers?verification_status=in.(unverified,pending)&select=id,display_name,provider_type,verification_status,created_at&order=created_at.asc",
  );
}

export async function getPendingPropertyReviews() {
  await requireAdmin();

  return supabaseAuthenticatedRest<PendingPropertyReview[]>(
    "properties?publication_status=eq.pending_review&select=id,name,slug,description,area,distance_label,publication_status,verification_status,created_at,updated_at,providers(id,display_name,provider_type,verification_status),universities(id,name)&order=updated_at.asc",
  );
}
