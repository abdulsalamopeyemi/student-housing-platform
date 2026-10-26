"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function errorUrl(message: string) {
  return `/provider/properties/new?error=${encodeURIComponent(message)}`;
}

export async function createPropertyDraft(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/provider/properties/new");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(
      "/list-property?message=Agents+manage+properties+assigned+by+owners+and+cannot+create+owner+listings.",
    );
  }

  const name = String(formData.get("name") ?? "").trim();
  const universityId = String(formData.get("universityId") ?? "");
  const area = String(formData.get("area") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const distanceLabel = String(formData.get("distanceLabel") ?? "").trim();
  const roomType = String(formData.get("roomType") ?? "").trim();
  const annualRent = Number(formData.get("annualRent"));
  const totalCount = Number(formData.get("totalCount"));
  const availableCount = Number(formData.get("availableCount"));

  if (name.length < 3) {
    redirect(errorUrl("Enter a property name with at least 3 characters."));
  }

  if (!universityId) {
    redirect(errorUrl("Choose the university this property serves."));
  }

  if (area.length < 2) {
    redirect(errorUrl("Enter the property area or neighbourhood."));
  }

  if (description.length < 20) {
    redirect(errorUrl("Add a clearer property description (at least 20 characters)."));
  }

  if (roomType.length < 2) {
    redirect(errorUrl("Enter the room type."));
  }

  if (!Number.isFinite(annualRent) || annualRent <= 0) {
    redirect(errorUrl("Enter a valid annual rent."));
  }

  if (!Number.isInteger(totalCount) || totalCount < 1) {
    redirect(errorUrl("Total rooms must be a whole number of at least 1."));
  }

  if (!Number.isInteger(availableCount) || availableCount < 0) {
    redirect(errorUrl("Available rooms must be 0 or more."));
  }

  if (availableCount > totalCount) {
    redirect(errorUrl("Available rooms cannot be greater than total rooms."));
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
  const baseSlug = slugify(name) || "property";
  const slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;

  try {
    await supabaseAuthenticatedRest("rpc/create_property_draft", {
      method: "POST",
      body: JSON.stringify({
        p_university_id: universityId,
        p_name: name,
        p_slug: slug,
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
    redirect(
      errorUrl(
        "We could not save this property draft. Check the information and try again.",
      ),
    );
  }

  redirect("/list-property?message=Property+draft+created.");
}
