"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

const supportCategories = [
  "account",
  "property",
  "inspection",
  "payment",
  "privacy",
  "other",
] as const;

function supportRedirect(type: "error" | "message", message: string) {
  redirect(`/support?${type}=${encodeURIComponent(message)}`);
}

export async function submitSupportRequest(formData: FormData) {
  const { user } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/support");
  }

  const category = String(formData.get("category") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!user.email) {
    supportRedirect(
      "error",
      "Your account needs a confirmed email address. You can contact support directly by email.",
    );
  }

  if (!supportCategories.includes(category as (typeof supportCategories)[number])) {
    supportRedirect("error", "Choose the topic that best fits your request.");
  }

  if (subject.length < 5 || subject.length > 120) {
    supportRedirect("error", "Use a subject between 5 and 120 characters.");
  }

  if (message.length < 20 || message.length > 2000) {
    supportRedirect("error", "Use a message between 20 and 2,000 characters.");
  }

  try {
    await supabaseAuthenticatedRest("support_requests", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        user_id: user.id,
        contact_email: user.email,
        category,
        subject,
        message,
        status: "open",
      }),
    });
  } catch {
    supportRedirect(
      "error",
      "Your message could not be sent. Please try again or email support directly.",
    );
  }

  revalidatePath("/admin/reviews");
  supportRedirect(
    "message",
    "Your support request has been sent. We’ll reply to the email on your account.",
  );
}
