import type { Tables } from "@/types/database";
import { supabasePublicRest } from "@/lib/supabase/public-rest";

export type Amenity = Tables<"amenities">;

export async function getAmenities(): Promise<Amenity[]> {
  return supabasePublicRest<Amenity[]>(
    "amenities?select=*&order=category.asc,name.asc",
    {
      cache: "no-store",
    },
  );
}
