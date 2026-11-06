"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface ReportPropertyState {
  status: "idle" | "success" | "error";
  message: string;
}

function safePropertyPath(slug: string) {
  return /^[a-z0-9-]+$/i.test(slug)
    ? `/properties/${slug}`
    : "/explore";
}

const allowedReasons = [
  "wrong_price",
  "unavailable",
  "misleading_photos",
  "suspicious_payment",
  "wrong_location",
  "other",
] as const;

export async function reportProperty(
  _previousState: ReportPropertyState,
  formData: FormData,
): Promise<ReportPropertyState> {
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const propertySlug = String(formData.get("propertySlug") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();

  const propertyPath = safePropertyPath(propertySlug);
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(propertyPath)}`);
  }

  if (profile?.role !== "student") {
    return {
      status: "error",
      message: "Only student accounts can report public accommodation listings.",
    };
  }

  if (!propertyId) {
    return {
      status: "error",
      message: "We could not identify this property.",
    };
  }

  if (!allowedReasons.includes(reason as (typeof allowedReasons)[number])) {
    return {
      status: "error",
      message: "Choose the main reason you are reporting this listing.",
    };
  }

  if (details.length > 1200) {
    return {
      status: "error",
      message: "Keep the report details under 1,200 characters.",
    };
  }

  try {
    const existing = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `reports?property_id=eq.${encodeURIComponent(
        propertyId,
      )}&reporter_user_id=eq.${encodeURIComponent(
        user.id,
      )}&status=eq.open&select=id&limit=1`,
    );

    if (existing.length > 0) {
      return {
        status: "error",
        message:
          "You already have an open report for this property. Our admin team can review that existing report.",
      };
    }

    await supabaseAuthenticatedRest("reports", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        reporter_user_id: user.id,
        property_id: propertyId,
        reason,
        details: details || null,
        status: "open",
      }),
    });
  } catch {
    return {
      status: "error",
      message: "We could not submit this report. Please try again.",
    };
  }

  revalidatePath("/admin/reviews");

  return {
    status: "success",
    message:
      "Report submitted privately. Only the platform admin team can review your report.",
  };
}
