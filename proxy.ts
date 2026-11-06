import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type SupabaseAuthSession,
} from "@/lib/supabase/auth-shared";
import { supabasePublicConfig } from "@/lib/supabase/config";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function accessTokenIsValid(accessToken: string) {
  const response = await fetch(`${supabasePublicConfig.url}/auth/v1/user`, {
    headers: {
      apikey: supabasePublicConfig.publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  return response.ok;
}

async function refreshAuthSession(refreshToken: string) {
  const response = await fetch(
    `${supabasePublicConfig.url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabaseAuthSession;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", cookieOptions(0));
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", cookieOptions(0));

  return response;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken && (await accessTokenIsValid(accessToken))) {
    return NextResponse.next({ request });
  }

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  const session = await refreshAuthSession(refreshToken);

  if (!session) {
    return redirectToLogin(request);
  }

  request.cookies.set(ACCESS_TOKEN_COOKIE, session.access_token);
  request.cookies.set(REFRESH_TOKEN_COOKIE, session.refresh_token);

  const response = NextResponse.next({ request });

  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    cookieOptions(session.expires_in),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    cookieOptions(60 * 60 * 24 * 60),
  );

  return response;
}

export const config = {
  matcher: ["/provider/:path*", "/list-property", "/account/:path*"],
};
