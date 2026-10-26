import Image from "next/image";
import Link from "next/link";

import SavePropertyButton from "@/components/property/SavePropertyButton";
import { getAvailabilityFreshness } from "@/lib/availability";
import type { StudentProperty } from "@/types/property";

interface PropertyCardProps {
  property: StudentProperty;
  showSaveButton?: boolean;
  initiallySaved?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function PropertyCard({
  property,
  showSaveButton = false,
  initiallySaved = false,
}: PropertyCardProps) {
  const coverImage = property.images[0] ?? null;
  const freshness = getAvailabilityFreshness(property.availabilityUpdatedAt);
  const availabilityLabel =
    property.availability === "occupied"
      ? "Fully occupied"
      : property.availability === "limited"
        ? `${property.availableRooms} rooms left`
        : `${property.availableRooms} rooms available`;

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm shadow-black/5">
      <div className="relative flex min-h-52 items-end overflow-hidden bg-[var(--forest)] p-5">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.altText || `${property.name} accommodation`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

        <span className="absolute left-5 top-5 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[var(--forest)]">
          {property.verified ? "Verified listing" : "Listing"}
        </span>

        <div className="relative z-10">
          <p className="text-sm font-medium text-white/80">
            {property.area} · {property.university}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">
            {property.name}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Annual rent
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--forest)]">
              {currencyFormatter.format(property.annualRent)}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
              {availabilityLabel}
            </span>
            <p
              className={[
                "mt-1.5 text-[11px] font-medium",
                freshness.isStale ? "text-amber-700" : "text-[var(--muted)]",
              ].join(" ")}
            >
              {freshness.label}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[var(--cream)] p-3 text-center">
          <div>
            <p className="text-lg font-bold text-[var(--forest)]">{property.totalRooms}</p>
            <p className="text-[11px] font-medium text-[var(--muted)]">Total</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--forest)]">{property.availableRooms}</p>
            <p className="text-[11px] font-medium text-[var(--muted)]">Available</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--forest)]">{property.occupiedRooms}</p>
            <p className="text-[11px] font-medium text-[var(--muted)]">Occupied</p>
          </div>
        </div>

        {property.distanceFromCampus !== "Distance not provided" ? (
          <p className="mt-3 text-xs font-medium text-[var(--muted)]">
            {property.distanceFromCampus}
          </p>
        ) : null}

        <p className="mt-4 text-sm font-semibold capitalize text-[var(--ink)]">
          {property.roomType}
        </p>

        {property.facilities.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Property facilities">
            {property.facilities.map((facility) => (
              <li
                key={facility}
                className="rounded-full bg-[var(--cream)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
              >
                {facility}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-xs text-[var(--muted)]">
            Facilities have not been added yet.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex rounded-xl bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            View details
          </Link>

          {showSaveButton ? (
            <SavePropertyButton
              propertyId={property.id}
              propertySlug={property.slug}
              propertyName={property.name}
              initiallySaved={initiallySaved}
              variant="light"
            />
          ) : null}
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Approved through the platform review workflow.
        </p>
      </div>
    </article>
  );
}
