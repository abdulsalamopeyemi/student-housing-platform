import { Suspense } from "react";

import AdminReviewContent from "@/components/admin/AdminReviewContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface AdminReviewsPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
              <div className="h-20 animate-pulse rounded-3xl bg-[var(--cream)]" />
            </div>
          }
        >
          <AdminReviewContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
