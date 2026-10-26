import Link from "next/link";

import type { StudentProperty } from "@/types/property";

interface PropertyCardProps {
  property: StudentProperty;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function PropertyCard({ property }: PropertyCardProps) {
  const availabilityLabel =
    property.availability === "occupied"
      ? "Fully occupied"
      : property.availability === "limited"
        ? `${property.availableRooms} rooms left`
        : `${property.availableRooms} rooms available`;

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm shadow-black/5">
      <div className="relative flex min-h-48 items-end bg-[var(--forest)] p-5">
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--forest)]">
          {property.verified ? "Verified listing" : "Listing"}
        </span>

        <div>
          <p className="text-sm font-medium text-white/75">
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

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
            {availabilityLabel}
          </span>
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

        <div className="mt-6 border-t border-[var(--border)] pt-4">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex rounded-xl bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            View details
          </Link>
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Approved through the platform review workflow.
        </p>
      </div>
    </article>
  );
}
