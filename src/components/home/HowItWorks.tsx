const steps = [
  {
    number: "01",
    title: "Search by campus and budget",
    description:
      "Start with where you study, what you can afford, and the room type that suits you.",
  },
  {
    number: "02",
    title: "Compare the important details",
    description:
      "Check price, facilities, availability, location context, and trust information side by side.",
  },
  {
    number: "03",
    title: "Request an inspection",
    description:
      "When a place looks right, request a viewing or register your interest before making a decision.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-[var(--cream)] py-20 sm:scroll-mt-28 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
            A clearer path from search to inspection.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            We want students to understand a property before spending transport
            money, inspection fees, or making payments.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-3xl border border-[var(--border)] bg-white p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-bold text-white">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[var(--forest)]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
