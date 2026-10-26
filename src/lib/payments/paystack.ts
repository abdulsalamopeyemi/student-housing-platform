import "server-only";

const PAYSTACK_API_URL = "https://api.paystack.co";

function paystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured on the server.");
  }

  return key;
}

export function paymentSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

interface PaystackInitializeInput {
  email: string;
  amountKobo: number;
  reference: string;
  subaccountCode: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    gateway_response?: string;
    channel?: string;
    paid_at?: string | null;
    metadata?: Record<string, unknown> | null;
  };
}

async function paystackRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${PAYSTACK_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${paystackSecretKey()}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as T & {
    status?: boolean;
    message?: string;
  };

  if (!response.ok || payload.status === false) {
    throw new Error(
      payload.message || `Paystack request failed with status ${response.status}.`,
    );
  }

  return payload;
}

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export async function initializePaystackTransaction(
  input: PaystackInitializeInput,
) {
  return paystackRequest<PaystackInitializeResponse>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        amount: String(input.amountKobo),
        currency: "NGN",
        reference: input.reference,
        callback_url: input.callbackUrl,
        subaccount: input.subaccountCode,
        metadata: input.metadata,
      }),
    },
  );
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

export function paystackWebhookIsValid(
  rawBody: string,
  providedSignature: string | null,
) {
  if (!providedSignature) {
    return false;
  }

  const crypto = require("node:crypto") as typeof import("node:crypto");
  const expected = crypto
    .createHmac("sha512", paystackSecretKey())
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(providedSignature, "utf8"),
  );
}
