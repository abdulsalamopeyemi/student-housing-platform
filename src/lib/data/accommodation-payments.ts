import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import { supabaseSecretRest } from "@/lib/supabase/secret-rest";

export interface AccommodationPayment {
  id: string;
  student_user_id: string;
  inspection_request_id: string;
  property_id: string;
  room_type_id: string;
  provider_id: string;
  reference: string;
  amount_kobo: number;
  currency: "NGN";
  status:
    | "initialized"
    | "pending"
    | "paid"
    | "failed"
    | "abandoned"
    | "reversed"
    | "refunded";
  checkout_url: string | null;
  gateway_transaction_id: number | null;
  channel: string | null;
  gateway_response: string | null;
  paid_at: string | null;
  verified_at: string | null;
  created_at: string;
  properties?: {
    name: string;
    slug: string;
  } | null;
}

interface PaymentInspectionRow {
  id: string;
  student_user_id: string;
  property_id: string;
  room_type_id: string | null;
  status: string;
}

interface PaymentPropertyRow {
  id: string;
  name: string;
  slug: string;
  provider_id: string;
  publication_status: string;
  verification_status: string;
}

interface PaymentRoomRow {
  id: string;
  property_id: string;
  name: string;
  annual_rent: number;
  available_count: number;
  property_fees: Array<{
    label: string;
    amount: number;
    required: boolean;
  }>;
}

interface ProviderPaymentAccountRow {
  provider_id: string;
  subaccount_code: string;
  status: string;
}

export interface AccommodationPaymentContext {
  inspection: PaymentInspectionRow;
  property: PaymentPropertyRow;
  room: PaymentRoomRow;
  providerPaymentAccount: ProviderPaymentAccountRow;
  amountKobo: number;
}

export async function getAccommodationPaymentContext(
  studentUserId: string,
  inspectionRequestId: string,
): Promise<AccommodationPaymentContext | null> {
  const inspections = await supabaseSecretRest<PaymentInspectionRow[]>(
    `inspection_requests?id=eq.${encodeURIComponent(
      inspectionRequestId,
    )}&student_user_id=eq.${encodeURIComponent(
      studentUserId,
    )}&status=eq.completed&select=id,student_user_id,property_id,room_type_id,status&limit=1`,
  );

  const inspection = inspections[0];

  if (!inspection) {
    return null;
  }

  const properties = await supabaseSecretRest<PaymentPropertyRow[]>(
    `properties?id=eq.${encodeURIComponent(
      inspection.property_id,
    )}&publication_status=eq.published&verification_status=eq.verified&select=id,name,slug,provider_id,publication_status,verification_status&limit=1`,
  );

  const property = properties[0];

  if (!property) {
    return null;
  }

  const roomFilter = inspection.room_type_id
    ? `id=eq.${encodeURIComponent(inspection.room_type_id)}&`
    : `property_id=eq.${encodeURIComponent(property.id)}&`;

  const rooms = await supabaseSecretRest<PaymentRoomRow[]>(
    `room_types?${roomFilter}select=id,property_id,name,annual_rent,available_count,property_fees(label,amount,required)&order=created_at.asc&limit=1`,
  );

  const room = rooms[0];

  if (!room || room.property_id !== property.id || room.available_count <= 0) {
    return null;
  }

  const paymentAccounts = await supabaseSecretRest<ProviderPaymentAccountRow[]>(
    `provider_payment_accounts?provider_id=eq.${encodeURIComponent(
      property.provider_id,
    )}&status=eq.active&select=provider_id,subaccount_code,status&limit=1`,
  );

  const providerPaymentAccount = paymentAccounts[0];

  if (!providerPaymentAccount) {
    return null;
  }

  const requiredAdditionalFees = room.property_fees
    .filter((fee) => fee.required)
    .reduce((total, fee) => total + Number(fee.amount), 0);

  const amountKobo = Math.round(
    (Number(room.annual_rent) + requiredAdditionalFees) * 100,
  );

  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    return null;
  }

  return {
    inspection,
    property,
    room,
    providerPaymentAccount,
    amountKobo,
  };
}

export async function getExistingInspectionPayments(
  inspectionRequestId: string,
) {
  return supabaseAuthenticatedRest<AccommodationPayment[]>(
    `accommodation_payments?inspection_request_id=eq.${encodeURIComponent(
      inspectionRequestId,
    )}&select=id,student_user_id,inspection_request_id,property_id,room_type_id,provider_id,reference,amount_kobo,currency,status,checkout_url,gateway_transaction_id,channel,gateway_response,paid_at,verified_at,created_at&order=created_at.desc`,
  );
}

export async function getStudentPayments() {
  return supabaseAuthenticatedRest<AccommodationPayment[]>(
    "accommodation_payments?select=id,student_user_id,inspection_request_id,property_id,room_type_id,provider_id,reference,amount_kobo,currency,status,checkout_url,gateway_transaction_id,channel,gateway_response,paid_at,verified_at,created_at,properties(name,slug)&order=created_at.desc",
  );
}

export async function getStudentPaymentByReference(reference: string) {
  const rows = await supabaseAuthenticatedRest<AccommodationPayment[]>(
    `accommodation_payments?reference=eq.${encodeURIComponent(
      reference,
    )}&select=id,student_user_id,inspection_request_id,property_id,room_type_id,provider_id,reference,amount_kobo,currency,status,checkout_url,gateway_transaction_id,channel,gateway_response,paid_at,verified_at,created_at,properties(name,slug)&limit=1`,
  );

  return rows[0] ?? null;
}
