import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  cancelStudentInspection,
  rescheduleStudentInspection,
} from "@/app/account/inspection-actions";
import { updateStudentProfile } from "@/app/account/profile-actions";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import SavePropertyButton from "@/components/property/SavePropertyButton";
import { getCurrentAccount } from "@/lib/data/account";
import { getStudentDashboardData } from "@/lib/data/student-dashboard";
import { getUniversities } from "@/lib/data/universities";
import { propertyImagePublicUrl } from "@/lib/property-images";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

interface StudentAccountContentProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

function lagosToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function StudentAccountContent({
  searchParams,
}: StudentAccountContentProps) {
  const [{ user, profile }, query] = await Promise.all([
    getCurrentAccount(),
    searchParams,
  ]);

  if (!user) {
    redirect("/login?next=/account");
  }

  if (profile?.role === "admin") {
    redirect("/admin/reviews");
  }

  if (profile?.role === "provider") {
    redirect("/list-property");
  }

  const [{ savedHomes, inspections }, universities] = await Promise.all([
    getStudentDashboardData(),
    getUniversities(),
  ]);
  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? "Student";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="rounded-3xl bg-[var(--forest)] p-7 text-white sm:p-9">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--gold)]">
          Student portal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Welcome, {displayName}.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/70">
          Keep the homes you are considering and your inspection activity in
          one place. This portal tracks your housing search and inspection
          activity; it does not yet represent a confirmed tenancy or room
          reservation.
        </p>
        <Link
          href="/explore"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--forest)]"
        >
          Explore accommodation
        </Link>
      </div>

      {query.message ? (
        <div
          role="status"
          className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {query.message}
        </div>
      ) : null}
      {query.error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
        >
          {query.error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">Saved homes</p>
          <p className="mt-2 text-3xl font-bold text-[var(--forest)]">
            {savedHomes.length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Properties you want to compare or revisit.
          </p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            Inspection requests
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--forest)]">
            {inspections.length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Requests and their latest status.
          </p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            Active inspections
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--forest)]">
            {
              inspections.filter(
                (inspection) =>
                  inspection.status === "requested" ||
                  inspection.status === "confirmed",
              ).length
            }
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Visits awaiting a response or scheduled with a provider.
          </p>
        </section>
      </div>

      <section
        id="profile"
        className="mt-8 scroll-mt-24 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--emerald)]">
            Your details
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
            Student profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Keep your contact details and university up to date. Your email
            address is managed through your sign-in account.
          </p>
        </div>

        <form
          action={updateStudentProfile}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--forest)]">
              Full name
            </span>
            <input
              required
              minLength={2}
              maxLength={100}
              name="fullName"
              autoComplete="name"
              defaultValue={profile?.full_name ?? displayName}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--forest)]">
              Email address
            </span>
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--cream)] px-4 py-3 text-[var(--muted)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--forest)]">
              Phone number
            </span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              maxLength={24}
              defaultValue={profile?.phone ?? ""}
              placeholder="+234 800 000 0000"
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--forest)]">
              University
            </span>
            <select
              name="universityId"
              defaultValue={profile?.university_id ?? ""}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)] focus:ring-2 focus:ring-[var(--emerald)]/15"
            >
              <option value="">Choose later</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <ActionSubmitButton
              pendingText="Saving profile…"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--emerald)]"
            >
              Save profile
            </ActionSubmitButton>
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[var(--forest)]">Saved homes</h2>
            <div className="flex flex-wrap gap-3">
              {savedHomes.length >= 2 ? (
                <Link
                  href="/account/compare"
                  className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--gold)] decoration-2 underline-offset-4"
                >
                  Compare saved
                </Link>
              ) : null}
              <Link href="/explore" className="text-sm font-bold text-[var(--emerald)]">
                Browse homes
              </Link>
            </div>
          </div>

          {savedHomes.length === 0 ? (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              You have not saved any properties yet. Browse the marketplace and
              save the homes you want to compare.
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              {savedHomes.map((item) => {
                const property = item.properties;
                const room = property?.room_types[0];
                const cover = property?.property_images
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)[0];

                if (!property) {
                  return (
                    <div
                      key={item.property_id}
                      className="rounded-2xl border border-[var(--border)] p-4"
                    >
                      <p className="font-bold text-[var(--forest)]">
                        Saved property
                      </p>
                    </div>
                  );
                }

                const availableRooms = room?.available_count ?? 0;
                const totalRooms = room?.total_count ?? 0;

                return (
                  <article
                    key={item.property_id}
                    className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--paper)]"
                  >
                    <div className="grid sm:grid-cols-[150px_1fr]">
                      <div className="relative min-h-36 bg-[var(--forest)]">
                        {cover ? (
                          <Image
                            src={propertyImagePublicUrl(cover.storage_path)}
                            alt={cover.alt_text || `${property.name} accommodation`}
                            fill
                            sizes="150px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-36 items-center justify-center px-4 text-center text-xs font-semibold text-white/70">
                            Photo not available
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="text-lg font-bold text-[var(--forest)]"
                            >
                              {property.name}
                            </Link>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {property.area}
                              {property.universities?.name
                                ? ` · ${property.universities.name}`
                                : ""}
                            </p>
                          </div>

                          {property.verification_status === "verified" ? (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
                              Verified
                            </span>
                          ) : null}
                        </div>

                        {room ? (
                          <>
                            <p className="mt-3 text-xl font-bold text-[var(--forest)]">
                              {currencyFormatter.format(Number(room.annual_rent))}
                              <span className="ml-1 text-xs font-medium text-[var(--muted)]">
                                / year
                              </span>
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-[var(--forest)]">
                                {room.name}
                              </span>
                              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-[var(--forest)]">
                                {availableRooms === 0
                                  ? "Fully occupied"
                                  : `${availableRooms} available`}
                              </span>
                              {totalRooms > 0 ? (
                                <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-[var(--muted)]">
                                  {totalRooms} total rooms
                                </span>
                              ) : null}
                            </div>
                          </>
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <Link
                            href={`/properties/${property.slug}`}
                            className="inline-flex text-sm font-bold text-[var(--emerald)] underline underline-offset-4"
                          >
                            Review this home
                          </Link>
                          <SavePropertyButton
                            propertyId={item.property_id}
                            propertySlug={property.slug}
                            propertyName={property.name}
                            initiallySaved
                            variant="light"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-bold text-[var(--forest)]">
            Inspection activity
          </h2>

          {inspections.length === 0 ? (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              You have no inspection requests yet. Open a published property
              and request an inspection when you are ready to visit it.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-[var(--border)]">
              {inspections.map((item) => {
                return (
                  <div key={item.id} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {item.properties ? (
                          <Link
                            href={`/properties/${item.properties.slug}`}
                            className="font-bold text-[var(--forest)]"
                          >
                            {item.properties.name}
                          </Link>
                        ) : (
                          <p className="font-bold text-[var(--forest)]">
                            Property inspection
                          </p>
                        )}
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Preferred date:{" "}
                          {new Date(item.preferred_date).toLocaleDateString(
                            "en-NG",
                          )}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Planning to stay:{" "}
                          {item.occupant_group_size === "4+"
                            ? "4+ people"
                            : `${item.occupant_group_size} ${item.occupant_group_size === "1" ? "person" : "people"}`}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {item.status === "requested"
                            ? "Waiting for the provider to respond."
                            : item.status === "confirmed"
                              ? "The provider confirmed this inspection."
                              : item.status === "completed"
                                ? "This inspection has been marked complete."
                                : item.status === "declined"
                                  ? "The provider declined this inspection request."
                                  : "This inspection request was cancelled."}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
                        {statusLabel(item.status)}
                      </span>
                    </div>

                    {item.status === "completed" ? (
                      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <p className="text-sm font-bold text-[var(--forest)]">
                          Inspection completed
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                          This visit is recorded as an inspection only; it does
                          not change your accommodation status.
                        </p>
                      </div>
                    ) : null}

                    {item.status === "requested" ||
                    item.status === "confirmed" ? (
                      <div className="mt-4 rounded-2xl bg-[var(--cream)] p-4">
                        <details>
                          <summary className="cursor-pointer text-sm font-bold text-[var(--forest)]">
                            Change inspection details
                          </summary>

                          <form
                            action={rescheduleStudentInspection}
                            className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.75fr_auto]"
                          >
                            <input
                              type="hidden"
                              name="requestId"
                              value={item.id}
                            />

                            <label>
                              <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                                New preferred date
                              </span>
                              <input
                                required
                                min={lagosToday()}
                                type="date"
                                name="preferredDate"
                                defaultValue={item.preferred_date}
                                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                              />
                            </label>

                            <label>
                              <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                                People staying
                              </span>
                              <select
                                required
                                name="occupantGroupSize"
                                defaultValue={item.occupant_group_size}
                                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                              >
                                <option value="1">1 person</option>
                                <option value="2">2 people</option>
                                <option value="3">3 people</option>
                                <option value="4+">4+ people</option>
                              </select>
                            </label>

                            <button className="self-end rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-bold text-white">
                              Reschedule
                            </button>
                          </form>

                          {item.status === "confirmed" ? (
                            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                              Changing a confirmed date sends the request back
                              to requested so the provider can confirm the new
                              date.
                            </p>
                          ) : null}
                        </details>

                        <form
                          action={cancelStudentInspection}
                          className="mt-4 border-t border-[var(--border)] pt-4"
                        >
                          <input
                            type="hidden"
                            name="requestId"
                            value={item.id}
                          />
                          <button className="text-sm font-semibold text-red-700 underline underline-offset-4">
                            Cancel inspection request
                          </button>
                        </form>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

    </div>
  );
}
