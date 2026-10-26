"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/data/admin";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function paymentsMessage(message: string) {
  return `/admin/payments?message=${encodeURIComponent(message)}`;
}

export async function configureProviderPaystackAccount(formData: FormData) {
  const { user } = await requireAdmin("/admin/payments");
  const providerId = String(formData.get("providerId") ?? "").trim();
  const subaccountCode = String(
    formData.get("subaccountCode") ?? "",
  ).trim();
  const status = String(formData.get("status") ?? "pending").trim();

  if (!providerId) {
    redirect(paymentsMessage("Provider could not be identified."));
  }

  if (!/^ACCT_[A-Za-z0-9]+$/.test(subaccountCode)) {
    redirect(
      paymentsMessage(
        "Enter a valid Paystack subaccount code beginning with ACCT_.",
      ),
    );
  }

  if (!["pending", "active", "disabled"].includes(status)) {
    redirect(paymentsMessage("Choose a valid payment-account status."));
  }

  const providers = await supabaseAuthenticatedRest<
    Array<{ id: string; provider_type: string; verification_status: string }>
  >(
    `providers?id=eq.${encodeURIComponent(
      providerId,
    )}&provider_type=in.(landlord,property_manager)&verification_status=eq.verified&select=id,provider_type,verification_status&limit=1`,
  );

  if (!providers[0]) {
    redirect(
      paymentsMessage(
        "Only verified landlords or property managers can receive accommodation payments.",
      ),
    );
  }

  const existing = await supabaseAuthenticatedRest<
    Array<{ provider_id: string }>
  >(
    `provider_payment_accounts?provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=provider_id&limit=1`,
  );

  try {
    if (existing.length > 0) {
      await supabaseAuthenticatedRest(
        `provider_payment_accounts?provider_id=eq.${encodeURIComponent(
          providerId,
        )}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({
            subaccount_code: subaccountCode,
            status,
            updated_at: new Date().toISOString(),
          }),
        },
      );
    } else {
      await supabaseAuthenticatedRest("provider_payment_accounts", {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify({
          provider_id: providerId,
          processor: "paystack",
          subaccount_code: subaccountCode,
          status,
          created_by_admin_user_id: user.id,
        }),
      });
    }
  } catch {
    redirect(
      paymentsMessage(
        "Payment account could not be saved. Check that the subaccount code is unique.",
      ),
    );
  }

  revalidatePath("/admin/payments");
  revalidatePath("/account");
  redirect(paymentsMessage("Provider payment account updated."));
}
