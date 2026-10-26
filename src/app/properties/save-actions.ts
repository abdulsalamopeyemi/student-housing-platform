"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export interface SavePropertyState {
  saved: boolean;
  message: string;
  status: "idle" | "success" | "error";
}

function safePropertyPath(slug: string) {
  return /^[a-z0-9-]+$/i.test(slug)
    ? `/properties/${slug}`
    : "/explore";
}

export async function toggleSavedProperty(
  previousState: SavePropertyState,
  formData: FormData,
): Promise<SavePropertyState> {
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const propertySlug = String(formData.get("propertySlug") ?? "").trim();
  const propertyPath = safePropertyPath(propertySlug);

  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(propertyPath)}`);
  }

  if (profile?.role !== "student") {
    return {
      ...previousState,
      status: "error",
      message: "Only student accounts can save accommodation.",
    };
  }

  if (!propertyId) {
    return {
      ...previousState,
      status: "error",
      message: "We could not identify this property.",
    };
  }

  try {
    const existing = await supabaseAuthenticatedRest<
      Array<{ property_id: string }>
    >(
      `saved_properties?property_id=eq.${encodeURIComponent(
        propertyId,
      )}&student_user_id=eq.${encodeURIComponent(
        user.id,
      )}&select=property_id&limit=1`,
    );

    if (existing.length > 0) {
      await supabaseAuthenticatedRest(
        `saved_properties?property_id=eq.${encodeURIComponent(
          propertyId,
        )}&student_user_id=eq.${encodeURIComponent(user.id)}`,
        { method: "DELETE" },
      );

      revalidatePath("/account");
      revalidatePath(propertyPath);

      return {
        saved: false,
        status: "success",
        message: "Removed from saved homes.",
      };
    }

    await supabaseAuthenticatedRest("saved_properties", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        student_user_id: user.id,
        property_id: propertyId,
      }),
    });

    revalidatePath("/account");
    revalidatePath(propertyPath);

    return {
      saved: true,
      status: "success",
      message: "Saved to My Account.",
    };
  } catch {
    return {
      ...previousState,
      status: "error",
      message: "We could not update your saved homes. Try again.",
    };
  }
}
