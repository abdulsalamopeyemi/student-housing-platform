import { Suspense } from "react";

import AdminPaymentsContent from "@/components/admin/AdminPaymentsContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div
              role="status"
              aria-label="Loading provider payout setup"
              aria-busy="true"
              className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16"
            >
              <span className="sr-only">Loading provider payout setup…</span>
              <div className="ui-skeleton h-4 w-36 rounded" />
              <div className="ui-skeleton mt-8 h-10 max-w-xl rounded-2xl" />
              <div className="ui-skeleton mt-4 h-6 max-w-2xl rounded" />
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="ui-skeleton h-28 rounded-2xl border border-[var(--border)]"
                  />
                ))}
              </div>
              <div className="mt-8 grid gap-4">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="ui-skeleton h-56 rounded-3xl border border-[var(--border)]"
                  />
                ))}
              </div>
            </div>
          }
        >
          <AdminPaymentsContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
