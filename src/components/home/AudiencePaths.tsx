import Link from "next/link";

export default function AudiencePaths() {
  return (
    <section className="bg-[var(--paper)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
            Start here
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
            What are you here to do?
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Students can browse without an account. Sign in only when you need
            personal features. Property providers get a separate workspace for
            listings and review status.
          </p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--emerald)]">
              Students
            </p>
            <h3 className="mt-3 text-2xl font-bold text-[var(--forest)]">
              I&apos;m looking for accommodation
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Search homes, compare rent, required fees, amenities and
              location. You do not need an account just to browse.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white"
              >
                Find accommodation
              </Link>
              <Link
                href="/login#signup"
                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)]"
              >
                Create student account
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[var(--cream)] p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--emerald)]">
              Property providers
            </p>
            <h3 className="mt-3 text-2xl font-bold text-[var(--forest)]">
              I&apos;m providing accommodation
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Landlords, agents and property managers use one provider account
              to create listings, manage availability and submit properties for
              platform review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/list-property"
                className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-bold text-[var(--ink)]"
              >
                List a property
              </Link>
              <Link
                href="/login#signup"
                className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)]"
              >
                Create provider account
              </Link>
            </div>
          </article>
        </div>

        <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
          Platform administration is an internal role and is not offered as a
          public account type.
        </p>
      </div>
    </section>
  );
}
