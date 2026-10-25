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

  return { href: "/account", label: "My account" };
}

export default async function HeaderAccountControls() {
  const { user, profile } = await getCurrentAccount();
  const destination = accountDestination(profile?.role ?? null);

  return (
    <>
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
              href="/login#signup"
              className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
            >
              Create account
            </Link>
          </>
        )}
      </div>

      <MobileMenu
        isAuthenticated={Boolean(user)}
        role={profile?.role ?? null}
      />
    </>
  );
}

export function HeaderAccountFallback() {
  return (
    <>
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="text-sm font-semibold text-[var(--forest)]"
        >
          Sign in
        </Link>

        <Link
          href="/login#signup"
          className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Create account
        </Link>
      </div>

      <MobileMenu isAuthenticated={false} role={null} />
    </>
  );
}
