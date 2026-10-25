import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--cream)] px-5">
      <div className="max-w-xl rounded-3xl border border-[var(--border)] bg-white p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Property not found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--forest)]">
          We could not find that accommodation.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          The listing may have moved, been removed, or the link may be incorrect.
        </p>

        <Link
          href="/explore"
          className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
        >
          Explore homes
        </Link>
      </div>
    </main>
  );
}
