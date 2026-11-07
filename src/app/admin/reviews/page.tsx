import { Suspense } from "react";

import AdminReviewContent from "@/components/admin/AdminReviewContent";
import AdminWorkspaceNav from "@/components/admin/AdminWorkspaceNav";

interface AdminReviewsPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  return (
    <>
      <AdminWorkspaceNav current="reviews" />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div
              role="status"
              aria-busy="true"
              aria-label="Loading admin review queues"
              className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16"
            >
              <span className="sr-only">Loading admin review queues…</span>
              <div className="ui-skeleton h-64 rounded-3xl" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="ui-skeleton h-20 rounded-2xl border border-[var(--border)]"
                  />
                ))}
              </div>
              <div className="mt-8 grid gap-4">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="ui-skeleton h-56 rounded-3xl border border-[var(--border)]"
                  />
                ))}
              </div>
            </div>
          }
        >
          <AdminReviewContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
