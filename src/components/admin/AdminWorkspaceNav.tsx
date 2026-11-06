import Link from "next/link";

import { adminSignOut } from "@/app/admin/sign-in/actions";

type AdminWorkspaceSection = "reviews" | "payments";

interface AdminWorkspaceNavProps {
  current: AdminWorkspaceSection;
}

const reviewLanes = [
  { href: "/admin/reviews#providers", label: "Providers" },
  { href: "/admin/reviews#properties", label: "Listings" },
  { href: "/admin/reviews#reports", label: "Reports" },
  { href: "/admin/reviews#support", label: "Support" },
];

export default function AdminWorkspaceNav({
  current,
}: AdminWorkspaceNavProps) {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-5">
          <Link
            href="/admin/reviews"
            className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--emerald)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--forest)] text-xs font-black tracking-wide text-[var(--gold)]">
              SH
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[var(--forest)]">
                Student Housing
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.17em] text-[var(--muted)]">
                Operations desk
              </span>
            </span>
          </Link>

          <form action={adminSignOut} className="shrink-0">
            <button
              type="submit"
              className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)] sm:px-4"
            >
              <span className="hidden sm:inline">Sign out</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </form>
        </div>

        <nav
          aria-label="Admin workspace"
          className="-mb-px flex gap-1 overflow-x-auto border-t border-[var(--border)]"
        >
          <Link
            href="/admin/reviews"
            aria-current={current === "reviews" ? "page" : undefined}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${
              current === "reviews"
                ? "border-[var(--gold)] text-[var(--forest)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--forest)]"
            }`}
          >
            Overview
          </Link>
          {reviewLanes.map((lane) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--border)] hover:text-[var(--forest)] sm:px-4"
            >
              {lane.label}
            </Link>
          ))}
          <Link
            href="/admin/payments"
            aria-current={current === "payments" ? "page" : undefined}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm font-bold transition sm:px-4 ${
              current === "payments"
                ? "border-[var(--gold)] text-[var(--forest)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--forest)]"
            }`}
          >
            Payout setup
          </Link>
        </nav>
      </div>
    </header>
  );
}
