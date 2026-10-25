import Link from "next/link";

import SavePropertyButton from "@/components/property/SavePropertyButton";
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
    property.availability === "limited"
      ? `${property.availableRooms} rooms left`
      : `${property.availableRooms} rooms available`;

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm shadow-black/5">
      <div className="relative flex min-h-48 items-end bg-[var(--forest)] p-5">
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--forest)]">
          Sample listing
        </span>

        <div>
          <p className="text-sm font-medium text-white/70">
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

        <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
          {property.roomType}
        </p>

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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <Link
            href={`/properties/${property.slug}`}
            className="rounded-xl bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            View details
          </Link>

          <SavePropertyButton propertyName={property.name} />
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Demo data for interface development
        </p>
      </div>
    </article>
  );
}
