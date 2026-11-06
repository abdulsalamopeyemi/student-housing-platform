import "server-only";

import { getCurrentUser } from "@/lib/supabase/auth-server";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { Tables } from "@/types/database";

export type Provider = Tables<"providers">;

export async function getCurrentProvider() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, provider: null };
  }

  const providers = await supabaseAuthenticatedRest<Provider[]>(
    `providers?profile_id=eq.${encodeURIComponent(user.id)}&select=*&limit=1`,
  );

  return {
    user,
    provider: providers[0] ?? null,
  };
}
