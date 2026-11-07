import "server-only";

import { requireAdmin } from "@/lib/data/admin";
import { supabaseSecretRest } from "@/lib/supabase/secret-rest";

export interface PaymentProviderSetup {
  id: string;
  display_name: string | null;
  provider_type: "landlord" | "property_manager";
  verification_status: "verified";
  paymentAccount: {
    subaccount_code: string;
    status: "pending" | "active" | "disabled";
    updated_at: string;
  } | null;
}

export async function getPaymentProviderSetups() {
  await requireAdmin("/admin/payments");

  const [providers, accounts] = await Promise.all([
    supabaseSecretRest<
      Array<{
        id: string;
        display_name: string | null;
        provider_type: "landlord" | "property_manager";
        verification_status: "verified";
      }>
    >(
      "providers?provider_type=in.(landlord,property_manager)&verification_status=eq.verified&select=id,display_name,provider_type,verification_status&order=display_name.asc",
    ),
    supabaseSecretRest<
      Array<{
        provider_id: string;
        subaccount_code: string;
        status: "pending" | "active" | "disabled";
        updated_at: string;
      }>
    >(
      "provider_payment_accounts?select=provider_id,subaccount_code,status,updated_at",
    ),
  ]);

  const byProvider = new Map(
    accounts.map((account) => [account.provider_id, account]),
  );

  return providers.map((provider) => ({
    ...provider,
    paymentAccount: byProvider.get(provider.id) ?? null,
  }));
}
