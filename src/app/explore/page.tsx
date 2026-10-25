import ExploreFilters from "@/components/explore/ExploreFilters";
import PropertyCard from "@/components/property/PropertyCard";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { featuredProperties } from "@/data/featured-properties";

interface ExplorePageProps {
  searchParams: Promise<{
    location?: string;
    budget?: string;
    roomType?: string;
  }>;
}

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const params = await searchParams;

  const location = params.location?.trim() ?? "";
  const budget = params.budget ?? "";
  const roomType = params.roomType ?? "";

  const normalizedLocation = location.toLowerCase();
  const maximumBudget = Number(budget) || Number.POSITIVE_INFINITY;

  const filteredProperties = featuredProperties.filter((property) => {
    const matchesLocation =
      normalizedLocation.length === 0 ||
      property.area.toLowerCase().includes(normalizedLocation) ||
      property.university.toLowerCase().includes(normalizedLocation) ||
      property.name.toLowerCase().includes(normalizedLocation);

    const matchesBudget = property.annualRent <= maximumBudget;

    const matchesRoomType =
      roomType.length === 0 ||
      property.roomType.toLowerCase().includes(roomType.toLowerCase());

    return matchesLocation && matchesBudget && matchesRoomType;
  });

  return (
    <>
      <SiteHeader />

      <main>
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
                  Filter by location, budget, and room type. These listings are
                  sample data while we build and validate the product.
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
                  No homes match those filters yet.
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  Try widening your budget, changing the room type, or searching
                  a broader location.
                </p>

                <a
                  href="/explore"
                  className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Clear filters
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
