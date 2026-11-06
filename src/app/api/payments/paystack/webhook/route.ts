import { NextResponse } from "next/server";

import { paystackWebhookIsValid } from "@/lib/payments/paystack";
import { verifyAndRecordPaystackPayment } from "@/lib/payments/verification";

interface PaystackWebhookEvent {
  event?: string;
  data?: {
    reference?: string;
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  try {
    if (!paystackWebhookIsValid(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Payment webhook is not configured." },
      { status: 503 },
    );
  }

  let event: PaystackWebhookEvent;

  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;

  if (!reference) {
    return NextResponse.json({ received: true });
  }

  try {
    await verifyAndRecordPaystackPayment(reference);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Payment verification could not be completed." },
      { status: 500 },
    );
  }
}
