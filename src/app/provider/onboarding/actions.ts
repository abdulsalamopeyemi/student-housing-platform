"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/supabase/auth-server";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { TablesInsert } from "@/types/database";

const providerTypes = ["landlord", "agent", "property_manager"] as const;

export async function createProvider(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/provider/onboarding");
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const providerType = String(formData.get("providerType") ?? "");

  if (displayName.length < 2) {
    redirect("/provider/onboarding?error=Enter+a+provider+or+business+name.");
  }

  if (!providerTypes.includes(providerType as (typeof providerTypes)[number])) {
    redirect("/provider/onboarding?error=Choose+a+valid+provider+type.");
  }

  const existing = await supabaseAuthenticatedRest<
    Array<{ id: string }>
  >(
    `providers?profile_id=eq.${encodeURIComponent(user.id)}&select=id&limit=1`,
  );

  if (existing.length > 0) {
    redirect("/list-property");
  }

  const payload: TablesInsert<"providers"> = {
    profile_id: user.id,
    display_name: displayName,
    provider_type: providerType as TablesInsert<"providers">["provider_type"],
  };

  await supabaseAuthenticatedRest("providers", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(payload),
  });

  redirect("/list-property?message=Provider+profile+created.");
}
