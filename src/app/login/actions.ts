"use server";

import { redirect } from "next/navigation";

import {
  safeNextPath,
} from "@/lib/supabase/auth-shared";
import {
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/supabase/auth-server";

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

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!email || !password) {
    redirect(loginRedirectUrl("error", "Enter your email and password.", nextPath));
  }

  const { error } = await signInWithPassword(email, password);

  if (error) {
    redirect(loginRedirectUrl("error", error, nextPath));
  }

  redirect(nextPath);
}

export async function signup(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (fullName.length < 2) {
    redirect(loginRedirectUrl("error", "Enter your full name.", nextPath));
  }

  if (!email) {
    redirect(loginRedirectUrl("error", "Enter a valid email address.", nextPath));
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

  const { session, error } = await signUpWithPassword(
    fullName,
    email,
    password,
  );

  if (error) {
    redirect(loginRedirectUrl("error", error, nextPath));
  }

  if (session) {
    redirect(nextPath);
  }

  redirect(
    loginRedirectUrl(
      "message",
      "Account created. Check your email to confirm your account, then sign in.",
      nextPath,
    ),
  );
}
