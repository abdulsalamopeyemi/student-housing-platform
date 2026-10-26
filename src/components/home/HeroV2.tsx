import Link from "next/link";

import {
  getUniversities,
  getUniversityBySlug,
  type University,
} from "@/lib/data/universities";

const heroImageUrl =
  "https://images.unsplash.com/photo-1751239837215-c21ca4571663?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

const trustItems = [
  { label: "Location-led", note: "Start with your campus" },
  { label: "Clear costs", note: "See required fees early" },
  { label: "Inspection-first", note: "Visit before deciding" },
];

export default async function HeroV2() {
  let universityLabel = "KWASU · Malete";
  let universities: University[] = [];

  try {
    const [university, universityDirectory] = await Promise.all([
      getUniversityBySlug("kwasu"),
      getUniversities(),
    ]);

    universities = universityDirectory;

    if (university) {
      universityLabel = `${university.name} · ${university.city}`;
    }
  } catch {
    // Keep the homepage usable if the public database lookup is temporarily unavailable.
  }

  return (
    <section
      className="relative isolate min-h-[650px] overflow-hidden bg-[var(--forest)] text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(10, 35, 29, 0.92) 0%, rgba(10, 35, 29, 0.78) 38%, rgba(10, 35, 29, 0.34) 68%, rgba(10, 35, 29, 0.18) 100%), url("${heroImageUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.24))]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl flex-col px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex max-w-2xl flex-1 flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Student housing around {universityLabel}
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Find a student room that fits your life near campus.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
            Search by area and budget, compare the important details, and
            request an inspection before making a serious accommodation
            decision.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--cream)]"
            >
              Find a room
            </Link>

            <Link
              href="/list-property"
              className="rounded-xl border border-white/45 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              List a property
            </Link>
          </div>

          <form
            action="/explore"
            method="get"
            className="mt-8 grid gap-3 rounded-2xl border border-white/15 bg-black/20 p-3 backdrop-blur-md sm:grid-cols-[1.2fr_0.8fr_auto]"
            aria-label="Search student accommodation"
          >
            <label>
              <span className="mb-1.5 block px-1 text-[11px] font-bold uppercase tracking-wide text-white/65">
                University
              </span>

              <select
                required
                name="university"
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
              >
                <option value="">Select a university</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block px-1 text-[11px] font-bold uppercase tracking-wide text-white/65">
                Maximum budget
              </span>

              <select
                name="budget"
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none"
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
              className="self-end rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-bold text-[var(--ink)] transition hover:brightness-105"
            >
              Search homes
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.label} className="pr-6">
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
