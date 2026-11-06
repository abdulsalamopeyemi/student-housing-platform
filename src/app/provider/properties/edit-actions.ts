"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function editUrl(propertyId: string, message?: string) {
  const params = new URLSearchParams();

  if (message) {
    params.set("message", message);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return `/provider/properties/${encodeURIComponent(propertyId)}/edit${suffix}`;
}

export async function updatePropertyDraft(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect("/list-property?message=Agents+cannot+edit+owner+listing+details.");
  }

  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const universityId = String(formData.get("universityId") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const distanceLabel = String(formData.get("distanceLabel") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const roomType = String(formData.get("roomType") ?? "").trim();
  const annualRent = Number(formData.get("annualRent"));
  const totalCount = Number(formData.get("totalCount"));
  const availableCount = Number(formData.get("availableCount"));

  if (!propertyId) {
    redirect("/list-property?message=Property+could+not+be+identified.");
  }

  const error = (message: string) =>
    redirect(editUrl(propertyId, message));

  if (name.length < 3) {
    error("Enter a property name with at least 3 characters.");
  }

  if (!universityId) {
    error("Choose the university this property serves.");
  }

  if (area.length < 2) {
    error("Enter the property area or neighbourhood.");
  }

  if (description.length < 20) {
    error("Add a clearer property description of at least 20 characters.");
  }

  if (roomType.length < 2) {
    error("Enter the room type.");
  }

  if (!Number.isFinite(annualRent) || annualRent <= 0) {
    error("Enter a valid annual rent.");
  }

  if (!Number.isInteger(totalCount) || totalCount < 1) {
    error("Total rooms must be a whole number of at least 1.");
  }

  if (
    !Number.isInteger(availableCount) ||
    availableCount < 0 ||
    availableCount > totalCount
  ) {
    error("Available rooms must be between 0 and the total room count.");
  }

  const feeLabels = formData.getAll("feeLabel").map(String);
  const feeAmounts = formData.getAll("feeAmount").map((value) => Number(value));

  const fees = feeLabels
    .map((label, index) => ({
      label: label.trim(),
      amount: feeAmounts[index],
      required: true,
    }))
    .filter(
      (fee) =>
        fee.label.length > 0 &&
        Number.isFinite(fee.amount) &&
        fee.amount >= 0,
    );

  const amenityIds = formData.getAll("amenities").map(String);

  try {
    await supabaseAuthenticatedRest("rpc/update_property_draft", {
      method: "POST",
      body: JSON.stringify({
        p_property_id: propertyId,
        p_university_id: universityId,
        p_name: name,
        p_description: description,
        p_area: area,
        p_distance_label: distanceLabel || null,
        p_room_type_name: roomType,
        p_annual_rent: annualRent,
        p_total_count: totalCount,
        p_available_count: availableCount,
        p_fees: fees,
        p_amenity_ids: amenityIds,
      }),
    });
  } catch {
    error(
      "We could not save these changes. This property may no longer be editable.",
    );
  }

  revalidatePath("/list-property");
  revalidatePath(editUrl(propertyId));
  redirect(editUrl(propertyId, "Property changes saved."));
}
