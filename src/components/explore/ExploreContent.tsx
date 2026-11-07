import Link from "next/link";

import ExploreFilters from "@/components/explore/ExploreFilters";
import PropertyCard from "@/components/property/PropertyCard";
import { getCurrentAccount } from "@/lib/data/account";
import { getPublishedProperties } from "@/lib/data/public-properties";
import { getStudentSavedPropertyIds } from "@/lib/data/student-saved-properties";
import { getUniversities } from "@/lib/data/universities";

interface ExploreContentProps {
  searchParams: Promise<{
    university?: string;
    area?: string;
    location?: string;
    budget?: string;
    roomType?: string;
    sort?: string;
  }>;
}

export default async function ExploreContent({
  searchParams,
}: ExploreContentProps) {
  const [params, properties, universities, account] = await Promise.all([
    searchParams,
    getPublishedProperties(),
    getUniversities(),
    getCurrentAccount(),
  ]);

  const canSaveProperties =
    !account.user || account.profile?.role === "student";
  let savedPropertyIds = new Set<string>();

  if (account.profile?.role === "student") {
    try {
      savedPropertyIds = await getStudentSavedPropertyIds();
    } catch {
      // Keep public browsing available if saved-home data is temporarily unavailable.
    }
  }

  const legacyLocation = params.location?.trim() ?? "";
  const university = params.university?.trim() ?? "";
  const area = params.area?.trim() ?? "";
  const budget = params.budget ?? "";
  const roomType = params.roomType ?? "";
  const sort = ["rent-low", "rent-high", "availability"].includes(
    params.sort ?? "",
  )
    ? params.sort!
    : "recent";

  const normalizedUniversity = university.toLowerCase();
  const normalizedArea = area.toLowerCase();
  const normalizedLegacyLocation = legacyLocation.toLowerCase();
  const hasStructuredUniversity = normalizedUniversity.length > 0;
  const maximumBudget = Number(budget) || Number.POSITIVE_INFINITY;

  const filteredProperties =
    hasStructuredUniversity || normalizedLegacyLocation.length > 0
      ? properties.filter((property) => {
          const matchesUniversity = hasStructuredUniversity
            ? property.university.toLowerCase() === normalizedUniversity
            : property.university.toLowerCase().includes(normalizedLegacyLocation) ||
              property.area.toLowerCase().includes(normalizedLegacyLocation) ||
              property.name.toLowerCase().includes(normalizedLegacyLocation);

          const matchesArea =
            normalizedArea.length === 0 ||
            property.area.toLowerCase().includes(normalizedArea);

          const matchesBudget = property.annualRent <= maximumBudget;

          const matchesRoomType =
            roomType.length === 0 ||
            property.roomType.toLowerCase().includes(roomType.toLowerCase());

          return matchesUniversity && matchesArea && matchesBudget && matchesRoomType;
        })
      : properties;

  const sortedProperties = [...filteredProperties];

  if (sort === "rent-low") {
    sortedProperties.sort((a, b) => a.annualRent - b.annualRent);
  } else if (sort === "rent-high") {
    sortedProperties.sort((a, b) => b.annualRent - a.annualRent);
  } else if (sort === "availability") {
    sortedProperties.sort(
      (a, b) =>
        b.availableRooms - a.availableRooms ||
        a.annualRent - b.annualRent,
    );
  }

  const roomTypes = Array.from(
    new Set(properties.map((property) => property.roomType.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

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
              {sortedProperties.length}{" "}
              {sortedProperties.length === 1 ? "property" : "properties"} shown
            </p>
          </div>

          <div className="mt-8">
            <ExploreFilters
              universities={universities}
              roomTypes={roomTypes}
              university={university}
              area={area}
              budget={budget}
              roomType={roomType}
              sort={sort}
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {sortedProperties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showSaveButton={canSaveProperties}
                  initiallySaved={savedPropertyIds.has(property.id)}
                />
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
