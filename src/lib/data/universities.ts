import { cacheLife } from "next/cache";

import type { Tables } from "@/types/database";
import { supabasePublicRest } from "@/lib/supabase/public-rest";

export type University = Tables<"universities">;

// Universities are public and rarely change, so they are cached with
// "use cache". With Cache Components enabled, fetch's `cache: "force-cache"`
// alone no longer lets pages that read this data prerender.
export async function getUniversities(): Promise<University[]> {
  "use cache";
  cacheLife("hours");

  return supabasePublicRest<University[]>(
    "universities?select=*&order=name.asc",
  );
}

export async function getUniversityBySlug(
  slug: string,
): Promise<University | null> {
  "use cache";
  cacheLife("hours");

  const rows = await supabasePublicRest<University[]>(
    `universities?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
  );

  return rows[0] ?? null;
}
