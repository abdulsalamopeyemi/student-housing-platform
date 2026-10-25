"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  emailValidationError,
  normalizeEmail,
  suggestedEmailCorrection,
} from "@/lib/auth/email-validation";
import { getCurrentAccount } from "@/lib/data/account";
import {
  resendSignupConfirmation,
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/supabase/auth-server";
import { safeNextPath } from "@/lib/supabase/auth-shared";

function loginRedirectUrl(
  type: "error" | "message",
  message: string,
  nextPath: string,
) {
  const params = new URLSearchParams({
    [type]: message,
    next: nextPath,
  });

  return `/login?${params.toString()}`;
}

function dashboardForRole(role: "student" | "provider" | "admin" | null) {
  if (role === "admin") {
    return "/admin/reviews";
  }

  if (role === "provider") {
    return "/list-property";
  }

  return "/account";
}

async function confirmationRedirectUrl(nextPath: string) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    const url = new URL("/auth/confirm", configuredSiteUrl);
    url.searchParams.set("next", nextPath);
    return url.toString();
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return `http://localhost:3000/auth/confirm?next=${encodeURIComponent(nextPath)}`;
  }

  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}/auth/confirm?next=${encodeURIComponent(nextPath)}`;
}

function submittedEmailError(email: string) {
  const validationError = emailValidationError(email);

  if (validationError) {
    return validationError;
  }

  const suggestion = suggestedEmailCorrection(email);

  if (suggestion) {
    return `That email domain looks mistyped. Did you mean ${suggestion}?`;
  }

  return null;
}

function friendlyAuthError(
  error: string,
  context: "login" | "signup" | "resend",
) {
  const normalized = error.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Open the confirmation email we sent, or resend it below.";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "Incorrect email or password.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("email rate limit exceeded")
  ) {
    return "Email sending is temporarily limited because several confirmation emails were requested while testing. Your account may already exist, so do not keep creating it again. Use your confirmed account to sign in, or try Resend confirmation later.";
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already registered")
  ) {
    return "An account already exists with this email. Sign in instead, or resend the confirmation email if you have not verified it yet.";
  }

  if (context === "signup") {
    return "We could not create your account. Check your details and try again.";
  }

  if (context === "resend") {
    return "We could not resend the confirmation email. Try again shortly.";
  }

  return "We could not sign you in. Check your details and try again.";
}

export async function login(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));
  const emailError = submittedEmailError(email);

  if (emailError) {
    redirect(loginRedirectUrl("error", emailError, nextPath));
  }

  if (!password) {
    redirect(loginRedirectUrl("error", "Enter your password.", nextPath));
  }

  const { error } = await signInWithPassword(email, password);

  if (error) {
    redirect(
      loginRedirectUrl(
        "error",
        friendlyAuthError(error, "login"),
        nextPath,
      ),
    );
  }

  if (nextPath !== "/explore") {
    redirect(nextPath);
  }

  const { profile } = await getCurrentAccount();
  redirect(dashboardForRole(profile?.role ?? null));
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const requestedNextPath = safeNextPath(formData.get("next"));
  const accountType = String(formData.get("accountType") ?? "student");
  const nextPath =
    requestedNextPath === "/explore"
      ? accountType === "provider"
        ? "/provider/onboarding?next=/list-property"
        : "/account"
      : requestedNextPath;
  const emailError = submittedEmailError(email);

  if (accountType !== "student" && accountType !== "provider") {
    redirect(
      loginRedirectUrl(
        "error",
        "Choose whether you are looking for accommodation or listing accommodation.",
        requestedNextPath,
      ),
    );
  }

  if (fullName.length < 2 || fullName.length > 100) {
    redirect(
      loginRedirectUrl(
        "error",
        "Enter your full name using 2 to 100 characters.",
        nextPath,
      ),
    );
  }

  if (emailError) {
    redirect(loginRedirectUrl("error", emailError, nextPath));
  }

  if (password.length < 8) {
    redirect(
      loginRedirectUrl(
        "error",
        "Use a password with at least 8 characters.",
        nextPath,
      ),
    );
  }

  if (password !== confirmPassword) {
    redirect(
      loginRedirectUrl(
        "error",
        "The passwords do not match.",
        nextPath,
      ),
    );
  }

  const emailRedirectTo = await confirmationRedirectUrl(nextPath);

  const { session, error } = await signUpWithPassword(
    fullName,
    email,
    password,
    emailRedirectTo,
  );

  if (error) {
    redirect(
      loginRedirectUrl(
        "error",
        friendlyAuthError(error, "signup"),
        nextPath,
      ),
    );
  }

  if (session) {
    redirect(nextPath);
  }

  redirect(
    loginRedirectUrl(
      "message",
      "Account created. We sent a confirmation email. Confirm your address before signing in. If it does not arrive, use the resend option below.",
      nextPath,
    ),
  );
}

export async function resendConfirmation(formData: FormData) {
  const email = normalizeEmail(formData.get("resendEmail"));
  const nextPath = safeNextPath(formData.get("next"));
  const emailError = submittedEmailError(email);

  if (emailError) {
    redirect(loginRedirectUrl("error", emailError, nextPath));
  }

  const { error } = await resendSignupConfirmation(email);

  if (error) {
    redirect(
      loginRedirectUrl(
        "error",
        friendlyAuthError(error, "resend"),
        nextPath,
      ),
    );
  }

  redirect(
    loginRedirectUrl(
      "message",
      "If an unconfirmed account exists for that email, a new confirmation message has been sent. Check Inbox, Spam, Promotions, and Updates.",
      nextPath,
    ),
  );
}
