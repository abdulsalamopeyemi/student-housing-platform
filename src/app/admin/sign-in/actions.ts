"use server";

import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin/admin-session";
import { safeAdminNextPath } from "@/lib/supabase/auth-shared";

function signInRedirect(type: "error" | "message", message: string) {
  const params = new URLSearchParams({ [type]: message });
  return `/admin/sign-in?${params.toString()}`;
}

export async function adminSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = safeAdminNextPath(formData.get("next"));

  if (!email.trim() || !password) {
    redirect(signInRedirect("error", "Enter your admin email and password."));
  }

  if (!verifyAdminCredentials(email, password)) {
    const configured =
      process.env.ADMIN_LOGIN_EMAIL?.trim() &&
      process.env.ADMIN_LOGIN_PASSWORD;
    redirect(
      signInRedirect(
        "error",
        configured
          ? "Email or password is incorrect."
          : "Admin sign-in is not configured. Set ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD in the hosting environment, then redeploy.",
      ),
    );
  }

  await createAdminSession();
  redirect(nextPath);
}

export async function adminSignOut() {
  await clearAdminSession();
  redirect("/admin/sign-in?message=You+have+signed+out.");
}
