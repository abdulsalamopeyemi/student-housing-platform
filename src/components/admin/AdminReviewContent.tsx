import Link from "next/link";

import {
  approveProperty,
  rejectProperty,
  verifyProvider,
} from "@/app/admin/reviews/actions";
import { getPendingPropertyReviews } from "@/lib/data/admin";

interface AdminReviewContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

function providerTypeLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function AdminReviewContent({
  searchParams,
}: AdminReviewContentProps) {
  const [properties, params] = await Promise.all([
    getPendingPropertyReviews(),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Admin review
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--forest)]">
            Property review queue
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Verify providers and review submitted accommodation before it
            becomes visible in the public marketplace.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--cream)] px-5 py-4 text-sm">
          <span className="font-bold text-[var(--forest)]">
            {properties.length}
          </span>{" "}
          {properties.length === 1 ? "property" : "properties"} awaiting review
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

      {properties.length === 0 ? (
        <section className="mt-10 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-[var(--forest)]">
            Review queue is clear.
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            New provider submissions will appear here automatically.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
          >
            View marketplace
          </Link>
        </section>
      ) : (
        <div className="mt-10 space-y-8">
          {properties.map((property) => {
            const provider = property.providers;
            const providerVerified =
              provider?.verification_status === "verified";

            return (
              <article
                key={property.id}
                className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white"
              >
                <div className="border-b border-[var(--border)] p-6 sm:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                          Pending review
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                          {property.universities?.name ?? "University unavailable"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-bold text-[var(--forest)]">
                        {property.name}
                      </h2>
                      <p className="mt-2 text-sm font-medium capitalize text-[var(--muted)]">
                        {property.area}
                        {property.distance_label
                          ? ` · ${property.distance_label}`
                          : ""}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                        Provider
                      </p>
                      <p className="mt-1 font-bold text-[var(--forest)]">
                        {provider?.display_name ?? "Unnamed provider"}
                      </p>
                      <p className="mt-1 text-xs capitalize text-[var(--muted)]">
                        {provider
                          ? providerTypeLabel(provider.provider_type)
                          : "Unknown type"}
                        {" · "}
                        {provider?.verification_status ?? "unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[var(--paper)] p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      Property description
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--forest)]">
                      {property.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
                  <section>
                    <h3 className="text-lg font-bold text-[var(--forest)]">
                      1. Verify provider
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Property publication is blocked until the provider is
                      verified.
                    </p>

                    {providerVerified ? (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                        Provider verified ✓
                      </div>
                    ) : provider ? (
                      <form action={verifyProvider} className="mt-4 space-y-3">
                        <input
                          type="hidden"
                          name="providerId"
                          value={provider.id}
                        />
                        <textarea
                          name="notes"
                          rows={3}
                          placeholder="Optional verification note"
                          className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[var(--forest)] px-4 py-3 text-sm font-bold text-white"
                        >
                          Verify provider
                        </button>
                      </form>
                    ) : (
                      <p className="mt-4 text-sm font-semibold text-red-700">
                        Provider information could not be loaded.
                      </p>
                    )}
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[var(--forest)]">
                      2. Review property
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Approving makes the property public. Rejecting returns it
                      to the provider for correction.
                    </p>

                    <form action={approveProperty} className="mt-4 space-y-3">
                      <input
                        type="hidden"
                        name="propertyId"
                        value={property.id}
                      />
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Optional approval note"
                        className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
                      />
                      <button
                        type="submit"
                        disabled={!providerVerified}
                        className="w-full rounded-xl bg-[var(--gold)] px-4 py-3 text-sm font-bold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Approve and publish
                      </button>
                    </form>

                    <form action={rejectProperty} className="mt-5 space-y-3 border-t border-[var(--border)] pt-5">
                      <input
                        type="hidden"
                        name="propertyId"
                        value={property.id}
                      />
                      <textarea
                        required
                        minLength={5}
                        name="notes"
                        rows={3}
                        placeholder="Reason for rejection (required)"
                        className="w-full resize-y rounded-xl border border-red-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700"
                      >
                        Reject property
                      </button>
                    </form>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
