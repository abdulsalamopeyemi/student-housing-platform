"use client";

import Link from "next/link";
import { useState } from "react";

import { signOut } from "@/app/auth/actions";
import AccountRoleIcon from "@/components/layout/AccountRoleIcon";

interface MobileMenuProps {
  isAuthenticated: boolean;
  email: string;
  name: string;
  role: "student" | "provider" | "admin" | null;
}

function accountDestination(role: MobileMenuProps["role"]) {
  if (role === "admin") {
    return { href: "/admin/reviews", label: "Admin dashboard" };
  }

  if (role === "provider") {
    return { href: "/list-property", label: "Landlord workspace" };
  }

  return { href: "/account", label: "Tenant portal" };
}

function roleLabel(role: MobileMenuProps["role"]) {
  if (role === "provider") {
    return "Landlord account";
  }

  if (role === "admin") {
    return "Administrator account";
  }

  return "Tenant account";
}

export default function MobileMenu({
  isAuthenticated,
  email,
  name,
  role,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const destination = accountDestination(role);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-2 text-[var(--forest)]"
      >
        <span className="sr-only">
          {isOpen ? "Close navigation menu" : "Open navigation menu"}
        </span>

        <span className="flex items-center gap-2" aria-hidden="true">
          {isAuthenticated ? (
            <span className="relative grid size-8 place-items-center rounded-full bg-[var(--forest)] text-xs font-bold text-white">
              {(name.trim() || email.split("@")[0] || "?")
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("")}
              <span aria-hidden="true" className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border-2 border-white bg-[var(--gold)] text-[var(--forest)]">
                <AccountRoleIcon
                  role={role ?? "student"}
                  className="size-2.5"
                />
              </span>
            </span>
          ) : null}
          <span className="text-xl leading-none">{isOpen ? "×" : "☰"}</span>
        </span>
      </button>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-5 right-5 top-[76px] z-50 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl shadow-black/10"
        >
          <div className="flex flex-col">
            {isAuthenticated ? (
              <div className="mb-2 rounded-xl bg-[var(--cream)] px-4 py-3">
                <p className="truncate text-sm font-bold text-[var(--forest)]">
                  {name.trim() || "Your account"}
                </p>
                <p className="mt-1 break-all text-xs text-[var(--muted)]">
                  {email}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[var(--emerald)]">
                  {roleLabel(role)}
                </p>
              </div>
            ) : null}

            <Link
              href="/explore"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--cream)]"
            >
              Explore homes
            </Link>

            {/* Native anchor avoids a stale Next.js route tree on hash navigation. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#how-it-works"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--cream)]"
            >
              How it works
            </a>

            <Link
              href="/list-property"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--cream)]"
            >
              List a property
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href={destination.href}
                  onClick={closeMenu}
                  className="mt-2 rounded-xl bg-[var(--forest)] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {destination.label}
                </Link>

                <form action={signOut} className="mt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold text-[var(--forest)]"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-2 grid gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold text-[var(--forest)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="rounded-xl bg-[var(--forest)] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
