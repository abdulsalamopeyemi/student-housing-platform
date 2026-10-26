import { Suspense } from "react";

import CheckEmailContent from "@/components/auth/CheckEmailContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface CheckEmailPageProps {
  searchParams: Promise<{
    email?: string;
    next?: string;
    error?: string;
    message?: string;
  }>;
}

export default function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center bg-[var(--paper)] px-5 py-16">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-xl animate-pulse rounded-3xl border border-[var(--border)] bg-white p-10">
              <div className="h-8 w-48 rounded bg-[var(--cream)]" />
              <div className="mt-5 h-4 w-full rounded bg-[var(--cream)]" />
              <div className="mt-3 h-4 w-3/4 rounded bg-[var(--cream)]" />
            </div>
          }
        >
          <CheckEmailContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
