const trustPoints = [
  {
    title: "Clear price breakdowns",
    description:
      "Important costs should be visible before a student decides to continue.",
  },
  {
    title: "Availability timestamps",
    description:
      "Listings should show when room availability was last confirmed.",
  },
  {
    title: "Verification with meaning",
    description:
      "A verified label should only appear after a defined review process.",
  },
  {
    title: "Reporting and support",
    description:
      "Students need a clear way to flag suspicious information or bad experiences.",
  },
];

export default function TrustAndSafety() {
  return (
    <section className="bg-[var(--forest)] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--gold)]">
            Trust is part of the product
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Better information before money changes hands.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
            We cannot promise that every risk disappears. What we can build is
            a system that makes important information easier to inspect,
            compare, question, and report.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <article
              key={point.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div
                className="mb-5 h-2 w-10 rounded-full bg-[var(--gold)]"
                aria-hidden="true"
              />
              <h3 className="text-lg font-bold">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
