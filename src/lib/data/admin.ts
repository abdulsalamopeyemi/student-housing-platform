import "server-only";

import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/admin-session";
import { supabaseSecretRest } from "@/lib/supabase/secret-rest";

export interface AdminPropertyReport {
  id: string;
  reason: string;
  details: string | null;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  created_at: string;
  properties: {
    id: string;
    name: string;
    slug: string;
    area: string;
  } | null;
}

export interface AdminSupportRequest {
  id: string;
  contact_email: string;
  category: "account" | "property" | "inspection" | "payment" | "privacy" | "other";
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "dismissed";
  created_at: string;
}

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
  property_images: Array<{
    id: string;
    storage_path: string;
    alt_text: string;
    sort_order: number;
  }>;
}

export async function requireAdmin(nextPath = "/admin/reviews") {
  const session = await getAdminSession();

  if (!session) {
    redirect(`/admin/sign-in?next=${encodeURIComponent(nextPath)}`);
  }
}

export async function getAdminPropertyReports() {
  await requireAdmin();

  return supabaseSecretRest<AdminPropertyReport[]>(
    "reports?status=in.(open,reviewing)&select=id,reason,details,status,created_at,properties(id,name,slug,area)&order=created_at.asc",
  );
}

export async function getAdminSupportRequests() {
  await requireAdmin();

  return supabaseSecretRest<AdminSupportRequest[]>(
    "support_requests?status=in.(open,in_progress)&select=id,contact_email,category,subject,message,status,created_at&order=created_at.asc",
  );
}

export async function getPendingProviderVerifications() {
  await requireAdmin();

  return supabaseSecretRest<PendingProviderVerification[]>(
    "providers?verification_status=in.(unverified,pending)&select=id,display_name,provider_type,verification_status,created_at&order=created_at.asc",
  );
}

export async function getPendingPropertyReviews() {
  await requireAdmin();

  return supabaseSecretRest<PendingPropertyReview[]>(
    "properties?publication_status=eq.pending_review&select=id,name,slug,description,area,distance_label,publication_status,verification_status,created_at,updated_at,providers(id,display_name,provider_type,verification_status),universities(id,name),property_images(id,storage_path,alt_text,sort_order)&order=updated_at.asc",
  );
}
