import type { Tables } from "@/types/database";
import { supabasePublicRest } from "@/lib/supabase/public-rest";

type University = Tables<"universities">;

export async function getUniversityBySlug(
  slug: string,
): Promise<University | null> {
  const rows = await supabasePublicRest<University[]>(
    `universities?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    {
      cache: "force-cache",
    },
  );

  return rows[0] ?? null;
}
