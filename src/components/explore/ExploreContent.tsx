import Link from "next/link";

import ExploreFilters from "@/components/explore/ExploreFilters";
import PropertyCard from "@/components/property/PropertyCard";
import { getPublishedProperties } from "@/lib/data/public-properties";

interface ExploreContentProps {
  searchParams: Promise<{
    location?: string;
    budget?: string;
    roomType?: string;
  }>;
}

export default async function ExploreContent({
  searchParams,
}: ExploreContentProps) {
  const [params, properties] = await Promise.all([
    searchParams,
    getPublishedProperties(),
  ]);

  const location = params.location?.trim() ?? "";
  const budget = params.budget ?? "";
  const roomType = params.roomType ?? "";

  const normalizedLocation = location.toLowerCase();
  const hasLocation = normalizedLocation.length > 0;
  const maximumBudget = Number(budget) || Number.POSITIVE_INFINITY;

  const filteredProperties = hasLocation
    ? properties.filter((property) => {
        const matchesLocation =
          property.area.toLowerCase().includes(normalizedLocation) ||
          property.university.toLowerCase().includes(normalizedLocation) ||
          property.name.toLowerCase().includes(normalizedLocation);

        const matchesBudget = property.annualRent <= maximumBudget;

        const matchesRoomType =
          roomType.length === 0 ||
          property.roomType.toLowerCase().includes(roomType.toLowerCase());

        return matchesLocation && matchesBudget && matchesRoomType;
      })
    : properties;

  return (
    <>
      <section className="bg-[var(--cream)] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
            Explore student homes
          </p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
                Compare the details that matter.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Browse approved student accommodation with clearer pricing,
                availability, room information, and location context.
              </p>
            </div>

            <p className="text-sm font-semibold text-[var(--muted)]">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"} shown
            </p>
          </div>

          <div className="mt-8">
            <ExploreFilters
              location={location}
              budget={budget}
              roomType={roomType}
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {filteredProperties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-bold text-[var(--forest)]">
                No approved homes match those filters yet.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Try widening your budget, changing the room type, or searching
                a broader location.
              </p>

              <Link
                href="/explore"
                className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
