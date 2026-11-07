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
  requestPasswordRecovery,
  signInWithPassword,
  signUpWithPassword,
  updateCurrentUserPassword,
} from "@/lib/supabase/auth-server";
import {
  type AccountType,
  safeNextPath,
} from "@/lib/supabase/auth-shared";

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

function signupRedirectUrl(
  type: "error" | "message",
  message: string,
  nextPath: string,
  accountType?: string,
) {
  const params = new URLSearchParams({
    [type]: message,
    next: nextPath,
  });

  if (accountType === "provider" || accountType === "student") {
    params.set("accountType", accountType);
  }

  return `/signup?${params.toString()}`;
}

function checkEmailRedirectUrl(
  email: string,
  nextPath: string,
  type?: "error" | "message",
  message?: string,
) {
  const params = new URLSearchParams({
    email,
    next: nextPath,
  });

  if (type && message) {
    params.set(type, message);
  }

  return `/auth/check-email?${params.toString()}`;
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

function loginDestination(
  nextPath: string,
  role: "student" | "provider" | "admin" | null,
  accountType: AccountType,
) {
  if (nextPath !== "/explore" && nextPath !== "/account") {
    return nextPath;
  }

  if (role === "provider" || role === "admin") {
    return dashboardForRole(role);
  }

  if (accountType === "provider") {
    return "/provider/onboarding?next=/list-property";
  }

  return dashboardForRole(role);
}

async function authRedirectUrl(
  path: string,
  nextPath: string,
): Promise<string | null> {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    try {
      const siteUrl = new URL(configuredSiteUrl);
      const isLocalHost =
        siteUrl.hostname === "localhost" ||
        siteUrl.hostname === "127.0.0.1" ||
        siteUrl.hostname === "[::1]" ||
        siteUrl.hostname.endsWith(".localhost");

      if (
        !["http:", "https:"].includes(siteUrl.protocol) ||
        (process.env.NODE_ENV === "production" &&
          (siteUrl.protocol !== "https:" || isLocalHost))
      ) {
        return null;
      }

      const redirectUrl = new URL(path, siteUrl.origin);
      redirectUrl.searchParams.set("next", nextPath);
      return redirectUrl.toString();
    } catch {
      return null;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return `http://localhost:3000${path}?next=${encodeURIComponent(nextPath)}`;
  }

  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}${path}?next=${encodeURIComponent(nextPath)}`;
}

async function confirmationRedirectUrl(nextPath: string) {
  return authRedirectUrl("/auth/confirm", nextPath);
}

const productionRedirectConfigurationError =
  "Account email links are not configured for this deployment. Set NEXT_PUBLIC_SITE_URL to the deployed app origin, then try again.";

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

  const { session, error } = await signInWithPassword(email, password);

  if (error) {
    redirect(
      loginRedirectUrl(
        "error",
        friendlyAuthError(error, "login"),
        nextPath,
      ),
    );
  }

  const { profile } = await getCurrentAccount();
  const accountType =
    session?.user.user_metadata?.account_type === "provider"
      ? "provider"
      : "student";
  redirect(
    loginDestination(nextPath, profile?.role ?? null, accountType),
  );
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const requestedNextPath = safeNextPath(formData.get("next"));
  const accountType = String(formData.get("accountType") ?? "student");
  const isPortalPath = ["/explore", "/account", "/list-property"].includes(
    requestedNextPath,
  );
  const nextPath =
    accountType === "provider" && isPortalPath
      ? "/provider/onboarding?next=/list-property"
      : requestedNextPath === "/explore"
        ? "/account"
        : requestedNextPath;
  const emailError = submittedEmailError(email);

  if (accountType !== "student" && accountType !== "provider") {
    redirect(
      signupRedirectUrl(
        "error",
        "Choose whether you are looking for accommodation or listing accommodation.",
        requestedNextPath,
      ),
    );
  }

  if (fullName.length < 2 || fullName.length > 100) {
    redirect(
      signupRedirectUrl(
        "error",
        "Enter your full name using 2 to 100 characters.",
        nextPath,
        accountType,
      ),
    );
  }

  if (emailError) {
    redirect(signupRedirectUrl("error", emailError, nextPath, accountType));
  }

  if (password.length < 8) {
    redirect(
      signupRedirectUrl(
        "error",
        "Use a password with at least 8 characters.",
        nextPath,
        accountType,
      ),
    );
  }

  if (password !== confirmPassword) {
    redirect(
      signupRedirectUrl(
        "error",
        "The passwords do not match.",
        nextPath,
        accountType,
      ),
    );
  }

  const emailRedirectTo = await confirmationRedirectUrl(nextPath);

  if (!emailRedirectTo) {
    redirect(
      signupRedirectUrl(
        "error",
        productionRedirectConfigurationError,
        nextPath,
        accountType,
      ),
    );
  }

  const { session, error } = await signUpWithPassword(
    fullName,
    email,
    password,
    accountType,
    emailRedirectTo,
  );

  if (error) {
    redirect(
      signupRedirectUrl(
        "error",
        friendlyAuthError(error, "signup"),
        nextPath,
        accountType,
      ),
    );
  }

  if (session) {
    redirect(nextPath);
  }

  redirect(checkEmailRedirectUrl(email, nextPath));
}

export async function resendConfirmation(formData: FormData) {
  const email = normalizeEmail(formData.get("resendEmail"));
  const nextPath = safeNextPath(formData.get("next"));
  const emailError = submittedEmailError(email);

  if (emailError) {
    redirect(loginRedirectUrl("error", emailError, nextPath));
  }

  const emailRedirectTo = await confirmationRedirectUrl(nextPath);

  if (!emailRedirectTo) {
    redirect(
      checkEmailRedirectUrl(
        email,
        nextPath,
        "error",
        productionRedirectConfigurationError,
      ),
    );
  }
  const { error } = await resendSignupConfirmation(email, emailRedirectTo);

  if (error) {
    redirect(
      checkEmailRedirectUrl(
        email,
        nextPath,
        "error",
        friendlyAuthError(error, "resend"),
      ),
    );
  }

  redirect(
    checkEmailRedirectUrl(
      email,
      nextPath,
      "message",
      "If an unconfirmed account exists for that address, a new confirmation email has been requested. Check your inbox and spam folder.",
    ),
  );
}

export async function requestPasswordReset(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const emailError = submittedEmailError(email);

  if (emailError) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(emailError)}`);
  }

  const redirectTo = await authRedirectUrl("/auth/recover", "/auth/reset-password");

  if (!redirectTo) {
    redirect(
      `/auth/forgot-password?error=${encodeURIComponent(
        productionRedirectConfigurationError,
      )}`,
    );
  }

  let recoveryFailed = false;

  try {
    const { error } = await requestPasswordRecovery(email, redirectTo);
    recoveryFailed = Boolean(error);
  } catch {
    recoveryFailed = true;
  }

  if (recoveryFailed) {
    redirect(
      "/auth/forgot-password?error=We+could+not+request+a+reset+right+now.+Try+again+shortly.",
    );
  }

  redirect(
    "/auth/forgot-password?message=If+an+account+exists+for+that+email%2C+a+password+reset+link+has+been+sent.",
  );
}

export async function resetPassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      "/auth/reset-password?error=Use+a+password+with+at+least+8+characters.",
    );
  }

  if (password !== confirmPassword) {
    redirect("/auth/reset-password?error=The+passwords+do+not+match.");
  }

  const { user } = await getCurrentAccount();

  if (!user) {
    redirect(
      "/auth/forgot-password?error=Your+reset+session+has+expired.+Request+a+new+link.",
    );
  }

  let passwordUpdateFailed = false;

  try {
    const { error } = await updateCurrentUserPassword(password);
    passwordUpdateFailed = Boolean(error);
  } catch {
    passwordUpdateFailed = true;
  }

  if (passwordUpdateFailed) {
    redirect(
      "/auth/reset-password?error=We+could+not+update+your+password.+Request+a+new+reset+link+and+try+again.",
    );
  }

  redirect("/account?message=Your+password+has+been+updated.");
}
