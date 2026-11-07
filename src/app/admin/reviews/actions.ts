"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/data/admin";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function adminRedirect(message: string, result: "message" | "error" = "message") {
  redirect(`/admin/reviews?${result}=${encodeURIComponent(message)}`);
}

function adminError(message: string) {
  adminRedirect(message, "error");
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
    adminError("Provider could not be verified.");
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
    adminError("Provider could not be verified.");
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
    adminError("Property could not be approved.");
  }

  const properties = await supabaseAuthenticatedRest<
    Array<{ id: string; provider_id: string; publication_status: string }>
  >(
    `properties?id=eq.${encodeURIComponent(propertyId)}&select=id,provider_id,publication_status&limit=1`,
  );

  const property = properties[0];

  if (!property || property.publication_status !== "pending_review") {
    adminError("This property is no longer awaiting review.");
  }

  const providers = await supabaseAuthenticatedRest<
    Array<{ id: string; verification_status: string }>
  >(
    `providers?id=eq.${encodeURIComponent(property.provider_id)}&select=id,verification_status&limit=1`,
  );

  if (providers[0]?.verification_status !== "verified") {
    adminError("Verify the provider before publishing this property.");
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
    adminError("Property could not be approved.");
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
    adminError("Property could not be rejected.");
  }

  if (notes.length < 5) {
    adminError("Add a short reason before rejecting the property.");
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
    adminError("This property is no longer awaiting review.");
  }

  await recordVerificationEvent({
    adminUserId: user.id,
    action: "property_rejected",
    notes,
    propertyId,
  });

  adminRedirect("Property rejected. The provider can revise and resubmit it.");
}


const allowedReportStatuses = ["reviewing", "resolved", "dismissed"] as const;

export async function updatePropertyReportStatus(formData: FormData) {
  await requireAdmin();

  const reportId = String(formData.get("reportId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim();

  if (
    !reportId ||
    !allowedReportStatuses.includes(
      nextStatus as (typeof allowedReportStatuses)[number],
    )
  ) {
    adminError("Report status could not be updated.");
  }

  const reports = await supabaseAuthenticatedRest<
    Array<{ id: string; status: "open" | "reviewing" | "resolved" | "dismissed" }>
  >(
    `reports?id=eq.${encodeURIComponent(
      reportId,
    )}&select=id,status&limit=1`,
  );

  const report = reports[0];

  if (!report || report.status === "resolved" || report.status === "dismissed") {
    adminError("This report is no longer active.");
  }

  const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `reports?id=eq.${encodeURIComponent(reportId)}&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (rows.length === 0) {
    adminError("Report status could not be updated.");
  }

  adminRedirect(
    nextStatus === "reviewing"
      ? "Report moved to reviewing."
      : nextStatus === "resolved"
        ? "Report marked resolved."
        : "Report dismissed.",
  );
}

const allowedSupportStatuses = ["in_progress", "resolved", "dismissed"] as const;

export async function updateSupportRequestStatus(formData: FormData) {
  await requireAdmin();

  const requestId = String(formData.get("requestId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim();

  if (
    !requestId ||
    !allowedSupportStatuses.includes(
      nextStatus as (typeof allowedSupportStatuses)[number],
    )
  ) {
    adminError("Support request could not be updated.");
  }

  const requests = await supabaseAuthenticatedRest<
    Array<{ id: string; status: "open" | "in_progress" | "resolved" | "dismissed" }>
  >(
    `support_requests?id=eq.${encodeURIComponent(
      requestId,
    )}&select=id,status&limit=1`,
  );

  const request = requests[0];
  const canUpdate =
    request?.status === "open" ||
    (request?.status === "in_progress" &&
      (nextStatus === "resolved" || nextStatus === "dismissed"));

  if (!request || !canUpdate) {
    adminError("This support request is no longer active.");
  }

  const updated = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `support_requests?id=eq.${encodeURIComponent(
      requestId,
    )}&status=eq.${request.status}&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({ status: nextStatus }),
    },
  );

  if (updated.length === 0) {
    adminError("Support request could not be updated.");
  }

  adminRedirect(
    nextStatus === "in_progress"
      ? "Support request assigned for follow-up."
      : nextStatus === "resolved"
        ? "Support request marked resolved."
        : "Support request dismissed.",
  );
}
