import Link from "next/link";

import { configureProviderPaystackAccount } from "@/app/admin/payments/actions";
import { getPaymentProviderSetups } from "@/lib/data/admin-payments";

interface AdminPaymentsContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

function providerTypeLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function AdminPaymentsContent({
  searchParams,
}: AdminPaymentsContentProps) {
  const [providers, params] = await Promise.all([
    getPaymentProviderSetups(),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/admin/reviews"
        className="text-sm font-semibold text-[var(--emerald)]"
      >
        ← Back to admin review
      </Link>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Payments
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--forest)]">
            Provider payout setup
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Accommodation checkout is enabled only for verified providers with
            an active Paystack subaccount. The platform never stores a
            student&apos;s card or bank credentials.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--cream)] px-5 py-4 text-sm text-[var(--muted)]">
          <span className="font-bold text-[var(--forest)]">
            {providers.filter(
              (provider) => provider.paymentAccount?.status === "active",
            ).length}
          </span>{" "}
          payout-ready providers
        </div>
      </div>

      {params.message ? (
        <div
          role="status"
          className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {params.message}
        </div>
      ) : null}

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-bold">Before activating a provider</p>
        <p className="mt-1">
          Create and verify the provider&apos;s subaccount in Paystack first,
          confirm the settlement bank/account is correct, then paste only the
          resulting <strong>ACCT_…</strong> code here. Do not paste Paystack
          secret keys into this form.
        </p>
      </section>

      {providers.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-[var(--forest)]">
            No verified payout providers yet.
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Verify a landlord or property manager first.
          </p>
        </section>
      ) : (
        <div className="mt-8 grid gap-5">
          {providers.map((provider) => (
            <article
              key={provider.id}
              className="rounded-3xl border border-[var(--border)] bg-white p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                    {providerTypeLabel(provider.provider_type)}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
                    {provider.display_name ?? "Unnamed provider"}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {provider.paymentAccount
                      ? `Current status: ${provider.paymentAccount.status}`
                      : "No payout account configured"}
                  </p>
                </div>

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-bold capitalize",
                    provider.paymentAccount?.status === "active"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-[var(--cream)] text-[var(--muted)]",
                  ].join(" ")}
                >
                  {provider.paymentAccount?.status ?? "not configured"}
                </span>
              </div>

              <form
                action={configureProviderPaystackAccount}
                className="mt-6 grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-[1.3fr_0.7fr_auto]"
              >
                <input type="hidden" name="providerId" value={provider.id} />

                <label>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                    Paystack subaccount code
                  </span>
                  <input
                    required
                    name="subaccountCode"
                    defaultValue={
                      provider.paymentAccount?.subaccount_code ?? ""
                    }
                    placeholder="ACCT_xxxxxxxxx"
                    autoComplete="off"
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--emerald)]"
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={
                      provider.paymentAccount?.status ?? "pending"
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>

                <button className="self-end rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white">
                  Save payout setup
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
