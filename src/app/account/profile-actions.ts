"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function accountMessage(message: string) {
  return `/account?message=${encodeURIComponent(message)}`;
}

function accountError(message: string) {
  return `/account?error=${encodeURIComponent(message)}`;
}

export async function updateStudentProfile(formData: FormData) {
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/account");
  }

  if (profile?.role !== "student") {
    redirect("/explore");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const universityId = String(formData.get("universityId") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 100) {
    redirect(accountError("Enter your name using 2 to 100 characters."));
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (
    phone &&
    (!/^[+\d()\s.-]+$/.test(phone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 20)
  ) {
    redirect(accountError("Enter a valid phone number or leave it blank."));
  }

  if (
    universityId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      universityId,
    )
  ) {
    redirect(accountError("Choose a university from the list."));
  }

  let universityExists = !universityId;

  if (universityId) {
    try {
      const universities = await supabaseAuthenticatedRest<Array<{ id: string }>>(
        `universities?id=eq.${encodeURIComponent(universityId)}&select=id&limit=1`,
      );
      universityExists = Boolean(universities[0]);
    } catch {
      redirect(accountError("We could not verify the selected university. Try again."));
    }
  }

  if (!universityExists) {
    redirect(accountError("Choose a university from the list."));
  }

  let updated: Array<{ id: string }>;

  try {
    updated = await supabaseAuthenticatedRest<Array<{ id: string }>>(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          full_name: fullName,
          phone: phone || null,
          university_id: universityId || null,
        }),
      },
    );
  } catch {
    redirect(accountError("Your profile could not be updated. Try again."));
  }

  if (updated.length === 0) {
    redirect(
      accountError(
        "Your profile was not updated. Refresh the page and try again.",
      ),
    );
  }

  revalidatePath("/account");
  redirect(accountMessage("Your profile has been updated."));
}
