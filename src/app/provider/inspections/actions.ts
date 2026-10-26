"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

const allowedStatuses = ["confirmed", "declined", "completed"] as const;

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
    redirect(
      "/list-property?message=Inspection+request+could+not+be+updated.",
    );
  }

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
      redirect(
        "/list-property?message=Inspection+request+could+not+be+found.",
      );
    }

    const transitionAllowed =
      (current.status === "requested" &&
        (nextStatus === "confirmed" || nextStatus === "declined")) ||
      (current.status === "confirmed" &&
        (nextStatus === "completed" || nextStatus === "declined"));

    if (!transitionAllowed) {
      redirect(
        "/list-property?message=That+inspection+status+change+is+not+allowed.",
      );
    }

    const updated = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `inspection_requests?id=eq.${encodeURIComponent(requestId)}&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({ status: nextStatus }),
      },
    );

    if (updated.length === 0) {
      redirect(
        "/list-property?message=Inspection+request+could+not+be+updated.",
      );
    }
  } catch {
    redirect(
      "/list-property?message=Inspection+request+could+not+be+updated.",
    );
  }

  revalidatePath("/list-property");
  revalidatePath("/account");

  redirect(
    `/list-property?message=${encodeURIComponent(
      `Inspection request marked ${nextStatus}.`,
    )}`,
  );
}
