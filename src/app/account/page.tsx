import { Suspense } from "react";

import StudentAccountContent from "@/components/account/StudentAccountContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface AccountPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default function AccountPage({ searchParams }: AccountPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div
              role="status"
              aria-busy="true"
              aria-label="Loading student portal"
              className="mx-auto max-w-6xl px-5 py-16 lg:px-8"
            >
              <span className="sr-only">Loading student portal…</span>
              <div className="ui-skeleton h-52 rounded-3xl" />
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="ui-skeleton h-72 rounded-3xl" />
                <div className="ui-skeleton h-72 rounded-3xl" />
              </div>
            </div>
          }
        >
          <StudentAccountContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
