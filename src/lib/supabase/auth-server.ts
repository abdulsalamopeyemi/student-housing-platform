import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type AccountType,
  type SupabaseAuthSession,
  type SupabaseAuthUser,
} from "@/lib/supabase/auth-shared";
import { supabasePublicConfig } from "@/lib/supabase/config";

interface AuthErrorPayload {
  message?: string;
  msg?: string;
  error_description?: string;
  error?: string;
}

function authErrorMessage(payload: AuthErrorPayload, fallback: string) {
  return (
    payload.message ??
    payload.msg ??
    payload.error_description ??
    payload.error ??
    fallback
  );
}

async function readAuthPayload(response: Response) {
  try {
    return (await response.json()) as AuthErrorPayload;
  } catch {
    return {} as AuthErrorPayload;
  }
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function storeAuthTokens(session: AuthTokens) {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    cookieOptions(session.expires_in),
  );

  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    cookieOptions(60 * 60 * 24 * 60),
  );
}

export async function storeAuthSession(session: SupabaseAuthSession) {
  await storeAuthTokens(session);
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, "", cookieOptions(0));
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", cookieOptions(0));
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<SupabaseAuthUser | null> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${supabasePublicConfig.url}/auth/v1/user`, {
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const user = (await response.json()) as SupabaseAuthUser;

  return user.email_confirmed_at ? user : null;
}

export async function adoptAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const response = await fetch(`${supabasePublicConfig.url}/auth/v1/user`, {
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      user: null,
      error: "We could not verify the confirmation session.",
    };
  }

  const user = (await response.json()) as SupabaseAuthUser;

  if (!user.email_confirmed_at) {
    return {
      user: null,
      error: "Your email address has not been confirmed.",
    };
  }

  await storeAuthTokens({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
  });

  return { user, error: null };
}

interface SupabaseAuthSettings {
  disable_signup?: boolean;
  mailer_autoconfirm?: boolean;
}

/**
 * Reads the public auth settings for the project. The signup flow uses this to
 * refuse to create accounts when email confirmation is disabled, because those
 * accounts are marked verified immediately and can sign in without ever
 * opening a confirmation message.
 */
export async function getAuthSettings(): Promise<SupabaseAuthSettings | null> {
  try {
    const response = await fetch(`${supabasePublicConfig.url}/auth/v1/settings`, {
      headers: {
        apikey: supabasePublicConfig.publishableKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as SupabaseAuthSettings;
  } catch {
    return null;
  }
}

export async function signInWithPassword(email: string, password: string) {
  const response = await fetch(
    `${supabasePublicConfig.url}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as
    | SupabaseAuthSession
    | AuthErrorPayload;

  if (!response.ok) {
    return {
      session: null,
      error: authErrorMessage(payload as AuthErrorPayload, "Unable to sign in."),
    };
  }

  const session = payload as SupabaseAuthSession;

  if (!session.user.email_confirmed_at) {
    return {
      session: null,
      error: "Email not confirmed",
    };
  }

  await storeAuthSession(session);

  return { session, error: null };
}

export async function signUpWithPassword(
  fullName: string,
  email: string,
  password: string,
  accountType: AccountType,
  emailRedirectTo?: string,
) {
  const signupUrl = new URL(`${supabasePublicConfig.url}/auth/v1/signup`);

  if (emailRedirectTo) {
    signupUrl.searchParams.set("redirect_to", emailRedirectTo);
  }

  const response = await fetch(signupUrl, {
    method: "POST",
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: fullName,
        account_type: accountType,
      },
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as
    | Partial<SupabaseAuthSession>
    | AuthErrorPayload;

  if (!response.ok) {
    return {
      session: null,
      user: null,
      error: authErrorMessage(
        payload as AuthErrorPayload,
        "Unable to create your account.",
      ),
    };
  }

  const possibleSession = payload as Partial<SupabaseAuthSession>;

  if (
    possibleSession.access_token &&
    possibleSession.refresh_token &&
    possibleSession.expires_in &&
    possibleSession.user
  ) {
    const session = possibleSession as SupabaseAuthSession;
    return { session, user: session.user, error: null };
  }

  const user =
    "user" in payload
      ? ((payload as { user?: SupabaseAuthUser }).user ?? null)
      : null;

  return { session: null, user, error: null };
}

export async function resendSignupConfirmation(
  email: string,
  emailRedirectTo?: string,
) {
  const response = await fetch(`${supabasePublicConfig.url}/auth/v1/resend`, {
    method: "POST",
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "signup",
      email,
      ...(emailRedirectTo
        ? { options: { emailRedirectTo } }
        : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readAuthPayload(response);

    return {
      error: authErrorMessage(
        payload,
        "Unable to resend the confirmation email.",
      ),
    };
  }

  return { error: null };
}

export async function requestPasswordRecovery(
  email: string,
  emailRedirectTo?: string,
) {
  const recoveryUrl = new URL(`${supabasePublicConfig.url}/auth/v1/recover`);

  if (emailRedirectTo) {
    recoveryUrl.searchParams.set("redirect_to", emailRedirectTo);
  }

  const response = await fetch(recoveryUrl, {
    method: "POST",
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readAuthPayload(response);

    return {
      error: authErrorMessage(payload, "Unable to request a password reset."),
    };
  }

  return { error: null };
}

export async function updateCurrentUserPassword(password: string) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { error: "Your password reset session has expired." };
  }

  const response = await fetch(`${supabasePublicConfig.url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readAuthPayload(response);

    return {
      error: authErrorMessage(payload, "Unable to update your password."),
    };
  }

  return { error: null };
}

export async function signOutCurrentUser() {
  const accessToken = await getAccessToken();

  if (accessToken) {
    await fetch(`${supabasePublicConfig.url}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  }

  await clearAuthSession();
}
