"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/supabase/auth-server";
import { safeNextPath } from "@/lib/supabase/auth-shared";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { TablesInsert } from "@/types/database";

function resolvedNextPath(value: FormDataEntryValue | null) {
  return typeof value === "string" && value
    ? safeNextPath(value)
    : "/list-property";
}

function onboardingUrl(nextPath: string, error?: string) {
  const params = new URLSearchParams({ next: nextPath });

  if (error) {
    params.set("error", error);
  }

  return `/provider/onboarding?${params.toString()}`;
}

export async function createLandlordProfile(formData: FormData) {
  const nextPath = resolvedNextPath(formData.get("next"));
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(onboardingUrl(nextPath))}`,
    );
  }

  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2) {
    redirect(
      onboardingUrl(
        nextPath,
        "Enter your name or property business name.",
      ),
    );
  }

  if (displayName.length > 120) {
    redirect(
      onboardingUrl(nextPath, "Keep the landlord or business name under 120 characters."),
    );
  }

  const existing = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `providers?profile_id=eq.${encodeURIComponent(user.id)}&select=id&limit=1`,
  );

  if (existing.length > 0) {
    redirect(nextPath);
  }

  const payload: TablesInsert<"providers"> = {
    profile_id: user.id,
    display_name: displayName,
    provider_type: "landlord",
  };

  await supabaseAuthenticatedRest("providers", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(payload),
  });

  redirect(nextPath);
}
