import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { submitPropertyForReview } from "@/app/provider/properties/actions";
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

  const properties = await getProviderProperties(provider.id);

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

      <div className="mt-8 grid gap-6 md:grid-cols-3">
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
            3. Review and publish
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Submit a complete draft for platform review
          </p>
        </div>
      </div>

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
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {property.area}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {canSubmit ? (
                        <form action={submitPropertyForReview}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <button className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-bold text-[var(--ink)]">
                            Submit for review
                          </button>
                        </form>
                      ) : (
                        <span className="text-sm font-semibold capitalize text-[var(--muted)]">
                          {property.publication_status === "pending_review"
                            ? "Awaiting review"
                            : statusLabel(property.publication_status)}
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
