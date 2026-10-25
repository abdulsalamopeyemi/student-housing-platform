"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/data/admin";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function adminRedirect(message: string) {
  redirect(`/admin/reviews?message=${encodeURIComponent(message)}`);
}

async function recordVerificationEvent(input: {
  adminUserId: string;
  action: string;
  notes?: string | null;
  propertyId?: string | null;
  providerId?: string | null;
}) {
  await supabaseAuthenticatedRest<Array<{ id: string }>>(
    "verification_events?select=id",
    {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        admin_user_id: input.adminUserId,
        action: input.action,
        notes: input.notes || null,
        property_id: input.propertyId || null,
        provider_id: input.providerId || null,
      }),
    },
  );
}

export async function verifyProvider(formData: FormData) {
  const { user } = await requireAdmin();
  const providerId = String(formData.get("providerId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!providerId) {
    adminRedirect("Provider could not be verified.");
  }

  const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `providers?id=eq.${encodeURIComponent(providerId)}&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({ verification_status: "verified" }),
    },
  );

  if (rows.length === 0) {
    adminRedirect("Provider could not be verified.");
  }

  await recordVerificationEvent({
    adminUserId: user.id,
    action: "provider_verified",
    notes,
    providerId,
  });

  adminRedirect("Provider verified successfully.");
}

export async function approveProperty(formData: FormData) {
  const { user } = await requireAdmin();
  const propertyId = String(formData.get("propertyId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!propertyId) {
    adminRedirect("Property could not be approved.");
  }

  const properties = await supabaseAuthenticatedRest<
    Array<{ id: string; provider_id: string; publication_status: string }>
  >(
    `properties?id=eq.${encodeURIComponent(propertyId)}&select=id,provider_id,publication_status&limit=1`,
  );

  const property = properties[0];

  if (!property || property.publication_status !== "pending_review") {
    adminRedirect("This property is no longer awaiting review.");
  }

  const providers = await supabaseAuthenticatedRest<
    Array<{ id: string; verification_status: string }>
  >(
    `providers?id=eq.${encodeURIComponent(property.provider_id)}&select=id,verification_status&limit=1`,
  );

  if (providers[0]?.verification_status !== "verified") {
    adminRedirect("Verify the provider before publishing this property.");
  }

  const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `properties?id=eq.${encodeURIComponent(propertyId)}&publication_status=eq.pending_review&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({
        publication_status: "published",
        verification_status: "verified",
        published_at: new Date().toISOString(),
      }),
    },
  );

  if (rows.length === 0) {
    adminRedirect("Property could not be approved.");
  }

  await recordVerificationEvent({
    adminUserId: user.id,
    action: "property_published",
    notes,
    propertyId,
  });

  adminRedirect("Property approved and published.");
}

export async function rejectProperty(formData: FormData) {
  const { user } = await requireAdmin();
  const propertyId = String(formData.get("propertyId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!propertyId) {
    adminRedirect("Property could not be rejected.");
  }

  if (notes.length < 5) {
    adminRedirect("Add a short reason before rejecting the property.");
  }

  const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `properties?id=eq.${encodeURIComponent(propertyId)}&publication_status=eq.pending_review&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({
        publication_status: "rejected",
        verification_status: "rejected",
        published_at: null,
      }),
    },
  );

  if (rows.length === 0) {
    adminRedirect("This property is no longer awaiting review.");
  }

  await recordVerificationEvent({
    adminUserId: user.id,
    action: "property_rejected",
    notes,
    propertyId,
  });

  adminRedirect("Property rejected. The provider can revise and resubmit it.");
}
