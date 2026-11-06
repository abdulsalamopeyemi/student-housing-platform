import "server-only";

import { getAccessToken } from "@/lib/supabase/auth-server";
import { supabasePublicConfig } from "@/lib/supabase/config";

interface AuthenticatedRestOptions extends RequestInit {
  prefer?: string;
}

export async function supabaseAuthenticatedRest<T>(
  path: string,
  options: AuthenticatedRestOptions = {},
): Promise<T> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Authentication required.");
  }

  const { prefer, headers, ...requestOptions } = options;

  const response = await fetch(`${supabasePublicConfig.url}/rest/v1/${path}`, {
    ...requestOptions,
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Supabase authenticated request failed with status ${response.status}: ${await response.text()}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
