import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import AccountRoleIcon from "@/components/layout/AccountRoleIcon";

interface AccountMenuProps {
  email: string;
  name: string;
  role: "student" | "provider" | "admin" | null;
  compact?: boolean;
}

function roleLabel(role: AccountMenuProps["role"]) {
  if (role === "provider") {
    return "Landlord";
  }

  if (role === "admin") {
    return "Platform administrator";
  }

  return "Tenant";
}

function accountDestination(role: AccountMenuProps["role"]) {
  if (role === "admin") {
    return { href: "/admin/reviews", label: "Admin workspace" };
  }

  if (role === "provider") {
    return { href: "/list-property", label: "Landlord workspace" };
  }

  return { href: "/account", label: "Tenant portal" };
}

function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AccountMenu({
  email,
  name,
  role,
  compact = false,
}: AccountMenuProps) {
  const destination = accountDestination(role);
  const displayName = name.trim() || "Your account";

  return (
    <details className="group relative">
      <summary
        aria-label={`Open account menu for ${email || displayName}`}
        className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--border)] bg-white p-1.5 text-left transition hover:border-[var(--emerald)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)] [&::-webkit-details-marker]:hidden"
      >
        <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[var(--forest)] text-xs font-bold tracking-wide text-white">
          {initials(name, email)}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-white bg-[var(--gold)] text-[var(--forest)]"
          >
            <AccountRoleIcon
              role={role ?? "student"}
              className="size-3"
            />
          </span>
        </span>
        {!compact ? (
          <>
            <span className="hidden min-w-0 pr-1 sm:block">
              <span className="block max-w-36 truncate text-sm font-bold text-[var(--forest)]">
                {displayName}
              </span>
              <span className="block text-[11px] text-[var(--muted)]">
                {roleLabel(role)}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mr-1 text-xs text-[var(--muted)] transition-transform group-open:rotate-180"
            >
              ▼
            </span>
          </>
        ) : null}
      </summary>

      <div className="absolute right-0 z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-2 shadow-xl shadow-black/10">
        <div className="border-b border-[var(--border)] px-3 py-3">
          <p className="truncate text-sm font-bold text-[var(--forest)]">
            {displayName}
          </p>
          <p className="mt-1 break-all text-xs text-[var(--muted)]">{email}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--emerald)]">
            {roleLabel(role)}
          </p>
        </div>

        <Link
          href={destination.href}
          className="mt-2 flex rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--cream)] focus-visible:outline-2 focus-visible:outline-[var(--emerald)]"
        >
          {destination.label}
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
