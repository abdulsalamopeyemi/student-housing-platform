import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-5">
      <div className="max-w-xl rounded-3xl border border-[var(--border)] bg-white p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--forest)]">
          We could not find that page.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          The address may be incorrect, or the page may have moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
