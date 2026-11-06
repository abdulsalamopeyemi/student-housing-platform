import "server-only";

import { verifyPaystackTransaction } from "@/lib/payments/paystack";
import { supabaseSecretRest } from "@/lib/supabase/secret-rest";

interface StoredPayment {
  id: string;
  reference: string;
  amount_kobo: number;
  currency: string;
  status: string;
}

function mapGatewayStatus(status: string) {
  if (status === "success") return "paid";
  if (status === "abandoned") return "abandoned";
  if (status === "failed") return "failed";
  if (status === "reversed") return "reversed";
  return "pending";
}

export interface VerifiedPaymentResult {
  found: boolean;
  paid: boolean;
  status: string;
  message: string;
}

export async function verifyAndRecordPaystackPayment(
  reference: string,
): Promise<VerifiedPaymentResult> {
  const rows = await supabaseSecretRest<StoredPayment[]>(
    `accommodation_payments?reference=eq.${encodeURIComponent(
      reference,
    )}&select=id,reference,amount_kobo,currency,status&limit=1`,
  );

  const payment = rows[0];

  if (!payment) {
    return {
      found: false,
      paid: false,
      status: "not_found",
      message: "Payment record was not found.",
    };
  }

  if (payment.status === "paid") {
    return {
      found: true,
      paid: true,
      status: "paid",
      message: "Payment has already been verified.",
    };
  }

  const verification = await verifyPaystackTransaction(reference);
  const gateway = verification.data;

  const amountMatches =
    Number(gateway.amount) === Number(payment.amount_kobo);
  const currencyMatches =
    String(gateway.currency).toUpperCase() ===
    String(payment.currency).toUpperCase();

  if (gateway.status === "success" && (!amountMatches || !currencyMatches)) {
    await supabaseSecretRest(
      `accommodation_payments?id=eq.${encodeURIComponent(payment.id)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          status: "failed",
          gateway_transaction_id: gateway.id,
          gateway_response:
            "Gateway payment did not match the expected amount or currency.",
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      },
    );

    return {
      found: true,
      paid: false,
      status: "failed",
      message:
        "Payment verification failed because the amount or currency did not match.",
    };
  }

  const nextStatus = mapGatewayStatus(gateway.status);
  const paidAt =
    nextStatus === "paid"
      ? gateway.paid_at || new Date().toISOString()
      : null;

  await supabaseSecretRest(
    `accommodation_payments?id=eq.${encodeURIComponent(payment.id)}`,
    {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({
        status: nextStatus,
        gateway_transaction_id: gateway.id,
        channel: gateway.channel || null,
        gateway_response: gateway.gateway_response || null,
        paid_at: paidAt,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    },
  );

  return {
    found: true,
    paid: nextStatus === "paid",
    status: nextStatus,
    message:
      nextStatus === "paid"
        ? "Payment verified successfully."
        : "Payment has not been completed yet.",
  };
}
