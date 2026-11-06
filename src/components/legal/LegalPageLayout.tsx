import type { ReactNode } from "react";

import { SUPPORT_EMAIL } from "@/lib/support";

interface LegalSection {
  title: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  eyebrow,
  title,
  summary,
  sections,
}: LegalPageLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20">
      <header className="border-b border-[var(--border)] pb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {summary}
        </p>
        <p className="mt-6 inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-900">
          Draft for review · Not final legal advice
        </p>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Prepared 4 November 2026 · Operator name and legal jurisdiction need
          confirmation before launch.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="border-b border-[var(--border)] py-5 last:border-0"
          >
            <h2 className="text-xl font-bold text-[var(--forest)]">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-8 rounded-2xl bg-[var(--forest)] p-6 text-white">
        <h2 className="text-lg font-bold">Questions or a privacy request?</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Contact the Student Housing support desk at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-semibold text-white underline decoration-[var(--gold)] underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </aside>
    </article>
  );
}
