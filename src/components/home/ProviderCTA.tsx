import Link from "next/link";

export default function ProviderCTA() {
  return (
    <section className="bg-[var(--paper)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
              For property providers
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
              Own or manage student accommodation?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Present your property with clearer pricing, room information,
              facilities, availability, and a professional enquiry flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/list-property"
                className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
              >
                List a property
              </Link>

              <Link
                href="/#how-it-works"
                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--forest)]"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="flex min-h-72 flex-col justify-between bg-[var(--cream)] p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold text-[var(--muted)]">
              Provider tools available now
            </p>

            <ul className="mt-6 space-y-4 text-sm font-semibold text-[var(--forest)]">
              <li>Create and manage property drafts</li>
              <li>Set room pricing and availability</li>
              <li>Submit listings for platform review</li>
              <li>Track verification and publication status</li>
            </ul>

            <p className="mt-8 text-xs leading-5 text-[var(--muted)]">
              Inspection-request management and richer provider analytics are
              still being developed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
