export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-5 w-fit rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--emerald)]">
            Student housing, made clearer
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-[var(--forest)] sm:text-6xl">
            Find a student home you can trust.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Compare clear prices, facilities, availability and property
            information near your campus before you spend your time or money.
          </p>

          <form
            action="/explore"
            method="get"
            className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-lg shadow-black/5"
            aria-label="Search student accommodation"
          >
            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
              <label>
                <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                  University or area
                </span>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. KWASU, Malete"
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                  Maximum budget
                </span>

                <select
                  name="budget"
                  defaultValue=""
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
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
                className="self-end rounded-xl bg-[var(--forest)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
              >
                Search homes
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Start with Malete · More university communities coming later.
          </p>
        </div>

        <div className="relative min-h-[420px]" aria-label="Example property preview">
          <div className="absolute inset-0 rounded-[2rem] bg-[var(--forest)]" />

          <div className="absolute left-6 right-6 top-6 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white/70">
              Example property
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Victory Lodge
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Malete · Near KWASU
            </p>

            <div className="mt-6 rounded-2xl bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Annual rent
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[var(--forest)]">
                    ₦250,000
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[var(--emerald)]">
                  Available
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[var(--muted)]">
                <div className="rounded-xl bg-[var(--cream)] p-3">
                  Water available
                </div>
                <div className="rounded-xl bg-[var(--cream)] p-3">
                  Private bathroom
                </div>
                <div className="rounded-xl bg-[var(--cream)] p-3">
                  Near campus
                </div>
                <div className="rounded-xl bg-[var(--cream)] p-3">
                  2 rooms left
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-[var(--gold)] p-5">
            <p className="text-sm font-bold text-[var(--ink)]">
              Clear information before you make a decision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
