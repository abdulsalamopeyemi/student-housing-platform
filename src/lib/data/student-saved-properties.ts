import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

export async function isPropertySaved(propertyId: string) {
  try {
    const rows = await supabaseAuthenticatedRest<Array<{ property_id: string }>>(
      `saved_properties?property_id=eq.${encodeURIComponent(
        propertyId,
      )}&select=property_id&limit=1`,
    );

    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function getStudentSavedPropertyIds() {
  const rows = await supabaseAuthenticatedRest<Array<{ property_id: string }>>(
    "saved_properties?select=property_id",
  );

  return new Set(rows.map((row) => row.property_id));
}
