"use client";

import { useMemo, useState } from "react";

import { configureProviderPaystackAccount } from "@/app/admin/payments/actions";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import type { PaymentProviderSetup } from "@/lib/data/admin-payments";

type PaymentStatus = "pending" | "active" | "disabled" | "not_configured";
type StatusFilter = "all" | PaymentStatus;

interface AdminPaymentsListProps {
  providers: PaymentProviderSetup[];
}

const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All providers" },
  { value: "not_configured", label: "Not configured" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

function providerStatus(provider: PaymentProviderSetup): PaymentStatus {
  return provider.paymentAccount?.status ?? "not_configured";
}

function statusStyle(status: PaymentStatus) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-800";
  }

  if (status === "pending") {
    return "bg-amber-50 text-amber-900";
  }

  if (status === "disabled") {
    return "bg-red-50 text-red-800";
  }

  return "bg-[var(--cream)] text-[var(--muted)]";
}

function providerTypeLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default function AdminPaymentsList({
  providers,
}: AdminPaymentsListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const visibleProviders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesStatus =
        statusFilter === "all" || providerStatus(provider) === statusFilter;
      const searchableText = [
        provider.display_name ?? "",
        provider.provider_type,
        provider.paymentAccount?.subaccount_code ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [providers, query, statusFilter]);

  if (providers.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--cream)] text-xl text-[var(--forest)]"
        >
          —
        </span>
        <h2 className="mt-4 text-xl font-bold text-[var(--forest)]">
          No verified payout providers yet.
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Verify a landlord or property manager first.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8" aria-labelledby="provider-accounts-title">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="provider-accounts-title"
            className="text-2xl font-bold text-[var(--forest)]"
          >
            Provider accounts
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
            Showing {visibleProviders.length} of {providers.length} verified
            {providers.length === 1 ? " provider" : " providers"}
          </p>
        </div>
        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">Search providers or subaccount codes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search providers or ACCT codes"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
          />
        </label>
      </div>

      <div
        className="mb-5 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Filter provider accounts"
      >
        {filters.map((filter) => {
          const count =
            filter.value === "all"
              ? providers.length
              : providers.filter(
                  (provider) => providerStatus(provider) === filter.value,
                ).length;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={[
                "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)]",
                statusFilter === filter.value
                  ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                  : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--emerald)] hover:text-[var(--forest)]",
              ].join(" ")}
            >
              {filter.label} <span className="ml-1 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>

      {visibleProviders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
          <h3 className="font-bold text-[var(--forest)]">
            No providers match those filters.
          </h3>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            className="mt-3 text-sm font-semibold text-[var(--emerald)] underline underline-offset-4"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleProviders.map((provider, index) => {
            const status = providerStatus(provider);

            return (
              <article
                key={provider.id}
                className="ui-enter rounded-3xl border border-[var(--border)] bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-[var(--forest)]/5 sm:p-6"
                style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--cream)] font-bold uppercase text-[var(--forest)]"
                    >
                      {(provider.display_name ?? "P").slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                        {providerTypeLabel(provider.provider_type)}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[var(--forest)]">
                        {provider.display_name ?? "Unnamed provider"}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {provider.paymentAccount?.updated_at
                          ? `Last updated ${new Date(provider.paymentAccount.updated_at).toLocaleDateString("en-NG")}`
                          : "No payout account configured"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(status)}`}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "size-1.5 rounded-full",
                        status === "active"
                          ? "bg-emerald-600"
                          : status === "pending"
                            ? "bg-amber-600"
                            : status === "disabled"
                              ? "bg-red-600"
                              : "bg-slate-400",
                      ].join(" ")}
                    />
                    {status.replaceAll("_", " ")}
                  </span>
                </div>

                <form
                  action={configureProviderPaystackAccount}
                  className="mt-5 grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-[1.3fr_0.7fr_auto]"
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
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 font-mono text-sm outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      Account status
                    </span>
                    <select
                      name="status"
                      defaultValue={provider.paymentAccount?.status ?? "pending"}
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </label>
                  <ActionSubmitButton
                    pendingText="Saving account…"
                    className="self-end rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--emerald)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)]"
                  >
                    Save payout setup
                  </ActionSubmitButton>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
