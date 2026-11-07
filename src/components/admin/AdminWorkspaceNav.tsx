import Link from "next/link";

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
    <nav
      aria-label="Admin workspace"
      className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white p-2"
    >
      <Link
        href="/admin/reviews"
        aria-current={current === "reviews" ? "page" : undefined}
        className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          current === "reviews"
            ? "bg-[var(--forest)] text-white"
            : "text-[var(--muted)] hover:bg-[var(--cream)] hover:text-[var(--forest)]"
        }`}
      >
        Review queues
      </Link>
      {reviewLanes.map((lane) => (
        <Link
          key={lane.href}
          href={lane.href}
          className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--cream)] hover:text-[var(--forest)]"
        >
          {lane.label}
        </Link>
      ))}
      <Link
        href="/admin/payments"
        aria-current={current === "payments" ? "page" : undefined}
        className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          current === "payments"
            ? "bg-[var(--forest)] text-white"
            : "text-[var(--muted)] hover:bg-[var(--cream)] hover:text-[var(--forest)]"
        }`}
      >
        Payout setup
      </Link>
    </nav>
  );
}
