import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--forest)] text-sm font-bold text-white">
            SH
          </div>

          <div>
            <p className="font-bold text-[var(--forest)]">Student Housing</p>
            <p className="text-xs text-[var(--muted)]">
              Find a place you can trust
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <Link
            href="/explore"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            Explore homes
          </Link>

          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            How it works
          </Link>

          <Link
            href="/list-property"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            List a property
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-[var(--forest)] sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/explore"
            className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
