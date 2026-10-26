"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function workspaceMessage(message: string) {
  return `/list-property?message=${encodeURIComponent(message)}`;
}

export async function updateRoomAvailability(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  const roomTypeId = String(formData.get("roomTypeId") ?? "").trim();
  const totalCount = Number(formData.get("totalCount"));
  const availableCount = Number(formData.get("availableCount"));

  if (!roomTypeId) {
    redirect(workspaceMessage("Room availability could not be identified."));
  }

  if (!Number.isInteger(totalCount) || totalCount < 1) {
    redirect(workspaceMessage("Total rooms must be at least 1."));
  }

  if (
    !Number.isInteger(availableCount) ||
    availableCount < 0 ||
    availableCount > totalCount
  ) {
    redirect(
      workspaceMessage(
        "Available rooms must be between 0 and the total room count.",
      ),
    );
  }

  try {
    const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `room_types?id=eq.${encodeURIComponent(roomTypeId)}&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          total_count: totalCount,
          available_count: availableCount,
          availability_updated_at: new Date().toISOString(),
        }),
      },
    );

    if (rows.length === 0) {
      redirect(
        workspaceMessage(
          "You do not have permission to update this room availability.",
        ),
      );
    }
  } catch {
    redirect(workspaceMessage("We could not update room availability."));
  }

  revalidatePath("/list-property");
  revalidatePath("/explore");
  redirect(workspaceMessage("Room availability updated."));
}
