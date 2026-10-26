"use client";

import Link from "next/link";
import { useState } from "react";

import { signOut } from "@/app/auth/actions";

interface MobileMenuProps {
  isAuthenticated: boolean;
  role: "student" | "provider" | "admin" | null;
}

function accountDestination(role: MobileMenuProps["role"]) {
  if (role === "admin") {
    return { href: "/admin/reviews", label: "Admin dashboard" };
  }

  if (role === "provider") {
    return { href: "/list-property", label: "Provider dashboard" };
  }

  return { href: "/account", label: "My account" };
}

export default function MobileMenu({
  isAuthenticated,
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
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--forest)]"
      >
        <span className="sr-only">
          {isOpen ? "Close navigation menu" : "Open navigation menu"}
        </span>

        <span className="text-xl leading-none" aria-hidden="true">
          {isOpen ? "×" : "☰"}
        </span>
      </button>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-5 right-5 top-[76px] z-50 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl shadow-black/10"
        >
          <div className="flex flex-col">
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
                  href="/login#signup"
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
