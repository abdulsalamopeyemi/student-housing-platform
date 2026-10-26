import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getCurrentAccount } from "@/lib/data/account";
import { getStudentDashboardData } from "@/lib/data/student-dashboard";
import { propertyImagePublicUrl } from "@/lib/property-images";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default async function CompareSavedHomesPage() {
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/account/compare");
  }

  if (profile?.role === "admin") {
    redirect("/admin/reviews");
  }

  if (profile?.role === "provider") {
    redirect("/list-property");
  }

  const { savedHomes } = await getStudentDashboardData();
  const homes = savedHomes
    .filter((item) => Boolean(item.properties))
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <Link
            href="/account"
            className="text-sm font-semibold text-[var(--emerald)]"
          >
            ← Back to My Account
          </Link>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
              Compare saved homes
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
              Compare the homes you are considering.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              See price, room type, location and current availability side by
              side before choosing where to inspect.
            </p>
          </div>

          {homes.length < 2 ? (
            <section className="mt-10 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-14 text-center">
              <h2 className="text-2xl font-bold text-[var(--forest)]">
                Save at least two homes to compare.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                Keep interesting accommodation in Saved Homes, then return here
                to compare the strongest options together.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white"
              >
                Explore accommodation
              </Link>
            </section>
          ) : (
            <div className="mt-10 overflow-x-auto pb-4">
              <div
                className="grid min-w-[760px] gap-4"
                style={{
                  gridTemplateColumns: `repeat(${homes.length}, minmax(220px, 1fr))`,
                }}
              >
                {homes.map((item) => {
                  const property = item.properties!;
                  const room = property.room_types[0];
                  const cover = property.property_images
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)[0];

                  return (
                    <article
                      key={item.property_id}
                      className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--forest)]">
                        {cover ? (
                          <Image
                            src={propertyImagePublicUrl(cover.storage_path)}
                            alt={cover.alt_text || `${property.name} accommodation`}
                            fill
                            sizes="320px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-white/70">
                            Photo not available
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-xl font-bold text-[var(--forest)]">
                              {property.name}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {property.area}
                            </p>
                          </div>
                          {property.verification_status === "verified" ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                              Verified
                            </span>
                          ) : null}
                        </div>

                        <dl className="mt-5 divide-y divide-[var(--border)] text-sm">
                          <div className="py-3 first:pt-0">
                            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                              University
                            </dt>
                            <dd className="mt-1 font-semibold text-[var(--forest)]">
                              {property.universities?.name ?? "Not specified"}
                            </dd>
                          </div>

                          <div className="py-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                              Annual rent
                            </dt>
                            <dd className="mt-1 text-lg font-bold text-[var(--forest)]">
                              {room
                                ? currencyFormatter.format(Number(room.annual_rent))
                                : "Not available"}
                            </dd>
                          </div>

                          <div className="py-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                              Room type
                            </dt>
                            <dd className="mt-1 font-semibold capitalize text-[var(--forest)]">
                              {room?.name ?? "Not specified"}
                            </dd>
                          </div>

                          <div className="py-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                              Availability
                            </dt>
                            <dd className="mt-1 font-semibold text-[var(--forest)]">
                              {room
                                ? room.available_count === 0
                                  ? "Fully occupied"
                                  : `${room.available_count} of ${room.total_count} rooms available`
                                : "Not available"}
                            </dd>
                          </div>
                        </dl>

                        <Link
                          href={`/properties/${property.slug}`}
                          className="mt-5 inline-flex w-full justify-center rounded-xl bg-[var(--forest)] px-4 py-3 text-sm font-bold text-white"
                        >
                          View property
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {savedHomes.length > 4 ? (
                <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                  Showing your four most recently saved homes. You currently
                  have {savedHomes.length} saved homes.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
