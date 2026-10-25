import Link from "next/link";

const trustPoints = [
  "Clear required fees",
  "Availability updates",
  "Inspection requests",
];

export default function HeroV2() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div
        className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(214,164,72,0.18),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--emerald)] shadow-sm">
            <span
              className="h-2 w-2 rounded-full bg-[var(--gold)]"
              aria-hidden="true"
            />
            Starting with KWASU · Malete
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[var(--forest)] sm:text-6xl lg:text-7xl">
            Find student housing with fewer surprises.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Compare room types, required fees, facilities, distance, and
            availability before you spend money travelling around or paying for
            a place you do not fully understand.
          </p>

          <form
            action="/explore"
            method="get"
            className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-3 shadow-xl shadow-black/5"
            aria-label="Search student accommodation"
          >
            <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr_auto]">
              <label>
                <span className="mb-1.5 block px-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  University or area
                </span>
                <input
                  type="text"
                  name="location"
                  placeholder="KWASU, Malete"
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--paper)] px-4 py-3.5 outline-none transition focus:border-[var(--emerald)]"
                />
              </label>

              <label>
                <span className="mb-1.5 block px-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  Maximum budget
                </span>
                <select
                  name="budget"
                  defaultValue=""
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--paper)] px-4 py-3.5 outline-none transition focus:border-[var(--emerald)]"
                >
                  <option value="">Any budget</option>
                  <option value="150000">Up to ₦150,000</option>
                  <option value="250000">Up to ₦250,000</option>
                  <option value="350000">Up to ₦350,000</option>
                  <option value="500000">Up to ₦500,000</option>
                </select>
              </label>

              <button
                type="submit"
                className="self-end rounded-2xl bg-[var(--forest)] px-6 py-3.5 font-semibold text-white transition hover:bg-[var(--emerald)]"
              >
                Find a home
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[var(--emerald)] shadow-sm"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {point}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/explore"
              className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--gold)] decoration-2 underline-offset-4"
            >
              Browse sample homes
            </Link>
            <span className="text-[var(--border)]" aria-hidden="true">
              /
            </span>
            <Link
              href="/list-property"
              className="text-sm font-bold text-[var(--forest)] underline decoration-[var(--gold)] decoration-2 underline-offset-4"
            >
              I manage a property
            </Link>
          </div>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[600px]">
          <div
            className="absolute inset-0 rounded-[2rem] bg-[var(--forest)]"
            aria-hidden="true"
          />

          <div
            className="absolute inset-5 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))]"
            aria-hidden="true"
          />

          <div className="absolute left-8 right-8 top-8 rounded-3xl bg-white p-5 shadow-2xl shadow-black/20 sm:left-12 sm:right-12 sm:top-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--emerald)]">
                  Property snapshot
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
                  Compare before you inspect
                </h2>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[var(--emerald)]">
                Prototype
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  Annual rent
                </p>
                <p className="mt-1 text-xl font-bold text-[var(--forest)]">
                  ₦250,000
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  Required fees
                </p>
                <p className="mt-1 text-xl font-bold text-[var(--forest)]">
                  ₦15,000
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  Distance
                </p>
                <p className="mt-1 font-bold text-[var(--forest)]">
                  Near campus
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  Availability
                </p>
                <p className="mt-1 font-bold text-[var(--forest)]">
                  Updated recently
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 left-4 max-w-[250px] rounded-3xl bg-[var(--gold)] p-5 shadow-xl sm:left-2">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink)]/70">
              Student-first detail
            </p>
            <p className="mt-2 text-lg font-bold leading-6 text-[var(--ink)]">
              See mandatory costs before you decide.
            </p>
          </div>

          <div className="absolute bottom-8 right-4 max-w-[245px] rounded-3xl border border-white/10 bg-white/10 p-5 text-white backdrop-blur sm:right-2">
            <p className="text-xs font-bold uppercase tracking-wide text-white/55">
              Next step
            </p>
            <p className="mt-2 text-lg font-bold leading-6">
              Request an inspection when the details make sense.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
