"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

const allowedStatuses = ["confirmed", "declined", "completed"] as const;

function workspaceMessage(message: string) {
  return `/list-property?message=${encodeURIComponent(message)}`;
}

export async function updateInspectionStatus(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  const requestId = String(formData.get("requestId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim();

  if (
    !requestId ||
    !allowedStatuses.includes(
      nextStatus as (typeof allowedStatuses)[number],
    )
  ) {
    redirect(workspaceMessage("Inspection request could not be updated."));
  }

  let updateError = "";

  try {
    const currentRows = await supabaseAuthenticatedRest<
      Array<{
        id: string;
        status: "requested" | "confirmed" | "completed" | "cancelled" | "declined";
      }>
    >(
      `inspection_requests?id=eq.${encodeURIComponent(
        requestId,
      )}&select=id,status&limit=1`,
    );

    const current = currentRows[0];

    if (!current) {
      updateError = "Inspection request could not be found.";
    } else {
      const transitionAllowed =
        (current.status === "requested" &&
          (nextStatus === "confirmed" || nextStatus === "declined")) ||
        (current.status === "confirmed" &&
          (nextStatus === "completed" || nextStatus === "declined"));

      if (!transitionAllowed) {
        updateError = "That inspection status change is not allowed.";
      } else {
        const updated = await supabaseAuthenticatedRest<Array<{ id: string }>>(
          `inspection_requests?id=eq.${encodeURIComponent(requestId)}&select=id`,
          {
            method: "PATCH",
            prefer: "return=representation",
            body: JSON.stringify({ status: nextStatus }),
          },
        );

        if (updated.length === 0) {
          updateError = "Inspection request could not be updated.";
        }
      }
    }
  } catch {
    updateError = "Inspection request could not be updated.";
  }

  if (updateError) {
    redirect(workspaceMessage(updateError));
  }

  revalidatePath("/list-property");
  revalidatePath("/account");

  redirect(workspaceMessage(`Inspection request marked ${nextStatus}.`));
}
