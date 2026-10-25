import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import MobileMenu from "@/components/layout/MobileMenu";
import { getCurrentAccount } from "@/lib/data/account";

function accountDestination(role: "student" | "provider" | "admin" | null) {
  if (role === "admin") {
    return { href: "/admin/reviews", label: "Admin dashboard" };
  }

  if (role === "provider") {
    return { href: "/list-property", label: "Provider dashboard" };
  }

  return { href: "/explore", label: "Explore homes" };
}

export default async function SiteHeader() {
  const { user, profile } = await getCurrentAccount();
  const destination = accountDestination(profile?.role ?? null);

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

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={destination.href}
                className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
              >
                {destination.label}
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="px-2 py-2 text-sm font-semibold text-[var(--forest)] underline underline-offset-4"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[var(--forest)]"
              >
                Sign in
              </Link>

              <Link
                href="/explore"
                className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <MobileMenu
          isAuthenticated={Boolean(user)}
          role={profile?.role ?? null}
        />
      </div>
    </header>
  );
}
