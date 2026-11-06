export const ACCESS_TOKEN_COOKIE = "student-housing-access-token";
export const REFRESH_TOKEN_COOKIE = "student-housing-refresh-token";

export type AccountType = "student" | "provider";

export interface SupabaseAuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: {
    full_name?: string;
    account_type?: AccountType;
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

export function safeAdminNextPath(
  value: FormDataEntryValue | string | null | undefined,
) {
  const path = safeNextPath(value);

  if (!path.startsWith("/admin/") || path === "/admin/sign-in") {
    return "/admin/reviews";
  }

  return path;
}
