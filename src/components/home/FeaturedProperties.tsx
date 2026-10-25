import PropertyCard from "@/components/property/PropertyCard";
import { featuredProperties } from "@/data/featured-properties";

export default function FeaturedProperties() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
            Sample homes
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
            See how properties will be compared.
          </h2>

          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            These are demo listings while we design the marketplace. Real
            properties will only be presented as verified when a real
            verification process is in place.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
