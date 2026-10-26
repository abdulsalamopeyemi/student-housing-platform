import Image from "next/image";
import Link from "next/link";

import {
  approveProperty,
  rejectProperty,
  updatePropertyReportStatus,
  verifyProvider,
} from "@/app/admin/reviews/actions";
import {
  getAdminPropertyReports,
  getPendingPropertyReviews,
  getPendingProviderVerifications,
} from "@/lib/data/admin";
import { propertyImagePublicUrl } from "@/lib/property-images";

interface AdminReviewContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

function providerTypeLabel(value: string) {
  return value.replaceAll("_", " ");
}

function reportReasonLabel(value: string) {
  const labels: Record<string, string> = {
    wrong_price: "Incorrect price or fees",
    unavailable: "Property or rooms unavailable",
    misleading_photos: "Misleading property photos",
    suspicious_payment: "Suspicious payment request",
    wrong_location: "Incorrect location information",
    other: "Other issue",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}

export default async function AdminReviewContent({
  searchParams,
}: AdminReviewContentProps) {
  const [properties, providersToVerify, reports, params] = await Promise.all([
    getPendingPropertyReviews(),
    getPendingProviderVerifications(),
    getAdminPropertyReports(),
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

        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
            <span className="font-bold text-[var(--forest)]">
              {providersToVerify.length}
            </span>{" "}
            {providersToVerify.length === 1 ? "provider" : "providers"} awaiting verification
          </div>
          <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
            <span className="font-bold text-[var(--forest)]">
              {properties.length}
            </span>{" "}
            {properties.length === 1 ? "property" : "properties"} awaiting review
          </div>
          <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
            <span className="font-bold text-[var(--forest)]">
              {reports.length}
            </span>{" "}
            active {reports.length === 1 ? "report" : "reports"}
          </div>
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

      <section className="mt-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-red-700">
            Listing reports
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
            Student trust and moderation
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Reports are private. Review concerns about prices, availability,
            photos, locations or suspicious payment requests before deciding
            whether a listing needs further action.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              There are no active property reports.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-3xl border border-[var(--border)] bg-white p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                        {reportReasonLabel(report.reason)}
                      </span>
                      <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
                        {report.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[var(--forest)]">
                      {report.properties?.name ?? "Reported property"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {report.properties?.area ?? "Area unavailable"} · Reported{" "}
                      {new Date(report.created_at).toLocaleDateString("en-NG")}
                    </p>

                    {report.details ? (
                      <p className="mt-4 max-w-3xl rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                        {report.details}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm text-[var(--muted)]">
                        No additional details were provided.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {report.properties ? (
                      <Link
                        href={`/properties/${report.properties.slug}`}
                        className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)]"
                      >
                        Inspect listing
                      </Link>
                    ) : null}

                    {report.status === "open" ? (
                      <form action={updatePropertyReportStatus}>
                        <input type="hidden" name="reportId" value={report.id} />
                        <input type="hidden" name="status" value="reviewing" />
                        <button className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white">
                          Start review
                        </button>
                      </form>
                    ) : null}

                    <form action={updatePropertyReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="resolved" />
                      <button className="rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800">
                        Resolve
                      </button>
                    </form>

                    <form action={updatePropertyReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)]">
                        Dismiss
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Provider verification
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
            Registered landlords, agents and managers
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Agents must be verified here before a property owner can assign them
            to manage student enquiries or room availability.
          </p>
        </div>

        {providersToVerify.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              No provider accounts are waiting for verification.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {providersToVerify.map((provider) => (
              <article
                key={provider.id}
                className="rounded-3xl border border-[var(--border)] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      {providerTypeLabel(provider.provider_type)}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-[var(--forest)]">
                      {provider.display_name ?? "Unnamed provider"}
                    </h3>
                    <p className="mt-2 text-xs capitalize text-[var(--muted)]">
                      Status: {provider.verification_status}
                    </p>
                  </div>
                </div>

                <form action={verifyProvider} className="mt-5 space-y-3">
                  <input type="hidden" name="providerId" value={provider.id} />
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Optional verification note"
                    className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[var(--forest)] px-4 py-3 text-sm font-bold text-white"
                  >
                    Verify {provider.provider_type === "agent" ? "agent" : "provider"}
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Property review
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
            Accommodation awaiting publication
          </h2>
        </div>

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

                  {property.property_images.length > 0 ? (
                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                        Submitted property photos
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {[...property.property_images]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((image, index) => (
                            <div
                              key={image.id}
                              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)]"
                            >
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={propertyImagePublicUrl(image.storage_path)}
                                  alt={image.alt_text || `${property.name} photo ${index + 1}`}
                                  fill
                                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
                                  className="object-cover"
                                />
                              </div>
                              <p className="px-3 py-2 text-xs text-[var(--muted)]">
                                {index === 0 ? "Cover photo" : `Photo ${index + 1}`}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                      No property photos were submitted with this listing.
                    </div>
                  )}
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
      </section>
    </div>
  );
}
