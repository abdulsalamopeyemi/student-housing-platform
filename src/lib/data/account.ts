import "server-only";

import { getCurrentUser } from "@/lib/supabase/auth-server";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { Tables } from "@/types/database";

export type AccountProfile = Pick<
  Tables<"profiles">,
  "id" | "full_name" | "role"
>;

export async function getCurrentAccount() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, profile: null };
  }

  try {
    const profiles = await supabaseAuthenticatedRest<AccountProfile[]>(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=id,full_name,role&limit=1`,
    );

    return {
      user,
      profile: profiles[0] ?? null,
    };
  } catch {
    return { user, profile: null };
  }
}
