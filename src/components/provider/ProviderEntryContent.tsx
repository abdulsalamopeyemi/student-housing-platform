import Link from "next/link";

interface ProviderEntryContentProps {
  variant: "guest" | "student" | "admin";
}

export default function ProviderEntryContent({
  variant,
}: ProviderEntryContentProps) {
  const isGuest = variant === "guest";
  const isAdmin = variant === "admin";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
            List student accommodation
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
            Put a property in front of students with clearer information.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Create one landlord login, finish its profile, and then add your
            property details, pricing, room availability and facilities.
            Listings stay private until approved through platform review.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                href="/admin/reviews"
                className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
              >
                Open admin review dashboard
              </Link>
            ) : isGuest ? (
              <Link
                href="/signup?accountType=provider&next=/list-property/start"
                className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
              >
                Create a landlord account
              </Link>
            ) : (
              <Link
                href="/provider/onboarding?next=/list-property/start"
                className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
              >
                Set up your landlord profile
              </Link>
            )}

            {isGuest ? (
              <Link
                href="/login?next=/list-property/start"
                className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)]"
              >
                Already have an account? Sign in
              </Link>
            ) : null}
          </div>
        </div>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            How listing works
          </p>

          <ol className="mt-6 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-sm font-bold text-[var(--forest)]">
                1
              </span>
              <div>
                <p className="font-bold text-[var(--forest)]">
                  Create a landlord account
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Choose Landlord and create your login. Add a name to that
                  same account—there is no separate provider account.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-sm font-bold text-[var(--forest)]">
                2
              </span>
              <div>
                <p className="font-bold text-[var(--forest)]">
                  Add property details
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Add location, rooms, pricing, availability and amenities in
                  your landlord workspace.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-sm font-bold text-[var(--forest)]">
                3
              </span>
              <div>
                <p className="font-bold text-[var(--forest)]">
                  Platform review
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Submitted listings remain private until an admin approves
                  and publishes them.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
