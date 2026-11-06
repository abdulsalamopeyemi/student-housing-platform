"use server";

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";

import {
  getAccommodationPaymentContext,
  getExistingInspectionPayments,
} from "@/lib/data/accommodation-payments";
import { getCurrentAccount } from "@/lib/data/account";
import {
  initializePaystackTransaction,
  paymentSiteUrl,
} from "@/lib/payments/paystack";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import { supabaseSecretRest } from "@/lib/supabase/secret-rest";

function accountMessage(message: string) {
  return `/account?message=${encodeURIComponent(message)}`;
}

export async function startAccommodationPayment(formData: FormData) {
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/account");
  }

  if (profile?.role !== "student") {
    redirect("/account");
  }

  const inspectionRequestId = String(
    formData.get("inspectionRequestId") ?? "",
  ).trim();

  if (!inspectionRequestId) {
    redirect(accountMessage("Payment could not be started."));
  }

  if (!user.email) {
    redirect(
      accountMessage(
        "Your account needs an email address before you can make a payment.",
      ),
    );
  }

  let existing;
  try {
    existing = await getExistingInspectionPayments(inspectionRequestId);
  } catch {
    redirect(accountMessage("We could not check your previous payment attempts."));
  }

  const paid = existing.find((payment) => payment.status === "paid");

  if (paid) {
    redirect(
      accountMessage(
        "This accommodation payment has already been completed.",
      ),
    );
  }

  const resumable = existing.find(
    (payment) =>
      payment.status === "pending" && Boolean(payment.checkout_url),
  );

  if (resumable?.checkout_url) {
    redirect(resumable.checkout_url);
  }

  let context;
  try {
    context = await getAccommodationPaymentContext(
      user.id,
      inspectionRequestId,
    );
  } catch {
    redirect(
      accountMessage(
        "Online payments are not fully configured yet for this property.",
      ),
    );
  }

  if (!context) {
    redirect(
      accountMessage(
        "Payment is not available yet. The inspection must be completed, the room must still be available, and the provider must have an active payout account.",
      ),
    );
  }

  const reference = `housing-${randomUUID()}`;

  let payment: { id: string; reference: string } | undefined;

  try {
    const created = await supabaseAuthenticatedRest<
      Array<{ id: string; reference: string }>
    >("accommodation_payments?select=id,reference", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        student_user_id: user.id,
        inspection_request_id: context.inspection.id,
        property_id: context.property.id,
        room_type_id: context.room.id,
        provider_id: context.property.provider_id,
        reference,
        amount_kobo: context.amountKobo,
        currency: "NGN",
        processor: "paystack",
        status: "initialized",
      }),
    });

    payment = created[0];
  } catch {
    redirect(
      accountMessage(
        "Payment could not be initialized. Please refresh and try again.",
      ),
    );
  }

  if (!payment) {
    redirect(accountMessage("Payment could not be initialized."));
  }

  const siteUrl = paymentSiteUrl();
  let authorizationUrl = "";

  try {
    const initialized = await initializePaystackTransaction({
      email: user.email,
      amountKobo: context.amountKobo,
      reference,
      subaccountCode: context.providerPaymentAccount.subaccount_code,
      callbackUrl: `${siteUrl}/payments/verify?reference=${encodeURIComponent(
        reference,
      )}`,
      metadata: {
        payment_id: payment.id,
        property_id: context.property.id,
        inspection_request_id: context.inspection.id,
        cancel_action: `${siteUrl}/account?message=${encodeURIComponent(
          "Payment was cancelled. You can try again from My Account.",
        )}`,
      },
    });

    authorizationUrl = initialized.data.authorization_url;

    await supabaseSecretRest(
      `accommodation_payments?id=eq.${encodeURIComponent(payment.id)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          status: "pending",
          access_code: initialized.data.access_code,
          checkout_url: initialized.data.authorization_url,
          updated_at: new Date().toISOString(),
        }),
      },
    );
  } catch {
    try {
      await supabaseSecretRest(
        `accommodation_payments?id=eq.${encodeURIComponent(payment.id)}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({
            status: "failed",
            updated_at: new Date().toISOString(),
          }),
        },
      );
    } catch {
      // Keep the original checkout error as the user-facing outcome.
    }

    redirect(
      accountMessage(
        "The payment gateway could not be started. Please try again.",
      ),
    );
  }

  redirect(authorizationUrl);
}
