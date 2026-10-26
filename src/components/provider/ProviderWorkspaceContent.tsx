import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { updateInspectionStatus } from "@/app/provider/inspections/actions";
import { submitPropertyForReview } from "@/app/provider/properties/actions";
import { getProviderInspectionRequests } from "@/lib/data/provider-inspections";
import { getProviderProperties } from "@/lib/data/provider-properties";
import { getCurrentProvider } from "@/lib/data/providers";

interface ProviderWorkspaceContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

function statusMessage(value: string) {
  if (value === "pending_review") {
    return "Awaiting admin review";
  }

  if (value === "published") {
    return "Published — visible in the marketplace";
  }

  if (value === "rejected") {
    return "Changes required before resubmission";
  }

  if (value === "draft") {
    return "Draft — not submitted yet";
  }

  return statusLabel(value);
}

export default async function ProviderWorkspaceContent({
  searchParams,
}: ProviderWorkspaceContentProps) {
  const [{ user, provider }, params] = await Promise.all([
    getCurrentProvider(),
    searchParams,
  ]);

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  const [properties, inspectionRequests] = await Promise.all([
    getProviderProperties(provider.id),
    getProviderInspectionRequests(),
  ]);

  const activeInspectionCount = inspectionRequests.filter(
    (request) =>
      request.status === "requested" || request.status === "confirmed",
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      {params.message ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {params.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Provider workspace
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)]">
            {provider.display_name ?? "Your property workspace"}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Create property drafts, keep their pricing and availability clear,
            and submit complete listings for review before they become public.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Provider verification
            </p>
            <p className="mt-1 font-bold capitalize text-[var(--forest)]">
              {provider.verification_status}
            </p>
          </div>

          <Link
            href="/provider/properties/new"
            className="rounded-xl bg-[var(--forest)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            + Add property
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            1. Provider profile
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Complete</p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            2. Property details
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {properties.length > 0
              ? `${properties.length} saved ${properties.length === 1 ? "property" : "properties"}`
              : "Create your first property draft"}
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            3. Inspection requests
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {activeInspectionCount > 0
              ? `${activeInspectionCount} active ${activeInspectionCount === 1 ? "request" : "requests"}`
              : "No active inspection requests"}
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            4. Review and publish
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Submit a complete draft for platform review
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Student enquiries
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
            Inspection requests
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Students who request an inspection for one of your published
            properties appear here. Confirm or decline new requests, then mark
            confirmed inspections complete after they happen.
          </p>
        </div>

        {inspectionRequests.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
            <h3 className="text-xl font-bold text-[var(--forest)]">
              No inspection requests yet.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              When a student requests an inspection from a published listing,
              the request will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {inspectionRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-[var(--border)] bg-white p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
                        {statusLabel(request.status)}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        Requested {new Date(request.created_at).toLocaleDateString("en-NG")}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[var(--forest)]">
                      {request.properties?.name ?? "Property inspection"}
                    </h3>

                    <div className="mt-3 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-[var(--forest)]">
                          Preferred date:
                        </span>{" "}
                        {new Date(request.preferred_date).toLocaleDateString("en-NG")}
                      </p>
                      <p>
                        <span className="font-semibold text-[var(--forest)]">
                          Student phone:
                        </span>{" "}
                        <a
                          href={`tel:${request.contact_phone}`}
                          className="underline underline-offset-4"
                        >
                          {request.contact_phone}
                        </a>
                      </p>
                    </div>

                    {request.note ? (
                      <p className="mt-3 max-w-2xl rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                        {request.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {request.properties ? (
                      <Link
                        href={`/properties/${request.properties.slug}`}
                        className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)]"
                      >
                        View property
                      </Link>
                    ) : null}

                    {request.status === "requested" ? (
                      <>
                        <form action={updateInspectionStatus}>
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="confirmed" />
                          <button className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white">
                            Confirm
                          </button>
                        </form>
                        <form action={updateInspectionStatus}>
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="declined" />
                          <button className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700">
                            Decline
                          </button>
                        </form>
                      </>
                    ) : request.status === "confirmed" ? (
                      <>
                        <form action={updateInspectionStatus}>
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="completed" />
                          <button className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white">
                            Mark completed
                          </button>
                        </form>
                        <form action={updateInspectionStatus}>
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="declined" />
                          <button className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700">
                            Decline
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
              Your properties
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
              Drafts and review status
            </h2>
          </div>

          <Link
            href="/provider/properties/new"
            className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--gold)] decoration-2 underline-offset-4"
          >
            Add another property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-[var(--forest)]">
              No property drafts yet.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Create your first listing with room information, rent, mandatory
              fees, availability, and amenities.
            </p>
            <Link
              href="/provider/properties/new"
              className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
            >
              Create first property
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {properties.map((property) => {
              const canSubmit =
                property.publication_status === "draft" ||
                property.publication_status === "rejected";

              return (
                <article
                  key={property.id}
                  className="rounded-3xl border border-[var(--border)] bg-white p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
                          {statusLabel(property.publication_status)}
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-[var(--muted)]">
                          {statusLabel(property.verification_status)}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-bold text-[var(--forest)]">
                        {property.name}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-[var(--muted)]">
                          {property.area}
                          {property.universities?.name
                            ? ` · ${property.universities.name}`
                            : ""}
                        </p>
                        {property.distance_label ? (
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {property.distance_label}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {property.publication_status === "published" ? (
                        <Link
                          href={`/properties/${property.slug}`}
                          className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-bold text-white"
                        >
                          View public listing
                        </Link>
                      ) : canSubmit ? (
                        <form action={submitPropertyForReview}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <button className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-bold text-[var(--ink)]">
                            {property.publication_status === "rejected"
                              ? "Resubmit for review"
                              : "Submit for review"}
                          </button>
                        </form>
                      ) : (
                        <span className="text-sm font-semibold text-[var(--muted)]">
                          {statusMessage(property.publication_status)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
        <Link
          href="/explore"
          className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)]"
        >
          View marketplace
        </Link>

        <form action={signOut}>
          <button className="rounded-xl px-5 py-3 text-sm font-semibold text-[var(--muted)] underline underline-offset-4">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
