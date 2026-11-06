const trustItems = [
  "Clear pricing",
  "Real availability",
  "Property information",
  "Safer enquiries",
];

export default function TrustStrip() {
  return (
    <section
      className="border-y border-[var(--border)] bg-white"
      aria-label="Platform trust principles"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-6 md:grid-cols-4 lg:px-8">
        {trustItems.map((item) => (
          <div
            key={item}
            className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-[var(--forest)]"
          >
            <span
              className="h-2 w-2 rounded-full bg-[var(--gold)]"
              aria-hidden="true"
            />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
