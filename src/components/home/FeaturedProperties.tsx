import Link from "next/link";

import PropertyCard from "@/components/property/PropertyCard";
import { getPublishedProperties } from "@/lib/data/public-properties";

export default async function FeaturedProperties() {
  const properties = (await getPublishedProperties()).slice(0, 3);

  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
              Featured verified homes
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
              Start with recently approved accommodation.
            </h2>

            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              These listings come from the live marketplace and only appear
              here after they pass the platform review workflow.
            </p>
          </div>

          <Link
            href="/explore"
            className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--gold)] decoration-2 underline-offset-4"
          >
            View all approved homes
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-[var(--forest)]">
              No verified properties have been published yet.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Approved properties will automatically appear here once the
              review process is complete.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
