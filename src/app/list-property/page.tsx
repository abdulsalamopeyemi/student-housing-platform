import { Suspense } from "react";

import ListPropertyContent from "@/components/provider/ListPropertyContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface ListPropertyPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default function ListPropertyPage({
  searchParams,
}: ListPropertyPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading provider workspace"
              aria-busy="true"
              className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20"
            >
              <span className="sr-only">Loading provider workspace…</span>
              <div className="ui-skeleton h-56 rounded-3xl border border-[var(--border)]" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="ui-skeleton h-28 rounded-2xl border border-[var(--border)]"
                  />
                ))}
              </div>
              <div className="ui-skeleton mt-10 h-40 rounded-3xl border border-[var(--border)]" />
              <div className="ui-skeleton mt-8 h-72 rounded-3xl border border-[var(--border)]" />
            </div>
          }
        >
          <ListPropertyContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
