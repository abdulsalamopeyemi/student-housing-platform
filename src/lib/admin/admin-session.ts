import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { normalizeEmail } from "@/lib/auth/email-validation";

const ADMIN_SESSION_COOKIE = "student-housing-admin-session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function getConfiguredCredentials() {
  const email = normalizeEmail(process.env.ADMIN_LOGIN_EMAIL);
  const password = process.env.ADMIN_LOGIN_PASSWORD ?? "";

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function sessionSignature(email: string, expiresAt: number, password: string) {
  return createHmac("sha256", password)
    .update(`admin-session:v1:${email}:${expiresAt}`)
    .digest("base64url");
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/admin",
    maxAge,
  };
}

export function verifyAdminCredentials(email: string, password: string) {
  const configured = getConfiguredCredentials();

  return Boolean(
    configured &&
      constantTimeEqual(normalizeEmail(email), configured.email) &&
      constantTimeEqual(password, configured.password),
  );
}

export async function createAdminSession() {
  const configured = getConfiguredCredentials();

  if (!configured) {
    throw new Error("Admin sign-in credentials are not configured.");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const signature = sessionSignature(
    configured.email,
    expiresAt,
    configured.password,
  );
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    `${expiresAt}.${signature}`,
    cookieOptions(ADMIN_SESSION_MAX_AGE),
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", cookieOptions(0));
}

export async function getAdminSession() {
  const configured = getConfiguredCredentials();

  if (!configured) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const [expiresAtText, signature] = token?.split(".") ?? [];

  if (!expiresAtText || !signature || !/^\d+$/.test(expiresAtText)) {
    return null;
  }

  const expiresAt = Number(expiresAtText);
  const now = Math.floor(Date.now() / 1000);

  if (expiresAt <= now || expiresAt > now + ADMIN_SESSION_MAX_AGE) {
    return null;
  }

  const expected = sessionSignature(
    configured.email,
    expiresAt,
    configured.password,
  );

  return constantTimeEqual(signature, expected) ? { email: configured.email } : null;
}
