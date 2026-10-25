"use server";

import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export async function submitPropertyForReview(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  const propertyId = String(formData.get("propertyId") ?? "");

  if (!propertyId) {
    redirect("/list-property?message=Property+could+not+be+submitted.");
  }

  try {
    const rows = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `properties?id=eq.${encodeURIComponent(
        propertyId,
      )}&provider_id=eq.${encodeURIComponent(provider.id)}&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          publication_status: "pending_review",
          verification_status: "pending",
        }),
      },
    );

    if (rows.length === 0) {
      redirect("/list-property?message=Property+could+not+be+submitted.");
    }
  } catch {
    redirect("/list-property?message=Property+could+not+be+submitted.");
  }

  redirect("/list-property?message=Property+submitted+for+review.");
}
