import AdminWorkspaceNav from "@/components/admin/AdminWorkspaceNav";
import AdminPaymentsList from "@/components/admin/AdminPaymentsList";
import { getPaymentProviderSetups } from "@/lib/data/admin-payments";

interface AdminPaymentsContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default async function AdminPaymentsContent({
  searchParams,
}: AdminPaymentsContentProps) {
  const [providers, params] = await Promise.all([
    getPaymentProviderSetups(),
    searchParams,
  ]);
  const activeCount = providers.filter(
    (provider) => provider.paymentAccount?.status === "active",
  ).length;
  const pendingCount = providers.filter(
    (provider) => provider.paymentAccount?.status === "pending",
  ).length;
  const setupNeededCount = providers.filter(
    (provider) => !provider.paymentAccount,
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="ui-enter flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Payments
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--forest)]">
            Provider payout setup
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            This page records provider payout setup only. Student reservation
            checkout and room holds are not available until the gateway flow is
            ready.
          </p>
        </div>

        <AdminWorkspaceNav current="payments" />

      </div>

      {params.message ? (
        <div
          role="status"
          className="ui-enter mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {params.message}
        </div>
      ) : null}

      <section className="ui-enter mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 [animation-delay:80ms]">
        <p className="font-bold">Before activating a provider</p>
        <p className="mt-1">
          Create and verify the provider&apos;s subaccount in Paystack first,
          confirm the settlement bank/account is correct, then paste only the
          resulting <strong>ACCT_…</strong> code here. Do not paste Paystack
          secret keys into this form.
        </p>
      </section>

      <div className="ui-enter mt-8 grid gap-3 sm:grid-cols-3 [animation-delay:120ms]">
        {[
          {
            label: "Payout-ready",
            value: activeCount,
            detail: "Active subaccounts",
            color: "text-emerald-800",
          },
          {
            label: "Awaiting activation",
            value: pendingCount,
            detail: "Pending setup",
            color: "text-amber-900",
          },
          {
            label: "Setup needed",
            value: setupNeededCount,
            detail: "No subaccount yet",
            color: "text-[var(--forest)]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold tabular-nums ${stat.color}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{stat.detail}</p>
          </div>
        ))}
      </div>

      <AdminPaymentsList providers={providers} />
    </div>
  );
}
