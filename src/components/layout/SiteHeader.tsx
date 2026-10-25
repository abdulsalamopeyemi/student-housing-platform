import Link from "next/link";
import { Suspense } from "react";

import HeaderAccountControls, {
  HeaderAccountFallback,
} from "@/components/layout/HeaderAccountControls";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--paper)]/95 shadow-sm backdrop-blur">
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

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          <Link
            href="/explore"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            Explore homes
          </Link>

          <a
            href="/#how-it-works"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            How it works
          </a>

          <Link
            href="/list-property"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
          >
            List a property
          </Link>
        </nav>

        <Suspense fallback={<HeaderAccountFallback />}>
          <HeaderAccountControls />
        </Suspense>
      </div>
    </header>
  );
}
