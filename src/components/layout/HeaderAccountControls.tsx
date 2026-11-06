import Link from "next/link";

import AccountMenu from "@/components/layout/AccountMenu";
import MobileMenu from "@/components/layout/MobileMenu";
import { getCurrentAccount } from "@/lib/data/account";

export default async function HeaderAccountControls() {
  const { user, profile } = await getCurrentAccount();
  const name =
    profile?.full_name?.trim() || user?.user_metadata?.full_name || "";
  const email = user?.email ?? "";
  const role =
    profile?.role === "admin" || profile?.role === "provider"
      ? profile.role
      : user?.user_metadata?.account_type === "provider"
        ? "provider"
        : profile?.role ?? null;

  return (
    <>
      <div className="hidden items-center gap-3 md:flex">
        {user ? (
          <AccountMenu email={email} name={name} role={role} />
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-semibold text-[var(--forest)]"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
            >
              Create account
            </Link>
          </>
        )}
      </div>

      <MobileMenu
        isAuthenticated={Boolean(user)}
        email={email}
        name={name}
        role={role}
      />
    </>
  );
}

export function HeaderAccountFallback() {
  return (
    <>
      <div className="hidden items-center gap-3 md:flex">
        <span
          aria-hidden="true"
          className="size-10 animate-pulse rounded-full bg-[var(--cream)] motion-reduce:animate-none"
        />
      </div>

      <div className="flex items-center gap-2 md:hidden" aria-hidden="true">
        <span className="size-9 animate-pulse rounded-full bg-[var(--cream)] motion-reduce:animate-none" />
        <span className="size-11 animate-pulse rounded-xl bg-[var(--cream)] motion-reduce:animate-none" />
      </div>
    </>
  );
}
