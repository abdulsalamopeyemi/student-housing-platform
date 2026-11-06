"use server";

import { redirect } from "next/navigation";

import { signOutCurrentUser } from "@/lib/supabase/auth-server";

export async function signOut() {
  await signOutCurrentUser();
  redirect("/");
}
