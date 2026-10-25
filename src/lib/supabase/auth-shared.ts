export const ACCESS_TOKEN_COOKIE = "student-housing-access-token";
export const REFRESH_TOKEN_COOKIE = "student-housing-refresh-token";

export interface SupabaseAuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
}

export interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseAuthUser;
}

export function safeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "/explore";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/explore";
  }

  return value;
}
