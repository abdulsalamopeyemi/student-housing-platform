"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function accountMessage(message: string) {
  return `/account?message=${encodeURIComponent(message)}`;
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

async function requireStudentAccount() {
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/account");
  }

  if (profile?.role !== "student") {
    redirect("/account");
  }

  return user;
}

export async function rescheduleStudentInspection(formData: FormData) {
  const user = await requireStudentAccount();
  const requestId = String(formData.get("requestId") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const occupantGroupSize = String(
    formData.get("occupantGroupSize") ?? "",
  ).trim();

  if (!requestId) {
    redirect(accountMessage("Inspection request could not be identified."));
  }

  if (!isValidDate(preferredDate)) {
    redirect(accountMessage("Choose a valid inspection date."));
  }

  if (preferredDate < lagosToday()) {
    redirect(accountMessage("Choose today or a future inspection date."));
  }

  if (!["1", "2", "3", "4+"].includes(occupantGroupSize)) {
    redirect(accountMessage("Choose how many people plan to stay."));
  }

  let updateError = "";

  try {
    const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `inspection_requests?id=eq.${encodeURIComponent(
        requestId,
      )}&student_user_id=eq.${encodeURIComponent(
        user.id,
      )}&status=in.(requested,confirmed)&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          preferred_date: preferredDate,
          occupant_group_size: occupantGroupSize,
          status: "requested",
          updated_at: new Date().toISOString(),
        }),
      },
    );

    if (rows.length === 0) {
      updateError = "This inspection request can no longer be rescheduled.";
    }
  } catch {
    updateError = "We could not reschedule the inspection request.";
  }

  if (updateError) {
    redirect(accountMessage(updateError));
  }

  revalidatePath("/account");
  revalidatePath("/list-property");
  redirect(
    accountMessage(
      "Inspection rescheduled. The provider will need to confirm the new date.",
    ),
  );
}

export async function cancelStudentInspection(formData: FormData) {
  const user = await requireStudentAccount();
  const requestId = String(formData.get("requestId") ?? "").trim();

  if (!requestId) {
    redirect(accountMessage("Inspection request could not be identified."));
  }

  let updateError = "";

  try {
    const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `inspection_requests?id=eq.${encodeURIComponent(
        requestId,
      )}&student_user_id=eq.${encodeURIComponent(
        user.id,
      )}&status=in.(requested,confirmed)&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        }),
      },
    );

    if (rows.length === 0) {
      updateError = "This inspection request can no longer be cancelled.";
    }
  } catch {
    updateError = "We could not cancel the inspection request.";
  }

  if (updateError) {
    redirect(accountMessage(updateError));
  }

  revalidatePath("/account");
  revalidatePath("/list-property");
  redirect(accountMessage("Inspection request cancelled."));
}
