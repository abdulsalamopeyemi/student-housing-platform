import "server-only";

import { supabasePublicConfig } from "@/lib/supabase/config";

interface SecretRestOptions extends RequestInit {
  prefer?: string;
}

function getSupabaseSecretKey() {
  const key = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!key) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured on the server.",
    );
  }

  return key;
}

export async function supabaseSecretRest<T>(
  path: string,
  options: SecretRestOptions = {},
): Promise<T> {
  const secretKey = getSupabaseSecretKey();
  const { prefer, headers, ...requestOptions } = options;

  const response = await fetch(`${supabasePublicConfig.url}/rest/v1/${path}`, {
    ...requestOptions,
    headers: {
      apikey: secretKey,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Supabase server request failed with status ${response.status}: ${await response.text()}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
