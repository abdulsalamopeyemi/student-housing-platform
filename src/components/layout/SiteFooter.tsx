import Link from "next/link";

const footerLinks = [
  { label: "Explore homes", href: "/explore" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "List a property", href: "/list-property" },
  { label: "Sign in", href: "/login" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--forest)] text-sm font-bold text-white">
              SH
            </div>

            <div>
              <p className="font-bold text-[var(--forest)]">Student Housing</p>
              <p className="text-xs text-[var(--muted)]">
                Find a place you can trust
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--muted)]">
            A student accommodation product being designed first around the
            KWASU and Malete community, with room to expand later.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="font-medium text-[var(--muted)] transition hover:text-[var(--forest)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>Student Housing prototype</p>
          <p>Clearer information before accommodation decisions.</p>
        </div>
      </div>
    </footer>
  );
}
