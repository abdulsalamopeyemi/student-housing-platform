"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface InspectionActionState {
  status: "idle" | "success" | "error";
  message: string;
}

function safePropertyPath(slug: string) {
  return /^[a-z0-9-]+$/i.test(slug)
    ? `/properties/${slug}`
    : "/explore";
}

function lagosToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export async function requestInspection(
  _previousState: InspectionActionState,
  formData: FormData,
): Promise<InspectionActionState> {
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const propertySlug = String(formData.get("propertySlug") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const occupantGroupSize = String(formData.get("occupantGroupSize") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const propertyPath = safePropertyPath(propertySlug);
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(propertyPath)}`);
  }

  if (profile?.role !== "student") {
    return {
      status: "error",
      message:
        "Inspection requests are available from student accounts. Provider and admin accounts use their own workspaces.",
    };
  }

  if (!propertyId) {
    return {
      status: "error",
      message: "We could not identify this property. Refresh the page and try again.",
    };
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (
    !/^[+\d()\s.-]+$/.test(phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 20
  ) {
    return {
      status: "error",
      message: "Enter a valid phone number we can use for the inspection.",
    };
  }

  if (!isValidDate(preferredDate)) {
    return {
      status: "error",
      message: "Choose a valid preferred inspection date.",
    };
  }

  if (preferredDate < lagosToday()) {
    return {
      status: "error",
      message: "Choose today or a future date for the inspection.",
    };
  }

  if (!["1", "2", "3", "4+"].includes(occupantGroupSize)) {
    return {
      status: "error",
      message: "Choose how many people plan to stay in the accommodation.",
    };
  }

  if (note.length > 1000) {
    return {
      status: "error",
      message: "Keep the inspection note under 1,000 characters.",
    };
  }

  try {
    const existing = await supabaseAuthenticatedRest<
      Array<{ id: string; status: string }>
    >(
      `inspection_requests?property_id=eq.${encodeURIComponent(
        propertyId,
      )}&student_user_id=eq.${encodeURIComponent(
        user.id,
      )}&status=in.(requested,confirmed)&select=id,status&limit=1`,
    );

    if (existing.length > 0) {
      return {
        status: "error",
        message:
          "You already have an active inspection request for this property. Check My Account for its status.",
      };
    }

    await supabaseAuthenticatedRest("inspection_requests", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        student_user_id: user.id,
        property_id: propertyId,
        preferred_date: preferredDate,
        contact_phone: phone,
        occupant_group_size: occupantGroupSize,
        note: note || null,
        status: "requested",
      }),
    });
  } catch {
    return {
      status: "error",
      message:
        "We could not send the inspection request. The listing may no longer be available, or there may be a temporary connection problem.",
    };
  }

  revalidatePath("/account");
  revalidatePath("/list-property");

  return {
    status: "success",
    message:
      "Inspection request sent. You can track its status from My Account.",
  };
}
