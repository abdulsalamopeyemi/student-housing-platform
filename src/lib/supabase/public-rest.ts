import { supabasePublicConfig } from "@/lib/supabase/config";

interface SupabaseRestOptions extends RequestInit {
  prefer?: string;
}

export async function supabasePublicRest<T>(
  path: string,
  options: SupabaseRestOptions = {},
): Promise<T> {
  const { prefer, headers, ...requestOptions } = options;

  const response = await fetch(`${supabasePublicConfig.url}/rest/v1/${path}`, {
    ...requestOptions,
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Supabase request failed with status ${response.status}: ${await response.text()}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
