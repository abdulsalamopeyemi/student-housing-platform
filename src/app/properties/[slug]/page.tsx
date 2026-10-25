import Link from "next/link";
import { notFound } from "next/navigation";

import InspectionRequestForm from "@/components/property/InspectionRequestForm";
import SavePropertyButton from "@/components/property/SavePropertyButton";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { featuredProperties, getPropertyBySlug } from "@/data/featured-properties";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return featuredProperties.map((property) => ({
    slug: property.slug,
  }));
}

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const totalRequiredFees = property.fees
    .filter((fee) => fee.required)
    .reduce((total, fee) => total + fee.amount, 0);

  const availabilityLabel =
    property.availability === "limited"
      ? `${property.availableRooms} rooms left`
      : `${property.availableRooms} rooms available`;

  return (
    <>
      <SiteHeader />

      <main>
        <section className="bg-[var(--cream)] py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              href="/explore"
              className="text-sm font-semibold text-[var(--emerald)]"
            >
              ← Back to explore
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--forest)]">
                    Sample listing
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
                    {availabilityLabel}
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
                  {property.name}
                </h1>

                <p className="mt-3 text-base text-[var(--muted)]">
                  {property.area} · {property.university} ·{" "}
                  {property.distanceFromCampus}
                </p>

                <p className="mt-6 max-w-3xl text-base leading-7 text-[var(--muted)]">
                  {property.description}
                </p>
              </div>

              <div className="rounded-3xl bg-[var(--forest)] p-6 text-white">
                <p className="text-sm font-semibold text-white/70">
                  Annual rent
                </p>
                <p className="mt-2 text-4xl font-bold">
                  {currencyFormatter.format(property.annualRent)}
                </p>
                <p className="mt-3 text-sm text-white/65">
                  See the full required-fee breakdown below before making any
                  payment decision.
                </p>

                <div className="mt-6">
                  <SavePropertyButton propertyName={property.name} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--paper)] py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div className="space-y-8">
              <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
                  Property overview
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      Room type
                    </p>
                    <p className="mt-2 font-semibold text-[var(--forest)]">
                      {property.roomType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                      Availability last updated
                    </p>
                    <p className="mt-2 font-semibold text-[var(--forest)]">
                      {property.availabilityUpdatedAt}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
                  Facilities and utilities
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[...property.facilities, ...property.utilities].map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm font-semibold text-[var(--forest)]"
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
                  Required cost breakdown
                </p>

                <div className="mt-6 divide-y divide-[var(--border)]">
                  {property.fees.map((fee) => (
                    <div
                      key={fee.label}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0"
                    >
                      <div>
                        <p className="font-semibold text-[var(--forest)]">
                          {fee.label}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {fee.required ? "Required" : "Optional"}
                        </p>
                      </div>

                      <p className="font-bold text-[var(--forest)]">
                        {currencyFormatter.format(fee.amount)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--cream)] p-4">
                  <p className="font-bold text-[var(--forest)]">
                    Total required amount
                  </p>
                  <p className="text-xl font-bold text-[var(--forest)]">
                    {currencyFormatter.format(totalRequiredFees)}
                  </p>
                </div>

                <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                  Demo figures only. A production listing must show every
                  mandatory fee clearly and keep the breakdown current.
                </p>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
                  Trust status
                </p>

                <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
                  This demo listing is not verified.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  In production, verification will be a defined workflow that
                  can include provider identity, authority to list the property,
                  property evidence, and moderation history. We will not display
                  a verified badge until that process exists.
                </p>
              </section>
            </div>

            <aside>
              <div className="lg:sticky lg:top-6">
                <InspectionRequestForm propertyName={property.name} />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
